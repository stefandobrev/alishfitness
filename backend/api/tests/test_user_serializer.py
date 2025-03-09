import pytest
from django.contrib.auth.hashers import check_password
from rest_framework.exceptions import ValidationError, AuthenticationFailed

from api.models import User
from api.serializers.user_serializers import UserSerializer, LoginSerializer

@pytest.mark.django_db(transaction=True)
class TestUserSerializer:
    def setup_method(self):
        self.test_user = User.objects.create_user(
            first_name= "test",
            last_name= "user",
            username= "testuser",
            email= "test@example.com",
            password= "Securepass123",
        )

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

    def test_username_uniqueness(self, valid_user_data):
        data = valid_user_data.copy()
        data["username"] = self.test_user.username
        
        serializer = UserSerializer(data=data)
        assert not serializer.is_valid()
        assert "username" in serializer.errors
        assert "This username is already taken." in serializer.errors["username"][0]
    
    def test_email_uniqueness(self, valid_user_data):
        data = valid_user_data.copy()
        data["email"] = self.test_user.email
        
        serializer = UserSerializer(data=data)
        assert not serializer.is_valid()
        assert "email" in serializer.errors
        assert "This email is already registered." in serializer.errors["email"][0]

        data["email"] = self.test_user.email.upper()
        serializer = UserSerializer(data=data)
        assert not serializer.is_valid()
        assert "email" in serializer.errors
        assert "This email is already registered." in serializer.errors["email"][0]