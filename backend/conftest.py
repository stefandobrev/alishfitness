import pytest
from django.conf import settings
from rest_framework.test import APIClient

from datetime import date

from user.models import User
from exercise.models import Exercise, MuscleGroup
from training_program.models import TrainingProgram

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
def test_training_program(test_user):
    activation_date = date.today()

    training_program = TrainingProgram.objects.create(
        program_title="Test Program",
        mode="assigned",
        status="current",
        assigned_user=test_user,
        activation_date=activation_date,
        schedule_data=[1, 2, 1],
    )
    return training_program

@pytest.fixture
def test_training_template():
    training_program = TrainingProgram.objects.create(
        program_title="Test Template",
        mode="template",
        assigned_user=None,
        activation_date=None,
        schedule_data=[1, 2, 1],
    )
    return training_program