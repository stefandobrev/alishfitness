import pytest
from rest_framework import status
from django.urls import reverse
from copy import deepcopy

from datetime import date

from api.models import TrainingProgram, ProgramExercise

@pytest.mark.django_db(transaction=True)
class TestTrainingProgramController:
    @pytest.fixture
    def valid_training_program_data(self, test_user, test_exercise, test_muscle_group):
        activation_date = date.today()

        return {
            "program_title": "Test Program",
            "mode": "create",
            "assigned_user_username": test_user.username,
            "activation_date": activation_date,
            "schedule_array": ["1", "2", "1"],
            "sessions": [
                {
                    "session_title": "Day 1",
                    "temp_id": "1",
                    "exercises": [
                        {   
                            "muscle_group_input": test_muscle_group.slug,
                            "exercise_input": test_exercise.slug,
                            "sequence": "A",
                            "sets": "3",
                            "reps": "10-12",
                        },
                    ]
                },
                {
                    "session_title": "Day 2",
                    "temp_id": "2",
                    "exercises": [
                        {
                            "muscle_group_input": "custom",
                            "exercise_input": "Custom Exercise",
                            "sequence": "A",
                            "sets": "2",
                            "reps": "10",
                        },
                    ]
                }
            ]
        }
    
    def test_get_training_setup_data(self, api_client, test_user, test_admin, test_muscle_group):
        api_client.force_authenticate(user=test_admin)
        url = reverse("training-setup-data")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        
        assert len(response.data) >= 1
        assert test_muscle_group.slug in response.data["muscle_groups"] 
        assert any(user["username"] == test_user.username for user in response.data["users"])

    def test_create_program(self, valid_training_program_data, api_client, test_admin):
        valid_data = deepcopy(valid_training_program_data)

        api_client.force_authenticate(user=test_admin)
        url = reverse("create-program")
        response = api_client.post(url, valid_data, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data.get("message") == "Program created successfully!"
        
        program = TrainingProgram.objects.get(program_title="Test Program")
    
        assert program is not None
        
        day_1_session = program.sessions.filter(session_title="Day 1").first()
        day_2_session = program.sessions.filter(session_title="Day 2").first()

        assert program.schedule_array == [day_1_session.id, day_2_session.id, day_1_session.id]
        
        assert day_1_session is not None
        assert day_2_session is not None
        
        assert ProgramExercise.objects.filter(session=day_2_session, sequence="A").exists()

        assert ProgramExercise.objects.filter(session=day_1_session, sequence="A").exists()

    def test_invalid_schedule(self, valid_training_program_data, api_client, test_admin):
        valid_data = deepcopy(valid_training_program_data)
        invalid_schedule_data=valid_data
        invalid_schedule_data["schedule_array"] = []

        api_client.force_authenticate(user=test_admin)
        url = reverse("create-program")
        response = api_client.post(url, invalid_schedule_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data.get("schedule_array") == "Schedule cannot be empty."

        invalid_schedule_data.pop("schedule_array", None)

        api_client.force_authenticate(user=test_admin)
        url = reverse("create-program")
        response = api_client.post(url, invalid_schedule_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data.get("schedule_array") == "Schedule is missing!"

    def test_invalid_assigned_user(self, valid_training_program_data, api_client, test_admin):
        valid_data = deepcopy(valid_training_program_data)
        invalid_user_data = valid_data
        invalid_user_data["assigned_user_username"] = "invalid_user"

        api_client.force_authenticate(user=test_admin)
        url = reverse("create-program")
        response = api_client.post(url, invalid_user_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "doesn't exist." in response.data.get("assigned_user")

    def test_invalid_sets(self, valid_training_program_data, api_client, test_admin):
        valid_data = deepcopy(valid_training_program_data)
        invalid_sets_data=valid_data
        invalid_sets_data["sessions"][0]["exercises"][0]["sets"] = "-1"

        api_client.force_authenticate(user=test_admin)
        url = reverse("create-program")
        response = api_client.post(url, invalid_sets_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data.get("sets") == "Sets must be a positive number."

        invalid_sets_data["sessions"][0]["exercises"][0]["sets"] = "k"
        api_client.force_authenticate(user=test_admin)
        url = reverse("create-program")
        response = api_client.post(url, invalid_sets_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data.get("sets") == "Sets must be a valid number."

    def test_invalid_muscle_group(self, valid_training_program_data, api_client, test_admin):
        valid_data = deepcopy(valid_training_program_data)
        invalid_muscle_group_data=valid_data
        invalid_muscle_group_data["sessions"][0]["exercises"][0]["muscle_group_input"] = "invalid"

        api_client.force_authenticate(user=test_admin)
        url = reverse("create-program")
        response = api_client.post(url, invalid_muscle_group_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "not found." in response.data.get("muscle_group_input")

    def test_invalid_exercise(self, valid_training_program_data, api_client, test_admin):
        valid_data = deepcopy(valid_training_program_data)
        invalid_exercise_data=valid_data
        invalid_exercise_data["sessions"][0]["exercises"][0]["is_custom_muscle_group"] = False
        invalid_exercise_data["sessions"][0]["exercises"][0]["exercise_input"] = "invalid"

        api_client.force_authenticate(user=test_admin)
        url = reverse("create-program")
        response = api_client.post(url, invalid_exercise_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "not found." in response.data.get("exercise_input")

    def test_invalid_schedule_id(self, valid_training_program_data, api_client, test_admin):
        valid_data = deepcopy(valid_training_program_data)
        invalid_schedule_id_data = valid_data
        invalid_schedule_id_data["schedule_array"] = ["3"]

        api_client.force_authenticate(user=test_admin)
        url = reverse("create-program")
        response = api_client.post(url, invalid_schedule_id_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "invalid session." in response.data.get("temp_id")