import pytest
from rest_framework import status
from django.urls import reverse

from api.models import MuscleGroup, Exercise

@pytest.mark.django_db(transaction=True)
class TestTrainingProgramController:
    def test_get_training_setup_data(self, api_client, test_user, test_admin, test_muscle_group):
        api_client.force_authenticate(user=test_admin)
        url = reverse("training-setup-data")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK

        response_data = response.json()
        
        assert test_muscle_group.slug in response_data["muscle_groups"] 
        assert any(user["username"] == test_user.username for user in response_data["users"])

    def test_create_program(self, api_client, test_admin, test_muscle_group, test_exercise, test_user):
        api_client.force_authenticate(user=test_admin)
        url = reverse("create-program")
        response = api_client.post(url)