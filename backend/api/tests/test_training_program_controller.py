import pytest
from rest_framework import status
from django.urls import reverse

from datetime import date

from api.models import MuscleGroup, Exercise

@pytest.mark.django_db(transaction=True)
class TestTrainingProgramController:
    def test_get_training_setup_data(self, api_client, test_user, test_admin, test_muscle_group):
        api_client.force_authenticate(user=test_admin)
        url = reverse("training-setup-data")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        
        assert len(response.data) >= 1
        assert test_muscle_group.slug in response.data["muscle_groups"] 
        assert any(user["username"] == test_user.username for user in response.data["users"])

    def test_create_program(self, api_client, test_admin, test_user, test_exercise):
        activation_date = date.today()
        
        valid_data = {
            "program_title": "Test Program",
            "mode": "create",
            "assigned_user": test_user.id,
            "activation_date": activation_date,
            "schedule_array": [1, 2, 1],
            "sessions": [
                {
                    "session_title": "Day 1",
                    "order": 0,
                    "exercises": [
                        {
                            "exercise": test_exercise.id,
                            "sequence": "A",
                            "sets": "3",
                            "reps": "10-12",
                            "order": 0
                        }
                    ]
                }
            ]
        }
        api_client.force_authenticate(user=test_admin)
        url = reverse("create-program")
        response = api_client.post(url, valid_data, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert response.data.get("message") == "Program created successfully."

        