import pytest
from rest_framework.exceptions import ValidationError

from datetime import date

@pytest.fixture
def activation_date():
    return date.today()

@pytest.mark.django_db(transaction=True)
class TestTrainingProgramSerializer:
    def test_valid_data_new_program(self,activation_date, test_user):
        valid_data = {
            "program_title": "Test Program",
            "mode": "create",
            "assigned_user": test_user,
            "activation_date": activation_date,
            "schedule_array": [1, 2, 1],
        }

        serializer = TrainingProgramSerializer(data=valid_data)
        assert serializer.is_valid()
    
    def test_valid_data_new_template(self):
        valid_data = {
            "program_title": "Test Program",
            "mode": "create",
            "assigned_user": None,
            "activation_date": None,
            "schedule_array": [],
        }

        serializer = TrainingProgramSerializer(data=valid_data)
        assert serializer.is_valid()

    def test_invalid_title_len(self, activation_date, test_user):
        valid_data = {
            "program_title": "",
            "mode": "create",
            "assigned_user": test_user,
            "activation_date": activation_date,
            "schedule_array": [1, 2, 1],
        }

        serializer = TrainingProgramSerializer(data=valid_data)
        assert not serializer.is_valid()
        with pytest.raises(ValidationError) as exc_info:
            serializer.is_valid(raise_exception=True)
        assert "Program title is required." in str(exc_info)

    def test_nonexisting_user(self, activation_date):
        valid_data = {
            "program_title": "Test Program",
            "mode": "create",
            "assigned_user": "invalid_username",
            "activation_date": activation_date,
            "schedule_array": [1, 2, 1],
        }

        serializer = TrainingProgramSerializer(data=valid_data)
        assert not serializer.is_valid()
        with pytest.raises(ValidationError) as exc_info:
            serializer.is_valid(raise_exception=True)
        assert "User doesn't exist." in str(exc_info)


    def test_invalid_date_format(self, test_user):
        valid_data = {
            "program_title": "Test Program",
            "mode": "create",
            "assigned_user": test_user,
            "activation_date": "2025-31-02",
            "schedule_array": [1, 2, 1],
        }

        serializer = TrainingProgramSerializer(data=valid_data)
        assert not serializer.is_valid()
        with pytest.raises(ValidationError) as exc_info:
            serializer.is_valid(raise_exception=True)
        assert "Activation date required." in str(exc_info)

    def test_empty_array(self, test_user, activation_date):
        valid_data = {
            "program_title": "Test Program",
            "mode": "create",
            "assigned_user": test_user,
            "activation_date": activation_date,
            "schedule_array": [],
        }

        serializer = TrainingProgramSerializer(data=valid_data)
        assert not serializer.is_valid()
        with pytest.raises(ValidationError) as exc_info:
            serializer.is_valid(raise_exception=True)
        assert "Schedule order required." in str(exc_info)