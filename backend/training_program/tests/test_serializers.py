import pytest
from rest_framework.exceptions import ValidationError
from copy import deepcopy

from training_program.serializers import (
    TrainingProgramSerializer,
    TrainingSessionSerializer,
    TrainingExerciseSerializer
)

@pytest.mark.django_db(transaction=True)
class TestTrainingProgramSerializer:
    @pytest.fixture
    def valid_training_program_data(self, test_user, test_exercise, test_muscle_group):
        return {
            "program_title": "Test Program",
            "mode": "assigned",
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
                }
            ]
        }

    def test_valid_data(self, valid_training_program_data):
        serializer = TrainingProgramSerializer(data=deepcopy(valid_training_program_data))
        assert serializer.is_valid()

    def test_valid_template_mode(self, valid_training_program_data):
        data = deepcopy(valid_training_program_data)
        data["mode"] = "template"
        data["activation_date"] = None
        serializer = TrainingProgramSerializer(data=data)
        assert serializer.is_valid()

    def test_invalid_short_title(self, valid_training_program_data):
        data = deepcopy(valid_training_program_data)
        data["program_title"] = "A"
        serializer = TrainingProgramSerializer(data=data)
        with pytest.raises(ValidationError) as exc:
            serializer.is_valid(raise_exception=True)
        assert "Title must be at least 3 characters long." in str(exc.value)

    def test_invalid_user_id_type(self, valid_training_program_data):
        data = deepcopy(valid_training_program_data)
        data["assigned_user"] = "invalid"
        serializer = TrainingProgramSerializer(data=data)
        with pytest.raises(ValidationError):
            serializer.is_valid(raise_exception=True)

    def test_template_with_activation_date(self, valid_training_program_data):
        data = deepcopy(valid_training_program_data)
        data["mode"] = "template"
        data["activation_date"] = "2025-11-11"
        serializer = TrainingProgramSerializer(data=data)
        with pytest.raises(ValidationError) as exc:
            serializer.is_valid(raise_exception=True)
        assert "Templates should not have activation date." in str(exc)

@pytest.mark.django_db
class TestTrainingSessionSerializer:
    def test_missing_temp_id_or_title(self, test_muscle_group, test_exercise):
        data = {
            "session_title": None,
            "temp_id": None,
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
        }
        serializer = TrainingSessionSerializer(data=data)
        with pytest.raises(ValidationError) as exc:
            serializer.is_valid(raise_exception=True)
        assert "session_title" in str(exc.value)
        assert "temp_id" in str(exc.value)

@pytest.mark.django_db
class TestTrainingExerciseSerializer:
    def test_missing_required_fields(self, test_exercise, test_muscle_group):
        data = {
            "muscle_group": test_muscle_group.id,
            "is_custom_muscle_group": False,
            "exercise": test_exercise.id,
            "custom_exercise_title": None,
            "sequence": None,
            "sets": 3,
            "reps": None,
        }
        serializer = TrainingExerciseSerializer(data=data)
        with pytest.raises(ValidationError) as exc:
            serializer.is_valid(raise_exception=True)
        assert "sequence" in str(exc.value)
        assert "reps" in str(exc.value)
