import pytest
from django.conf import settings
from rest_framework.test import APIClient

from datetime import date

from api.models import User, MuscleGroup, Exercise, TrainingProgram, TrainingSession, ProgramExercise

@pytest.fixture(scope="session", autouse=True)
def set_test_db():
    # Override the default database with a test database
    settings.DATABASES["default"] = {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",  
        "ATOMIC_REQUESTS": True,
    }

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def test_user():
    return User.objects.create_user(
        username="testuser",
        email="test@email.com",
        password="securepassword123",
        first_name="test",
        last_name="user"
        )

@pytest.fixture
def test_admin(): 
    return User.objects.create_user(
        username="adminuser",
            email="admin@email.com",
            password="adminpassword123",
            first_name="admin",
            last_name="user",
            is_staff=True
        )

@pytest.fixture
def test_muscle_group():
    return MuscleGroup.objects.create(
        name="Test Muscle Group",
        slug="test-muscle-group"
    )

@pytest.fixture
def test_secondary_muscle_group():
    return MuscleGroup.objects.create(
        name="Test Secondary Muscle Group",
        slug="test-secondary-muscle-group"
    )

@pytest.fixture
def test_exercise(test_muscle_group, test_secondary_muscle_group):
    exercise = Exercise.objects.create(
        title="Test Exercise",
        slug="test-exercise",
        primary_group=test_muscle_group,
        gif_link_front="https://example.com/gifs/front_view.gif",
        gif_link_side="https://example.com/gifs/side_view.gif",
        video_link="https://example.com/videos/exercise.mp4"
    )
    exercise.secondary_groups.set([test_secondary_muscle_group])
    return exercise

@pytest.fixture
def test_training_program(test_user, test_program_session, test_second_program_session):
    activation_date = date.today()

    training_program = TrainingProgram.objects.create(
        program_title="Test Program",
        mode="create",
        assigned_user=test_user,
        activation_date=activation_date,
        schedule_array=[1, 2, 1],
        sessions=[test_program_session, test_second_program_session]
    )
    return training_program

@pytest.fixture
def test_template(test_program_session, test_second_program_session):
    training_program = TrainingProgram.objects.create(
        program_title="Test Template",
        mode="template",
        assigned_user=None,
        activation_date=None,
        schedule_array=[1, 2, 1],
        sessions=[test_program_session, test_second_program_session]
    )
    return training_program

@pytest.fixture
def test_program_session(test_training_program):
    session = TrainingSession.objects.create(
        session_title="Test Session",
        program=test_training_program,
    )
    return session

@pytest.fixture
def test_second_program_session(test_training_program):
    session = TrainingSession.objects.create(
        session_title="Second Test Session",
        program=test_training_program,
    )
    return session

@pytest.fixture
def test_program_exercise(test_muscle_group, test_program_session, test_exercise):
    program_exercise = ProgramExercise.objects.create(
        session=test_program_session,
        muscle_group=test_muscle_group,
        exercise=test_exercise,
        is_custom_muscle_group=False,
        custom_exercise_title=None,
        sequence="A",
        sets=3,
        reps="10-12",
    )
    return program_exercise

@pytest.fixture
def test_program_exercise_custom(test_second_program_session):
    program_exercise = ProgramExercise.objects.create(
        session=test_second_program_session,
        muscle_group=None,
        exercise=None,
        is_custom_muscle_group=True,
        custom_exercise_title="Custom Test Exercise Title",
        sequence="A",
        sets=5,
        reps="12",
    )
    return program_exercise