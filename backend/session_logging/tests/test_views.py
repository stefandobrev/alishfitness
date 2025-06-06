import pytest
from rest_framework import status
from django.urls import reverse
from copy import deepcopy

from datetime import date, timedelta


@pytest.mark.django_db(transaction=True)
class TestActiveProgramView():
    @pytest.fixture
    def get_current_program(self, api_client, test_user, test_training_program):
        api_client.force_authenticate(test_user)

        url = reverse("active-training-program")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["program_title"] == test_training_program.program_title

@pytest.mark.django_db(transaction=True)
class TestSessionLogDataViewSet:
    @pytest.fixture
    def valid_session_log_data(self, test_user, test_exercise):
        pass