import pytest
from rest_framework.exceptions import ValidationError
from copy import deepcopy

from api.serializers.training_program_serializers import TrainingProgramSerializer

@pytest.mark.django_db(transaction=True)
class TestTrainingProgramSerializer:
    @pytest.fixture
    def valid_training_program_data(self, test_user, test_exercise, test_muscle_group):
        return {
            "program_title": "Test Program",
            "mode": "create",
            "assigned_user": test_user.id,
            "activation_date": "2025-11-11",
            "sessions": [
                {
                    "session_title": "Day 1",
                    "temp_id": "1",
                    "exercises": [
                        {   
                            "muscle_group": test_muscle_group.id,
                            "is_custom_muscle_group": False,
                            "exercise": test_exercise.id,
                            "custom_exercise_title": None,
                            "sequence": "A",
                            "sets": 3,
                            "reps": "10-12",
                        }
                    ]
                },
                {
                    "session_title": "Day 2",
                    "temp_id": "2",
                    "exercises": [
                        {
                            "muscle_group": None,
                            "is_custom_muscle_group": True,
                            "exercise": None,
                            "custom_exercise_title": "Custom Exercise Title",
                            "sequence": "A",
                            "sets": 3,
                            "reps": "10-12",
                        }
                    ]
                }
            ]
        }
    
    def test_valid_data(self, valid_training_program_data):
        valid_data = deepcopy(valid_training_program_data)

        serializer = TrainingProgramSerializer(data=valid_data)
        assert serializer.is_valid()

    def test_valid_data_template(self, valid_training_program_data):
        valid_data = deepcopy(valid_training_program_data)
        valid_data_template = valid_data
        valid_data_template.pop("assigned_user")
        valid_data_template["mode"] = "template"
        valid_data_template["activation_date"] = None

        serializer = TrainingProgramSerializer(data=valid_data_template)
        assert serializer.is_valid()

    def test_invalid_title_len(self, valid_training_program_data):
        valid_data = deepcopy(valid_training_program_data)
        invalid_title_len_data = valid_data
        invalid_title_len_data["program_title"] = "A"

        serializer = TrainingProgramSerializer(data=valid_data)
        assert not serializer.is_valid()
        with pytest.raises(ValidationError) as exc_info:
            serializer.is_valid(raise_exception=True)
        assert "Title must be at least 3 characters long." in str(exc_info)

    def test_invalid_user(self, valid_training_program_data):
        valid_data = deepcopy(valid_training_program_data)
        invalid_user_data = valid_data
        invalid_user_data["assigned_user"] = "invalid"

        serializer = TrainingProgramSerializer(data=invalid_user_data)
        assert not serializer.is_valid()
        with pytest.raises(ValidationError) as exc_info:
            serializer.is_valid(raise_exception=True)
        assert "Incorrect type" in str(exc_info.value)

    def test_missing_user_create(self, valid_training_program_data):
        valid_data = deepcopy(valid_training_program_data)
        missing_user_data = valid_data
        missing_user_data.pop("assigned_user")

        serializer = TrainingProgramSerializer(data=missing_user_data)
        assert not serializer.is_valid()
        with pytest.raises(ValidationError) as exc_info:
            serializer.is_valid(raise_exception=True)
        assert "Assigned user is missing." in str(exc_info)

    def test_missing_date(self, valid_training_program_data):
        valid_data = deepcopy(valid_training_program_data)
        missing_date_data = valid_data
        missing_date_data.pop("activation_date")

        serializer = TrainingProgramSerializer(data=missing_date_data)
        assert not serializer.is_valid()
        with pytest.raises(ValidationError) as exc_info:
            serializer.is_valid(raise_exception=True)
        assert "Activation date is missing." in str(exc_info)
     
    def test_template_with_activation_date(self, valid_training_program_data):
        valid_data = deepcopy(valid_training_program_data)
        template_with_date_data = valid_data
        template_with_date_data.pop("assigned_user")
        template_with_date_data["mode"] = "template"
        template_with_date_data["activation_date"] = "2025-11-11"

        serializer = TrainingProgramSerializer(data=template_with_date_data)
        assert not serializer.is_valid()
        with pytest.raises(ValidationError) as exc_info:
            serializer.is_valid(raise_exception=True)
        assert "Templates should not have activation date." in str(exc_info)
    