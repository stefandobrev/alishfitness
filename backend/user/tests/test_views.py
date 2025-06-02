import pytest
from rest_framework import status
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from datetime import timedelta
from user.models import User

@pytest.mark.django_db(transaction=True)
class TestCreateUserView:
    def test_create_user_success(self, api_client, test_user, test_admin):
        data = {
            "username": "newuser",
            "email": "newuser@email.com",
            "password": "securepassword123",
            "confirm_password": "securepassword123",
            "first_name": "new",
            "last_name": "user",
        }
        url = reverse("create-user")
        response = api_client.post(url, data=data, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert "user" in response.data
        assert response.data["user"]["username"] == "newuser"
        assert User.objects.filter(username="newuser").exists()

    def test_create_user_validation_error(self, api_client, test_user, test_admin):
        data = {
            "username": "",
            "email": "invalid_email",
            "password": "securepassword123",
            "confirm_password": "securepassword123",
            "first_name": "test",
            "last_name": "user",
        }
        url = reverse("create-user")
        response = api_client.post(url, data=data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db(transaction=True)
class TestLoginView:
    def test_login_success(self, api_client, test_admin):
        data = {"login_username": "adminuser", "login_password": "adminpassword123"}
        url = reverse("login-user")
        response = api_client.post(url, data=data, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["message"] == "Login successful"
        assert response.data["username"] == "adminuser"
        assert response.data["is_admin"] is True
        assert "access" in response.data
        assert "refresh" in response.data

    def test_login_user_success(self, api_client, test_user):
        data = {"login_username": "testuser", "login_password": "securepassword123"}
        url = reverse("login-user")
        response = api_client.post(url, data=data, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["username"] == "testuser"
        assert response.data["is_admin"] is False

    def test_login_invalid_credentials(self, api_client, test_user):
        data = {"login_username": "testuser", "login_password": "wrongpassword"}
        url = reverse("login-user")
        response = api_client.post(url, data=data, format="json")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "login_username" in response.data


@pytest.mark.django_db(transaction=True)
class TestTokenView:
    def test_refresh_token_valid(self, api_client, test_user):
        login_data = {"login_username": "testuser", "login_password": "securepassword123"}
        login_url = reverse("login-user")
        login_resp = api_client.post(login_url, data=login_data, format="json")
        refresh_token = login_resp.data["refresh"]

        url = reverse("refresh-token")
        response = api_client.post(url, data={"refresh": refresh_token}, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["message"] == "Token refreshed successfully"
        assert "access" in response.data
        assert "refresh" in response.data

    def test_refresh_token_invalid(self, api_client):
        url = reverse("refresh-token")
        response = api_client.post(url, data={"refresh": "invalid-refresh-token"}, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_refresh_token_blacklisted(self, api_client, test_user):
        login_data = {"login_username": "testuser", "login_password": "securepassword123"}
        login_url = reverse("login-user")
        login_resp = api_client.post(login_url, data=login_data, format="json")
        refresh_token = login_resp.data["refresh"]

        blacklist_url = reverse("blacklist-token")
        api_client.post(blacklist_url, data={"refresh": refresh_token}, format="json")

        refresh_url = reverse("refresh-token")
        response = api_client.post(refresh_url, data={"refresh": refresh_token}, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_refresh_token_expired(self, api_client, test_user):
        refresh = RefreshToken.for_user(test_user)
        refresh.set_exp(from_time=timezone.now() - timedelta(days=1))
        url = reverse("refresh-token")

        response = api_client.post(url, data={"refresh": str(refresh)}, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db(transaction=True)
class TestTokenBlacklistView:
    def test_blacklist_token_success(self, api_client, test_user):
        login_data = {"login_username": "testuser", "login_password": "securepassword123"}
        login_url = reverse("login-user")
        login_resp = api_client.post(login_url, data=login_data, format="json")
        refresh_token = login_resp.data["refresh"]

        url = reverse("blacklist-token")
        response = api_client.post(url, data={"refresh": refresh_token}, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["message"] == "Token blacklisted successfully"

    def test_blacklist_token_missing(self, api_client):
        url = reverse("blacklist-token")
        response = api_client.post(url, data={}, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data["refresh_token"] == "Refresh token is required"

    def test_blacklist_token_invalid(self, api_client):
        url = reverse("blacklist-token")
        response = api_client.post(url, data={"refresh": "invalid-token"}, format="json")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Invalid or expired refresh token" in response.data["refresh_token"]


@pytest.mark.django_db(transaction=True)
class TestProfileView:
    def test_get_profile(self, api_client, test_user):
        api_client.force_authenticate(user=test_user)
        url = reverse("get-my-profile")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["first_name"] == "test"
        assert response.data["last_name"] == "user"

    def test_update_profile(self, api_client, test_user):
        api_client.force_authenticate(user=test_user)
        url = reverse("update-my-profile")
        data = {"first_name": "updated-first", "last_name": "updated-last"}
        response = api_client.put(url, data=data, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["first_name"] == "updated-first"
        assert response.data["last_name"] == "updated-last"


@pytest.mark.django_db(transaction=True)
class TestSettingsView:
    def test_get_settings(self, api_client, test_user):
        api_client.force_authenticate(user=test_user)
        url = reverse("get-settings")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["username"] == "testuser"
        assert response.data["email"] == "test@email.com"

    def test_update_settings(self, api_client, test_user):
        api_client.force_authenticate(user=test_user)
        url = reverse("update-settings")
        data = {"username": "updated_username"}
        response = api_client.put(url, data=data, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["username"] == "updated_username"


@pytest.mark.django_db(transaction=True)
class TestPasswordUpdateView:
    def test_update_password_success(self, api_client, test_user):
        api_client.force_authenticate(user=test_user)
        url = reverse("update-password")
        data = {
            "current_password": "securepassword123",
            "new_password": "newpassword123",
            "confirm_password": "newpassword123",
        }
        response = api_client.put(url, data=data, format="json")

        assert response.status_code == status.HTTP_200_OK

    def test_update_password_invalid_current_password(self, api_client, test_user):
        api_client.force_authenticate(user=test_user)
        url = reverse("update-password")
        data = {
            "current_password": "wrongpassword",
            "new_password": "newpassword123",
            "confirm_new_password": "newpassword123",
        }
        response = api_client.put(url, data=data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_update_password_mismatched_new_passwords(self, api_client, test_user):
        api_client.force_authenticate(user=test_user)
        url = reverse("update-password")
        data = {
            "current_password": "securepassword123",
            "new_password": "newpassword123",
            "confirm_new_password": "differentpassword123",
        }
        response = api_client.put(url, data=data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
