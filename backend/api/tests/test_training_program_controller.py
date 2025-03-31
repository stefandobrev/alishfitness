import pytest
from rest_framework import status
from django.urls import reverse

from api.models import MuscleGroup, Exercise

@pytest.mark.django_db(transaction=True)
class TestTrainingProgramController:
    def test_get_muscle_groups_and_exercises(self, api_client, test_admin, test_muscle_group):
        api_client.force_authenticate(user=test_admin)
        url = reverse("muscle-groups-with-exercises")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK

        response_data = response.json()
        
        assert test_muscle_group.slug in response_data