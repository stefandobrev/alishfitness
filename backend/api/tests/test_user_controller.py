import pytest
from rest_framework.test import APIRequestFactory
from rest_framework import status
from rest_framework.request import Request
from rest_framework.parsers import JSONParser  
from api.models import User
from api.controllers.user_controller import UserController

@pytest.mark.django_db
class TestUserController:
    def setup_method(self):
        self.controller = UserController()
        self.factory = APIRequestFactory()

    def test_create_user_success(self):
        user_data = {
            "username": "testuser",
            "email": "test@email.com",
            "password": "securepassword123",
            "confirm_password": "securepassword123",
            "first_name": "test",
            "last_name": "user",
        }
        
        django_request = self.factory.post(
            "/user/create-user/", 
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