import pytest
from rest_framework.exceptions import ValidationError

@pytest.mark.django_db(transaction=True)
class TestTrainingProgramSerializer:
    def test_valid_data(self, test_training_program):
        pass