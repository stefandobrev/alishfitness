import pytest
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.urls import reverse
from django.utils import timezone

from datetime import timedelta

from api.models import User

@pytest.mark.django_db(transaction=True)
class TestUserController:
    def test_create_user_success(self, api_client, test_user, test_admin):
        user_data = {
            "username": "newuser",
            "email": "newuser@email.com",
            "password": "securepassword123",
            "confirm_password": "securepassword123",
            "first_name": "new",
            "last_name": "user",
        }

        url = reverse("create-user")
        response = api_client.post(url, data=user_data, format="json")
        

        assert response.status_code == status.HTTP_201_CREATED
        assert "user" in response.data
        assert isinstance(response.data["user"], dict)
        assert response.data["user"]["username"] == "newuser"
        assert response.data["user"]["email"] == "newuser@email.com"
        assert User.objects.filter(username="newuser").exists()
        assert User.objects.count() == 3 ## andmin and user setup initially

    def test_create_user_validation_error(self, api_client, test_user, test_admin):
        invalid_data = {
            "username": "",
            "email": "invalid_email",
            "password": "securepassword123",
            "confirm_password": "securepassword123",
            "first_name": "test",
            "last_name": "user",
        }

        url = reverse("create-user")
        response = api_client.post(url, data=invalid_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert User.objects.count() == 2 ## admin and user setup initially

    def test_login_success(self, api_client, test_admin):
        login_data = {
            "login_username": "adminuser",
            "login_password": "adminpassword123"
        } 

        url = reverse("login-user")
        response = api_client.post(url, data=login_data, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert "message" in response.data
        assert response.data["message"] == "Login successful"
        assert "username" in response.data
        assert response.data["username"] == "adminuser"
        assert "is_admin" in response.data
        assert response.data["is_admin"] is True
        assert "access" in response.data
        assert "refresh" in response.data

    def test_login_admin_success(self, api_client, test_user):
        login_data = {
            "login_username": "testuser",
            "login_password": "securepassword123"
        } 

        url = reverse("login-user")
        response = api_client.post(url, data=login_data, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert "message" in response.data
        assert response.data["message"] == "Login successful"
        assert "username" in response.data
        assert response.data["username"] == "testuser"
        assert "is_admin" in response.data
        assert response.data["is_admin"] is False
        assert "access" in response.data
        assert "refresh" in response.data

    def test_login_invalid_credentials(self, api_client, test_user):
        login_data = {
            "login_username": "testuser",
            "login_password": "wrongpassword"
        } 

        url = reverse("login-user")
        response = api_client.post(url, data=login_data, format="json")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "login_username" in response.data

    def test_refresh_token_valid(self, api_client, test_user):
        login_data = {
            "login_username": "testuser",
            "login_password": "securepassword123"
        } 

        url = reverse("login-user")
        login_response = api_client.post(url, data=login_data, format="json")
        refresh_token = login_response.data["refresh"]

        refresh_data = {
            "refresh": refresh_token
        }
        refresh_url = reverse("refresh-token")

        refresh_response = api_client.post(refresh_url, data=refresh_data, format="json")

        assert refresh_response.status_code == status.HTTP_200_OK
        assert refresh_response.data["message"] == "Token refreshed successfully"
        assert "access" in refresh_response.data
        assert "refresh" in refresh_response.data

    def test_refresh_token_invalid(self, api_client):
        refresh_data = {
            "refresh": "invalid-refresh-token"
        }
        
        url = reverse("refresh-token")
        response =  api_client.post(url, data=refresh_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_blacklist_token_success(self, api_client, test_user):
        login_data = {
            "login_username": "testuser",
            "login_password": "securepassword123"
        }
         
        url = reverse("login-user")
        login_response = api_client.post(url, data=login_data, format="json")
        refresh_token = login_response.data["refresh"]

        blacklist_data = {
            "refresh": refresh_token
        }
        blacklist_url = reverse("blacklist-token")

        blacklist_response = api_client.post(blacklist_url, data=blacklist_data, format="json")

        assert blacklist_response.status_code == status.HTTP_200_OK
        assert blacklist_response.data["message"] == "Token blacklisted successfully"

    def test_blacklist_token_missing(self, api_client):
        blacklist_data = {}

        url = reverse("blacklist-token")
        response = api_client.post(url, data=blacklist_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data["refresh_token"] == "Refresh token is required"

    def test_blacklist_token_invalid(self, api_client):
        blacklist_data = {
            "refresh": "invalid-token"
        }

        url = reverse("blacklist-token")
        response = api_client.post(url, data=blacklist_data, format="json")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Invalid or expired refresh token" in response.data["refresh_token"]
    
    def test_refresh_token_blacklisted(self, api_client, test_user):
        login_data = {
            "login_username": "testuser",
            "login_password": "securepassword123",
        }

        login_url = reverse("login-user")
        login_response = api_client.post(login_url, data=login_data, format="json")
        refresh_token = login_response.data["refresh"]

        blacklist_url = reverse("blacklist-token")  
        blacklist_response = api_client.post(blacklist_url, data={"refresh": refresh_token}, format="json")

        refresh_url = reverse("refresh-token")
        refresh_response = api_client.post(refresh_url, data={"refresh": refresh_token}, format="json")

        assert refresh_response.status_code == status.HTTP_400_BAD_REQUEST

    def test_refresh_token_expired(self, api_client, test_user):
        refresh = RefreshToken.for_user(test_user)
        refresh.set_exp(from_time=timezone.now() - timedelta(days=1))

        refresh_data = {
            "refresh": str(refresh),
        }
        url = reverse("refresh-token")

        response = api_client.post(url, data=refresh_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_get_profile(self, api_client, test_user):
        api_client.force_authenticate(user=test_user)

        url = reverse("get-my-profile")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["first_name"] == "test"
        assert response.data["last_name"] == "user"

    def test_get_settings(self, api_client, test_user):
        api_client.force_authenticate(user=test_user)

        url = reverse("get-settings")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["username"] == "testuser"
        assert response.data["email"] == "test@email.com"

    def test_update_settings(self, api_client, test_user):
        api_client.force_authenticate(user=test_user)

        update_data = {
            "username": "updated_username",
        }

        url = reverse("update-settings")
        response = api_client.put(url, data=update_data, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["username"] == "updated_username"
    
    def test_update_profile(self, api_client, test_user):
        api_client.force_authenticate(user=test_user)

        update_data = {
            "first_name": "updated-first",
            "last_name": "updated-last",
        }

        url = reverse("update-my-profile")
        response = api_client.put(url, data=update_data, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["first_name"] == "updated-first"
        assert response.data["last_name"] == "updated-last"

    def test_update_password_success(self, api_client, test_user):
        api_client.force_authenticate(user=test_user)

        update_data = {
            "current_password": "securepassword123",
            "new_password": "newpassword123",
            "confirm_password": "newpassword123",
        }

        url = reverse("update-password")
        response = api_client.put(url, data=update_data, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert "current_password" not in response.data 
        assert "new_password" not in response.data 
        assert "confirm_password" not in response.data 

    def test_update_password_invalid_current_password(self, api_client, test_user):
        api_client.force_authenticate(user=test_user)

        update_data = {
            "current_password": "wrongpassword",
            "new_password": "newpassword123",
            "confirm_new_password": "newpassword123",
        }

        url = reverse("update-password")
        response = api_client.put(url, data=update_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        
    def test_update_password_mismatched_new_passwords(self, api_client, test_user):
        api_client.force_authenticate(user=test_user)

        update_data = {
            "current_password": "securepassword123",
            "new_password": "newpassword123",
            "confirm_new_password": "differentpassword123",
        }

        url = reverse("update-password")
        response = api_client.put(url, data=update_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST