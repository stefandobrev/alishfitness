import pytest
from django.contrib.auth.hashers import check_password
from rest_framework.exceptions import ValidationError, AuthenticationFailed

from api.models import User
from api.serializers.user_serializers import (
    UserSerializer,
    LoginSerializer,
    UserProfileSerializer,
    UserSettingsSerializer,
    UpdatePasswordSerializer,
    TokenRefreshSerializer,
)

@pytest.fixture
def test_user():
    user = User.objects.create_user(
        first_name="test",
        last_name="user",
        username="testuser",
        email="test@example.com",
        password="Securepass123",
    )
    return user

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
        assert "This username is already taken." in serializer.errors["username"][0]
    
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

@pytest.mark.django_db(transaction=True)
class TestLoginSerializer:
    @pytest.fixture
    def valid_login_data(self, ):
       return {
            "login_username": "testuser",
            "login_password": "Securepass123"
       } 
    
    def test_valid_login(self, valid_login_data, test_user):
        data = valid_login_data.copy()

        serializer = LoginSerializer(data=data)
        assert serializer.is_valid()
        assert "user" in serializer.validated_data
        assert serializer.validated_data["user"] == test_user

    def test_case_insensitive_username(self, valid_login_data, test_user):
        data = valid_login_data.copy()
        data["login_username"] = "TestUser" 
        
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
class TestUserProfileSerializer:
    def test_valid_profile(self):
        profile_data = {
            "first_name": "Test",
            "last_name": "User",
        }

        serializer = UserProfileSerializer(data=profile_data)

        assert serializer.is_valid()
        assert serializer.validated_data["first_name"] == "Test"

    def test_invalid_profile(self):
        profile_data = {
            "first_name": "",
            "last_name": "",
        }

        serializer = UserProfileSerializer(data=profile_data)

        assert not serializer.is_valid()
        with pytest.raises(ValidationError) as exc_info:
            serializer.is_valid(raise_exception=True)
        assert "At least one field must be provided" in str(exc_info.value)
       
@pytest.mark.django_db(transaction=True)
class TestUserSettingsSerializer:    
    def test_valid_settings(self, test_user):
        valid_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "Securepass123",
            "confirm_password": "Securepass123",
        }
        serializer = UserSettingsSerializer(instance=test_user, data=valid_data)
        assert serializer.is_valid()
        
    def test_incorrect_password(self, test_user):
        invalid_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "WrongPassword123",  
            "confirm_password": "WrongPassword123",
        }
        serializer = UserSettingsSerializer(instance=test_user, data=invalid_data)
        assert not serializer.is_valid()
        assert "password" in serializer.errors
        
    def test_passwords_dont_match(self, test_user):
        invalid_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "Securepass123",  
            "confirm_password": "wrongconfirm",  
        }
        serializer = UserSettingsSerializer(instance=test_user, data=invalid_data)
        assert not serializer.is_valid()
        assert "confirm_password" in serializer.errors
        
    def test_username_already_taken(self, test_user):
        User.objects.create_user(username="existinguser", email="existing@example.com", password="AnotherPass123")
        
        invalid_data = {
            "username": "existinguser",  
            "email": "test@example.com",
            "password": "Securepass123",
            "confirm_password": "Securepass123",
        }
        serializer = UserSettingsSerializer(instance=test_user, data=invalid_data)
        assert not serializer.is_valid()
        assert "username" in serializer.errors
        
    def test_email_already_taken(self, test_user):
        User.objects.create_user(username="anotheruser", email="taken@example.com", password="AnotherPass123")
        
        invalid_data = {
            "username": "testuser",
            "email": "taken@example.com",  
            "password": "Securepass123",
            "confirm_password": "Securepass123",
        }
        serializer = UserSettingsSerializer(instance=test_user, data=invalid_data)
        assert not serializer.is_valid()
        assert "email" in serializer.errors

    def test_update(self, test_user):
        valid_update_data = {
            "username": "UpdatedUser",
            "email": "updated@example.com",  
            "password": "Securepass123",
            "confirm_password": "Securepass123",
        }

        serializer = UserSettingsSerializer(instance=test_user, data=valid_update_data)
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
class TestUpdatePasswordSerializer:
    def test_valid_password(self, test_user):
        request = type("Request", (), {"user": test_user})()

        valid_data = {
            "current_password": "Securepass123",
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
            "current_password": "Securepass123", 
            "new_password": "Securepass123",
            "confirm_password": "Securepass123",
        }

        serializer = UpdatePasswordSerializer(
            data=same_password_data,
            context={'request': request}
        )
        
        assert not serializer.is_valid()
        assert "new_password" in serializer.errors

    def test_passwords_dont_match(self, test_user):
        request = type('Request', (), {'user': test_user})()
        
        invalid_data = {
            "current_password": "Securepass123",  
            "new_password": "NewSecurepass123",
            "confirm_password": "DifferentPassword123", 
        }
        
        serializer = UpdatePasswordSerializer(
            data=invalid_data,
            context={'request': request}
        )
        
        assert not serializer.is_valid()
        assert "confirm_password" in serializer.errors

@pytest.mark.django_db(transaction=True)
class TestTokenRefreshSerializer:
    def test_valid_refresh(self):
        pass