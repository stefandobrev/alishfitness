import pytest
from rest_framework import status
from django.urls import reverse

from api.models import MuscleGroup, Exercise

@pytest.mark.django_db(transaction=True)
class TestTrainingProgramController:
    def test_get_muscle_groups_and_exercises(self, api_client, test_admin, test_muscle_group, test_secondary_muscle_group, test_exercise):
        api_client.force_authenticate(user=test_admin)
        url = reverse("muscle-groups-with-exercises")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK

        response_data = response.json()
        
        assert test_muscle_group.slug in response_data

        muscle_group_data = response_data[test_muscle_group.slug]
        assert muscle_group_data["name"] == test_muscle_group.name
        assert muscle_group_data["slug"] == test_muscle_group.slug

        exercises = muscle_group_data["exercises"]
        assert len(exercises) == 1
        assert exercises[0]["title"] == test_exercise.title

