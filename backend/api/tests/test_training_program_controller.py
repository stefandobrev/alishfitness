import pytest
from rest_framework import status
from rest_framework.test import APIClient
from django.urls import reverse

from api.models import MuscleGroup, Exercise

@pytest.mark.django_db(transaction=True)
class TestTrainingProgramController:
    def setup_method(self):
        self.client = APIClient()