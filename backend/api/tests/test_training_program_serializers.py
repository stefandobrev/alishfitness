import pytest
from rest_framework.exceptions import ValidationError

from datetime import date

@pytest.fixture
def activation_date():
    return date.today()

@pytest.mark.django_db(transaction=True)
class TestTrainingProgramSerializer:
    def test_valid_data_new_program_with_sessions(self, activation_date, test_user, test_exercise):
        valid_data = {
            "program_title": "Test Program",
            "mode": "create",
            "assigned_user": test_user.id,
            "activation_date": activation_date.isoformat(),
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

        serializer = TrainingProgramSerializer(data=valid_data)
        assert serializer.is_valid()
    
    def test_valid_data_new_template(self, test_exercise):
        valid_data = {
            "program_title": "Test Program",
            "mode": "template",
            "assigned_user": None,
            "activation_date": None,
            "schedule_array": [],
            "sessions": [
                {
                    "session_title": "Day 1",
                    "order": 0,
                    "exercises": [
                        {
                            "exercise": test_exercise.id,
                            "sequence": "A",
                            "sets": "4",
                            "reps": "10-12",
                            "order": 0
                        }
                    ]
                }
            ]
        }

        serializer = TrainingProgramSerializer(data=valid_data)
        assert serializer.is_valid()

    def test_invalid_title_len(self, activation_date, test_user,test_exercise):
        valid_data = {
            "program_title": "",
            "mode": "create",
            "assigned_user": test_user,
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

        serializer = TrainingProgramSerializer(data=valid_data)
        assert not serializer.is_valid()
        with pytest.raises(ValidationError) as exc_info:
            serializer.is_valid(raise_exception=True)
        assert "Program title is missing." in str(exc_info)

    def test_nonexisting_user(self, activation_date ,test_exercise):
        valid_data = {
            "program_title": "Test Program",
            "mode": "create",
            "assigned_user": "invalid_username",
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

        serializer = TrainingProgramSerializer(data=valid_data)
        assert not serializer.is_valid()
        with pytest.raises(ValidationError) as exc_info:
            serializer.is_valid(raise_exception=True)
        assert "User doesn't exist." in str(exc_info)

    def test_create_without_assigned_user(self, activation_date, test_exercise):
        invalid_data = {
            "program_title": "Test Program",
            "mode": "create",
            "assigned_user": None,  
            "activation_date": activation_date,
            "schedule_array": [1],
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
        
        serializer = TrainingProgramSerializer(data=invalid_data)
        assert not serializer.is_valid()
        with pytest.raises(ValidationError) as exc_info:
            serializer.is_valid(raise_exception=True)
        assert "Active programs require an assigned user." in str(exc_info)


    def test_invalid_date_format(self, test_user, test_exercise):
        valid_data = {
            "program_title": "Test Program",
            "mode": "create",
            "assigned_user": test_user,
            "activation_date": "2025-31-02",
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

        serializer = TrainingProgramSerializer(data=valid_data)
        assert not serializer.is_valid()
        with pytest.raises(ValidationError) as exc_info:
            serializer.is_valid(raise_exception=True)
        assert "Activation date for create mode is missing." in str(exc_info)

    def test_empty_schedule_array(self, test_user, activation_date, test_exercise):
        valid_data = {
            "program_title": "Test Program",
            "mode": "create",
            "assigned_user": test_user,
            "activation_date": activation_date,
            "schedule_array": [],
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

        serializer = TrainingProgramSerializer(data=valid_data)
        assert not serializer.is_valid()
        with pytest.raises(ValidationError) as exc_info:
            serializer.is_valid(raise_exception=True)
        assert "Schedule order for create mode is missing." in str(exc_info)
    
    def test_sessions_duplicate_orders(self, activation_date, test_user, test_exercise):
        invalid_data = {
            "program_title": "Test Program",
            "mode": "create",
            "assigned_user": test_user.id,
            "activation_date": activation_date,
            "schedule_array": [1, 2],
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
                },
                {
                    "session_title": "Day 2",
                    "order": 0,  # Duplicate order
                    "exercises": [
                        {
                            "exercise": test_exercise.id,
                            "sequence": "B",
                            "sets": "4",
                            "reps": "8-10",
                            "order": 0
                        }
                    ]
                }
            ]
        }
        
        serializer = TrainingProgramSerializer(data=invalid_data)
        assert not serializer.is_valid()
        with pytest.raises(ValidationError) as exc_info:
            serializer.is_valid(raise_exception=True)
        assert "Session orders must be unique." in str(exc_info) or "duplicate" in str(exc_info).lower()
    
    def test_empty_sessions(self, activation_date, test_user):
        invalid_data = {
            "program_title": "Test Program",
            "mode": "create",
            "assigned_user": test_user.id,
            "activation_date": activation_date,
            "schedule_array": [1, 2],
            "sessions": []  
        }
        
        serializer = TrainingProgramSerializer(data=invalid_data)
        assert not serializer.is_valid()
        with pytest.raises(ValidationError) as exc_info:
            serializer.is_valid(raise_exception=True)
        assert "Schedile aray is empty for create mode." in str(exc_info)
    
    def test_session_without_exercises(self, activation_date, test_user):
        invalid_data = {
            "program_title": "Test Program",
            "mode": "create",
            "assigned_user": test_user.id,
            "activation_date": activation_date,
            "schedule_array": [1],
            "sessions": [
                {
                    "session_title": "Day 1",
                    "order": 0,
                    "exercises": []  
                }
            ]
        }
        
        serializer = TrainingProgramSerializer(data=invalid_data)
        assert not serializer.is_valid()
        with pytest.raises(ValidationError) as exc_info:
            serializer.is_valid(raise_exception=True)
        assert "At least one exercise is required." in str(exc_info)
    
    def test_invalid_sets_format(self, activation_date, test_user, test_exercise):
        invalid_data = {
            "program_title": "Test Program",
            "mode": "create",
            "assigned_user": test_user.id,
            "activation_date": activation_date,
            "schedule_array": [1],
            "sessions": [
                {
                    "session_title": "Day 1",
                    "order": 0,
                    "exercises": [
                        {
                            "exercise": test_exercise.id,
                            "sequence": "A",
                            "sets": "invalid",  
                            "reps": "10-12",
                            "order": 0
                        }
                    ]
                }
            ]
        }
        
        serializer = TrainingProgramSerializer(data=invalid_data)
        assert not serializer.is_valid()
        with pytest.raises(ValidationError) as exc_info:
            serializer.is_valid(raise_exception=True)
        assert "Sets must be a valid number." in str(exc_info)
    
    def test_nonexistent_exercise(self, activation_date, test_user):
        nonexistent_exercise_id = 9999999 
        
        invalid_data = {
            "program_title": "Test Program",
            "mode": "create",
            "assigned_user": test_user.id,
            "activation_date": activation_date,
            "schedule_array": [1],
            "sessions": [
                {
                    "session_title": "Day 1",
                    "order": 0,
                    "exercises": [
                        {
                            "exercise": nonexistent_exercise_id,
                            "sequence": "A",
                            "sets": "3",
                            "reps": "10-12",
                            "order": 0
                        }
                    ]
                }
            ]
        }
        
        serializer = TrainingProgramSerializer(data=invalid_data)
        assert not serializer.is_valid()
        with pytest.raises(ValidationError) as exc_info:
            serializer.is_valid(raise_exception=True)
        assert "Exercise doesn't exist." in str(exc_info)
     
    def test_template_with_activation_date(self, test_exercise):
        invalid_data = {
            "program_title": "Test Template",
            "mode": "template",
            "assigned_user": None,
            "activation_date": "2025-04-15",  # Should be None for templates
            "schedule_array": [],
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
        
        serializer = TrainingProgramSerializer(data=invalid_data)
        assert not serializer.is_valid()
        with pytest.raises(ValidationError) as exc_info:
            serializer.is_valid(raise_exception=True)
        assert "Template programs should not have an activation date." in str(exc_info)
    
    