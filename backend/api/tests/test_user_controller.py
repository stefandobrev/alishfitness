import pytest
from rest_framework.test import APIRequestFactory
from rest_framework import status
from rest_framework.request import Request
from rest_framework.parsers import JSONParser  
from api.models import User
from api.controllers.user_controller import UserController
from django.urls import reverse

@pytest.mark.django_db
class TestUserController:
    def setup_method(self):
        self.controller = UserController()
        self.factory = APIRequestFactory()
        User.objects.all().delete()

    def test_create_user_success(self):
        user_data = {
            "username": "testuser",
            "email": "test@email.com",
            "password": "securepassword123",
            "confirm_password": "securepassword123",
            "first_name": "test",
            "last_name": "user",
        }

        url = reverse("create-user")
        
        django_request = self.factory.post(
            url,
            data=user_data, 
            format='json'
        )
        drf_request = Request(
            django_request, 
            parsers=[JSONParser()]  
        )
        
        response = self.controller.create(drf_request)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert "user" in response.data
        assert isinstance(response.data["user"], dict)
        assert response.data["user"]["username"] == "testuser"
        assert response.data["user"]["email"] == "test@email.com"
        assert User.objects.filter(username="testuser").exists()
        assert User.objects.count() == 1

    def test_create_user_validation_error(self):
        print(User.objects.count())
        invalid_data = {
            "username": "",
            "email": "invalid_email",
            "password": "securepassword123",
            "confirm_password": "securepassword123",
            "first_name": "test",
            "last_name": "user",
        }

        url = reverse("create-user")
        
        django_request = self.factory.post(
            url,
            data=invalid_data, 
            format='json'
        )
        drf_request = Request(
            django_request, 
            parsers=[JSONParser()]  
        )

        response = self.controller.create(drf_request)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert User.objects.count() == 0