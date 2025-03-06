import pytest
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from api.models import User
from django.urls import reverse

from django.utils import timezone
from datetime import timedelta

@pytest.mark.django_db(transaction=True)
class TestUserController:
    def setup_method(self):
        self.client = APIClient()

        self.test_user = User.objects.create_user(
                username="testuser",
                email="test@email.com",
                password="securepassword123",
                first_name="test",
                last_name="user"
            )
        
        self.admin_user = User.objects.create_user(
            username="adminuser",
            email="admin@email.com",
            password="adminpassword123",
            first_name="admin",
            last_name="user",
            is_staff=True
        )

    def test_create_user_success(self):
        user_data = {
            "username": "newuser",
            "email": "newuser@email.com",
            "password": "securepassword123",
            "confirm_password": "securepassword123",
            "first_name": "new",
            "last_name": "user",
        }

        url = reverse("create-user")
        response = self.client.post(url, data=user_data, format="json")
        

        assert response.status_code == status.HTTP_201_CREATED
        assert "user" in response.data
        assert isinstance(response.data["user"], dict)
        assert response.data["user"]["username"] == "newuser"
        assert response.data["user"]["email"] == "newuser@email.com"
        assert User.objects.filter(username="newuser").exists()
        assert User.objects.count() == 3 ## andmin and user setup initially

    def test_create_user_validation_error(self):
        invalid_data = {
            "username": "",
            "email": "invalid_email",
            "password": "securepassword123",
            "confirm_password": "securepassword123",
            "first_name": "test",
            "last_name": "user",
        }

        url = reverse("create-user")
        response = self.client.post(url, data=invalid_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert User.objects.count() == 2 ## admin and user setup initially

    def test_login_success(self):
        login_data = {
            "login_username": "adminuser",
            "login_password": "adminpassword123"
        } 

        url = reverse("login-user")
        response = self.client.post(url, data=login_data, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert "message" in response.data
        assert response.data["message"] == "Login successful"
        assert "username" in response.data
        assert response.data["username"] == "adminuser"
        assert "is_admin" in response.data
        assert response.data["is_admin"] is True
        assert "access" in response.data
        assert "refresh" in response.data

    def test_login_admin_success(self):
        login_data = {
            "login_username": "testuser",
            "login_password": "securepassword123"
        } 

        url = reverse("login-user")
        response = self.client.post(url, data=login_data, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert "message" in response.data
        assert response.data["message"] == "Login successful"
        assert "username" in response.data
        assert response.data["username"] == "testuser"
        assert "is_admin" in response.data
        assert response.data["is_admin"] is False
        assert "access" in response.data
        assert "refresh" in response.data

    def test_login_invalid_credentials(self):
        login_data = {
            "login_username": "testuser",
            "login_password": "wrongpassword"
        } 

        url = reverse("login-user")
        response = self.client.post(url, data=login_data, format="json")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "non_field_errors" in response.data

    def test_refresh_token_valid(self):
        login_data = {
            "login_username": "testuser",
            "login_password": "securepassword123"
        } 

        url = reverse("login-user")
        login_response = self.client.post(url, data=login_data, format="json")
        refresh_token = login_response.data["refresh"]

        refresh_data = {
            "refresh": refresh_token
        }
        refresh_url = reverse("refresh-token")

        refresh_response = self.client.post(refresh_url, data=refresh_data, format="json")

        assert refresh_response.status_code == status.HTTP_200_OK
        assert refresh_response.data["message"] == "Token refreshed successfully"
        assert "access" in refresh_response.data
        assert "refresh" in refresh_response.data

    def test_refresh_token_invalid(self):
        refresh_data = {
            "refresh": "invalid-refresh-token"
        }
        
        url = reverse("refresh-token")
        response = self.client.post(url, data=refresh_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_blacklist_token_success(self):
        login_data = {
            "login_username": "testuser",
            "login_password": "securepassword123"
        }
         
        url = reverse("login-user")
        login_response = self.client.post(url, data=login_data, format="json")
        refresh_token = login_response.data["refresh"]

        blacklist_data = {
            "refresh": refresh_token
        }
        blacklist_url = reverse("blacklist-token")

        blacklist_response = self.client.post(blacklist_url, data=blacklist_data, format="json")

        assert blacklist_response.status_code == status.HTTP_200_OK
        assert blacklist_response.data["message"] == "Token blacklisted successfully"

    def test_blacklist_token_missing(self):
        blacklist_data = {}

        url = reverse("blacklist-token")
        response = self.client.post(url, data=blacklist_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data["error"] == "Refresh token is required"

    def test_blacklist_token_invalid(self):
        blacklist_data = {
            "refresh": "invalid-token"
        }

        url = reverse("blacklist-token")
        response = self.client.post(url, data=blacklist_data, format="json")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Invalid or expired refresh token" in response.data["error"]
    
    def test_refresh_token_blacklisted(self):
        login_data = {
            "login_username": "testuser",
            "login_password": "securepassword123",
        }

        login_url = reverse("login-user")
        login_response = self.client.post(login_url, data=login_data, format="json")
        refresh_token = login_response.data["refresh"]

        print("Refresh Token:", refresh_token)

        blacklist_url = reverse("blacklist-token")
        blacklist_response = self.client.post(blacklist_url, data={"refresh": refresh_token}, format="json")

        print("Blacklist Response:", blacklist_response.data)

        refresh_url = reverse("refresh-token")
        refresh_response = self.client.post(refresh_url, data={"refresh": refresh_token}, format="json")

        assert refresh_response.status_code == status.HTTP_400_BAD_REQUEST

    def test_refresh_token_expired(self):
        refresh = RefreshToken.for_user(self.test_user)
        refresh.set_exp(from_time=timezone.now() - timedelta(days=1))

        refresh_data = {
            "refresh": str(refresh),
        }
        url = reverse("refresh-token")

        response = self.client.post(url, data=refresh_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_get_profile(self):
        self.client.force_authenticate(user=self.test_user)

        url = reverse("profile")
        response = self.client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["first_name"] == "test"
        assert response.data["last_name"] == "user"
    
    def test_update_profile(self):
        self.client.force_authenticate(user=self.test_user)

        update_data = {
            "first_name": "updated-first",
            "last_name": "updated-last",
        }

        url = reverse("profile")
        response = self.client.put(url, data=update_data, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["first_name"] == "updated-first"
        assert response.data["last_name"] == "updated-last"

    def test_update_password_success(self):
        self.client.force_authenticate(user=self.test_user)

        update_data = {
            "current_password": "securepassword123",
            "new_password": "newpassword123",
            "confirm_password": "newpassword123",
        }

        url = reverse("update-password")
        response = self.client.put(url, data=update_data, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert "current_password" not in response.data 
        assert "new_password" not in response.data 
        assert "confirm_password" not in response.data 

    def test_update_password_invalid_current_password(self):
        self.client.force_authenticate(user=self.test_user)

        update_data = {
            "current_password": "wrongpassword",
            "new_password": "newpassword123",
            "confirm_new_password": "newpassword123",
        }

        url = reverse("update-password")
        response = self.client.put(url, data=update_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        
    def test_update_password_mismatched_new_passwords(self):
        self.client.force_authenticate(user=self.test_user)

        update_data = {
            "current_password": "securepassword123",
            "new_password": "newpassword123",
            "confirm_new_password": "differentpassword123",
        }

        url = reverse("update-password")
        response = self.client.put(url, data=update_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST