import pytest
from rest_framework import status
from django.urls import reverse

from api.models import MuscleGroup, Exercise

@pytest.mark.django_db(transaction=True)
class TestTrainingProgramController:
    def test_get_muscle_groups_and_exercises(self, api_client, test_muscle_group, test_secondary_muscle_group, test_exercise):
        pass