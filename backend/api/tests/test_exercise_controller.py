import pytest
from rest_framework import status
from rest_framework.test import APIClient
from django.urls import reverse

from api.models import User, MuscleGroup, Exercise, Step, Mistake

@pytest.mark.django_db(transaction=True)
class TestExerciseController:
    def setup_method(self):
        self.client = APIClient()

        self.test_muscle_group = MuscleGroup.objects.create(
            name="Test Muscle Group",
            slug="test-muscle-group"
        )

        self.test_secondary_muscle_group = MuscleGroup.objects.create(
            name="Test Secondary Muscle Group",
            slug="test-secondary-muscle-group"
        )

        self.test_exercise = Exercise.objects.create(
            title="Test Exercise",
            slug="test-exercise",
            primary_group=self.test_muscle_group,
            gif_link_front = "https://example.com/gifs/front_view.gif",
            gif_link_side = "https://example.com/gifs/side_view.gif",
            video_link = "https://example.com/videos/exercise.mp4"
        )

        self.test_exercise.secondary_groups.set([self.test_secondary_muscle_group])

        self.test_user = User.objects.create_user(
            username="testuser",
            password="testpassword"
        )

        self.test_admin = User.objects.create_user(
            username="testadmin",
            password="testadminpassword",
            is_staff=True
        )

    def test_get_muscle_groups(self):
        self.client.force_authenticate(user=self.test_user)

        url = reverse("muscle-groups")
        response = self.client.get(url)

        assert response.status_code == status.HTTP_200_OK

        expected_data = [
            {
                "name": "Test Muscle Group",
                "slug": "test-muscle-group"
            },
            {
                "name": "Test Secondary Muscle Group",
                "slug": "test-secondary-muscle-group"
            }
        ]

        assert response.data == expected_data
