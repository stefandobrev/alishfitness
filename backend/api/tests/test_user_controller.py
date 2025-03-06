import pytest
from rest_framework.test import APIClient
from rest_framework import status
from api.models import User
from django.urls import reverse

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

