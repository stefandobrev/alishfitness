import pytest
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from rest_framework.exceptions import AuthenticationFailed

from datetime import datetime, timezone

from api.models import User
from api.serializers.user_serializers import (
    UserSerializer,
    LoginSerializer,
    UpdatePasswordSerializer,
    TokenRefreshSerializer,
)

@pytest.mark.django_db(transaction=True)
class TestUserSerializer:
    @pytest.fixture
    def valid_user_data(self):
        return {
            "username": "newuser",
            "email": "new@example.com",
            "first_name": "New",
            "last_name": "User",
            "password": "Password123",
            "confirm_password": "Password123",
        }
    
    def test_valid_user_serializer(self, valid_user_data):
        serializer = UserSerializer(data=valid_user_data)
        assert serializer.is_valid(), f"Serializer errors: {serializer.errors}"

    def test_password_mismatch(self, valid_user_data):
        data = valid_user_data.copy()
        data["confirm_password"] = "DifferentPassword123"
        
        serializer = UserSerializer(data=data)
        assert not serializer.is_valid()
        assert "confirm_password" in serializer.errors
        assert "Passwords do not match" in serializer.errors["confirm_password"][0]

    def test_username_uniqueness(self, valid_user_data, test_user):
        data = valid_user_data.copy()
        data["username"] = test_user.username
        
        serializer = UserSerializer(data=data)
        assert not serializer.is_valid()
        assert "username" in serializer.errors
        assert "A user with that username already exists." in serializer.errors["username"][0]

        data["username"] = test_user.username.upper()
        serializer = UserSerializer(data=data)
        assert not serializer.is_valid()
        assert "username" in serializer.errors
        assert "This username is already taken." in serializer.errors["username"][0]

    def test_username_invalid_char(self, valid_user_data):
        data = valid_user_data.copy()
        data["username"] = "Testusername@"

        serializer = UserSerializer(data=data)
        assert not serializer.is_valid()
        assert "username" in serializer.errors
        assert "Username can only contain letters" in serializer.errors["username"][0]

    def test_name_invalid_char(self, valid_user_data):
        data = valid_user_data.copy()
        data["first_name"] = "Test@"

        serializer = UserSerializer(data=data)
        assert not serializer.is_valid()
        assert "first_name" in serializer.errors
        assert "First name can only contain letters" in serializer.errors["first_name"][0]
    
    def test_email_uniqueness(self, valid_user_data, test_user):
        data = valid_user_data.copy()
        data["email"] = test_user.email
        
        serializer = UserSerializer(data=data)
        assert not serializer.is_valid()
        assert "email" in serializer.errors
        assert "This email is already registered." in serializer.errors["email"][0]

        data["email"] = test_user.email.upper()
        serializer = UserSerializer(data=data)
        assert not serializer.is_valid()
        assert "email" in serializer.errors
        assert "This email is already registered." in serializer.errors["email"][0]

    def test_create_success(self,valid_user_data):
        data = valid_user_data.copy()

        serializer = UserSerializer(data=data)
        assert serializer.is_valid()

        user = serializer.save()
        assert hasattr(user, "email")
        assert not hasattr(user, "confirm_password")

        assert user.password != data["password"]
        assert check_password(data["password"], user.password)

        assert user.username == data["username"].lower()
        assert user.email == data["email"].lower()

    def test_update_valid_profile(self):
        profile_data = {
            "first_name": "Test",
            "last_name": "User",
        }

        serializer = UserSerializer(data=profile_data, partial=True)

        assert serializer.is_valid()
        assert serializer.validated_data["first_name"] == "Test"

    def test_update_invalid_profile(self):
        profile_data = {
            "first_name": "",
            "last_name": "Test",
        }

        serializer = UserSerializer(data=profile_data, partial=True)

        assert not serializer.is_valid()
        assert "first_name" in serializer.errors
               
    def test_incorrect_password_settings(self, test_user):
        invalid_data = {
            "username": "testuser",
            "email": "test@email.com",
            "password": "WrongPassword123",  
            "confirm_password": "WrongPassword123",
        }
        serializer = UserSerializer(instance=test_user, data=invalid_data, partial=True)
        assert not serializer.is_valid()
        assert "password" in serializer.errors
        
    def test_passwords_dont_match_settings(self, test_user):
        invalid_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "securepassword123",  
            "confirm_password": "wrongconfirm",  
        }
        serializer = UserSerializer(instance=test_user, data=invalid_data, partial=True)
        assert not serializer.is_valid()
        assert "confirm_password" in serializer.errors
        
    def test_username_already_taken_settings(self, test_user):
        User.objects.create_user(username="existinguser", email="existing@example.com", password="AnotherPass123")
        
        invalid_data = {
            "username": "existinguser",  
            "email": "test@example.com",
            "password": "securepassword123",
            "confirm_password": "securepassword123",
        }
        serializer = UserSerializer(instance=test_user, data=invalid_data, partial=True)
        assert not serializer.is_valid()
        assert "username" in serializer.errors
        
    def test_email_already_taken_settings(self, test_user):
        User.objects.create_user(username="anotheruser", email="taken@example.com", password="AnotherPass123")
        
        invalid_data = {
            "username": "testuser",
            "email": "taken@example.com",  
            "password": "securepassword123",
            "confirm_password": "securepassword123",
        }
        serializer = UserSerializer(instance=test_user, data=invalid_data, partial=True)
        assert not serializer.is_valid()
        assert "email" in serializer.errors

    def test_update_settings(self, test_user):
        valid_update_data = {
            "username": "UpdatedUser",
            "email": "updated@example.com",  
            "password": "securepassword123",
            "confirm_password": "securepassword123",
        }

        serializer = UserSerializer(instance=test_user, data=valid_update_data, partial=True)
        assert serializer.is_valid()

        updated_user = serializer.save()
        assert updated_user.username == "updateduser"  
        assert updated_user.email == "updated@example.com"

        assert hasattr(updated_user, "username")
        assert not hasattr(updated_user, "confirm_password")

        db_user = User.objects.get(pk=test_user.pk)
        assert db_user.username == "updateduser"
        assert db_user.email == "updated@example.com"

@pytest.mark.django_db(transaction=True)
class TestLoginSerializer:
    @pytest.fixture
    def valid_login_data(self, test_user):
       return {
            "login_username": "testuser",
            "login_password": "securepassword123"
       } 
    
    def test_valid_login(self, valid_login_data, test_user):
        data = valid_login_data.copy()

        serializer = LoginSerializer(data=data)
        assert serializer.is_valid()
        assert "user" in serializer.validated_data
        assert serializer.validated_data["user"] == test_user

    def test_case_insensitive_username(self, valid_login_data, test_user):
        data = valid_login_data.copy()
        data["login_username"] = "testuser" 
        
        serializer = LoginSerializer(data=data)
        assert serializer.is_valid()
        assert serializer.validated_data["user"] == test_user

    def test_inactive_user(self, valid_login_data, test_user):
        test_user.is_active = False
        test_user.save()
        
        serializer = LoginSerializer(data=valid_login_data)
        with pytest.raises(AuthenticationFailed) as exc_info:
            serializer.is_valid(raise_exception=True)
        assert "Invalid username or password" in str(exc_info.value)

@pytest.mark.django_db(transaction=True)
class TestUpdatePasswordSerializer:
    def test_valid_password(self, test_user):
        request = type("Request", (), {"user": test_user})()

        valid_data = {
            "current_password": "securepassword123",
            "new_password": "NewSecurepass123",
            "confirm_password": "NewSecurepass123",
        }

        serializer = UpdatePasswordSerializer(
            data=valid_data,
            context={"request": request}
        )
        assert serializer.is_valid()

    def test_incorrect_current_password(self, test_user):
        request = type('Request', (), {'user': test_user})()
        
        invalid_data = {
            "current_password": "WrongPassword123", 
            "new_password": "NewSecurepass123",
            "confirm_password": "NewSecurepass123",
        }
        
        serializer = UpdatePasswordSerializer(
            data=invalid_data,
            context={'request': request}
        )
        
        assert not serializer.is_valid()
        assert "current_password" in serializer.errors

        same_password_data = {
            "current_password": "securepassword123", 
            "new_password": "securepassword123",
            "confirm_password": "securepassword123",
        }

        serializer = UpdatePasswordSerializer(
            data=same_password_data,
            context={"request": request}
        )
        
        assert not serializer.is_valid()
        assert "new_password" in serializer.errors

    def test_passwords_dont_match(self, test_user):
        request = type("Request", (), {"user": test_user})()
        
        invalid_data = {
            "current_password": "securepassword123",  
            "new_password": "NewSecurepass123",
            "confirm_password": "DifferentPassword123", 
        }
        
        serializer = UpdatePasswordSerializer(
            data=invalid_data,
            context={"request": request}
        )
        
        assert not serializer.is_valid()
        assert "confirm_password" in serializer.errors

@pytest.mark.django_db(transaction=True)
class TestTokenRefreshSerializer:
    def test_valid_token(self, test_user):
        refresh = RefreshToken()

        OutstandingToken.objects.create(
            jti=refresh["jti"],
            user=test_user,
            created_at=datetime.fromtimestamp(refresh["iat"], tz=timezone.utc).isoformat(),
            expires_at=datetime.fromtimestamp(refresh["exp"], tz=timezone.utc).isoformat(),
        )

        serializer = TokenRefreshSerializer(data={"refresh": str(refresh)})
        assert serializer.is_valid()
        assert str(serializer.validated_data["refresh"]) == str(refresh)

    def test_token_not_in_outstanding_tokens(self):
        refresh = RefreshToken()

        serializer = TokenRefreshSerializer(data={"refresh": str(refresh)})
        assert not serializer.is_valid()
        assert "Token not found in outstanding tokens" in str(serializer.errors["refresh"])

    def test_blacklisted_token(self, test_user):
        refresh = RefreshToken()

        outstanding_token = OutstandingToken.objects.create(
            jti=refresh["jti"],
            user=test_user,
            created_at=datetime.fromtimestamp(refresh["iat"], tz=timezone.utc).isoformat(),
            expires_at=datetime.fromtimestamp(refresh["exp"], tz=timezone.utc).isoformat(),
        )
        BlacklistedToken.objects.create(token=outstanding_token)

        serializer = TokenRefreshSerializer(data={"refresh": str(refresh)})
        assert not serializer.is_valid()
        assert "Token is blacklisted" in str(serializer.errors["refresh"])

    def test_invalid_token(self):
        serializer = TokenRefreshSerializer(data={"refresh": "invalid-token"})
        assert not serializer.is_valid()
        assert "Invalid or expired refresh token" in str(serializer.errors["refresh"])