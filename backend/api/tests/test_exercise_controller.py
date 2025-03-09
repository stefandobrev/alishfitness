import pytest
from rest_framework import status
from rest_framework.test import APIClient
from django.urls import reverse
from django.utils.dateparse import parse_datetime

from api.models import User, MuscleGroup, Exercise, Step

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

    def test_get_exercise_titles(self):
        self.client.force_authenticate(user=self.test_user)

        url = reverse("exercise-titles")

        test_exercise = Exercise.objects.first()
        response = self.client.post(url, {"search_query": test_exercise.title}, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 1
       
        if test_exercise.primary_group:
            response = self.client.post(url, {"muscle_groups": [test_exercise.primary_group.slug]}, format="json")
            assert response.status_code == status.HTTP_200_OK
            exercise_ids = [exercise["id"] for exercise in response.data]
            filtered_exercises = Exercise.objects.filter(primary_group__slug=test_exercise.primary_group.slug)[:10]
            for exercise in filtered_exercises:
                assert exercise.id in exercise_ids

        response = self.client.post(url, {"sort": "created_at"}, format="json")
        if len(response.data) >= 2:
            assert parse_datetime(response.data[0]["created_at"]) >= parse_datetime(response.data[1]["created_at"])

        response = self.client.post(url, {"sort": "updated_at"}, format="json")
        if len(response.data) >= 2:
            assert parse_datetime(response.data[0]["updated_at"]) >= parse_datetime(response.data[1]["updated_at"])

        response = self.client.post(url, {}, format="json")
        assert response.status_code == status.HTTP_200_OK
        if len(response.data) >= 2:
            sorted_titles = sorted([exercise["title"] for exercise in response.data])
            assert [exercise["title"] for exercise in response.data] == sorted_titles

        for i in range(15):
            Exercise.objects.create(
                title=f"Test Exercise {i}",
                slug=f"test-exercise-{i}",
                primary_group=self.test_muscle_group,
                gif_link_front = "https://example.com/gifs/front_view.gif",
                gif_link_side = "https://example.com/gifs/side_view.gif",
            )
    
        response = self.client.post(url, {}, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 10  
        
        response = self.client.post(url, {"offset": 10}, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) > 0  

        if test_exercise.primary_group:
            filtered_titles = {
                    "search_query": test_exercise.title[:4],  
                    "muscle_groups": [test_exercise.primary_group.slug],
                    "sort": "created_at"
                }
            response = self.client.post(url, filtered_titles, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert any(ex["title"].startswith(self.test_exercise.title[:4]) for ex in response.data)

    def test_get_exercise(self):
        self.client.force_authenticate(user=self.test_user)

        url = reverse("exercise-detail", args=[self.test_exercise.id])
        response = self.client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["id"] == self.test_exercise.id
        assert response.data["title"] == self.test_exercise.title
        assert len(response.data["secondary_groups"]) == 1

    def test_get_exercise_invalid(self):
        self.client.force_authenticate(user=self.test_user)

        invalid_id = 999999999
        url = reverse("exercise-detail", args=[invalid_id])
        response = self.client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "error" in response.data
        assert response.data["error"] == "Exercise not found."

    def test_create(self):
        self.client.force_authenticate(user=self.test_admin)

        url = reverse("create-exercise")
        new_exercise = {
            "title": "Test New Exercise",
            "primary_group": self.test_muscle_group.slug,
            "gif_link_front":  "https://example.com/gifs/front_view.gif",
            "gif_link_side":  "https://example.com/gifs/side_view.gif",
            "steps": ["Step1", "Step2"],
            "mistakes": ["mistake1"]
        }
        response = self.client.post(url, new_exercise, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["message"] == "Exercise created successfully!"
        assert Exercise.objects.filter(title="Test New Exercise").exists()
        
        steps = Step.objects.filter(exercise__title="Test New Exercise").order_by("order")
        assert steps[0].description == "Step1"
        assert steps[0].order == 1
        assert steps[1].description == "Step2"
        assert steps[1].order == 2

    def test_create_invalid_primary_group(self):
        self.client.force_authenticate(user=self.test_admin)

        url = reverse("create-exercise")

        invalid_exercise = {
            "title": "Test New Exercise",
            "primary_group": "invalidgroup",
            "gif_link_front":  "https://example.com/gifs/front_view.gif",
            "gif_link_side":  "https://example.com/gifs/side_view.gif",
            "steps": ["Step1", "Step2"],
            "mistakes": ["mistake1"]
        }
        response = self.client.post(url, invalid_exercise, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data["primary_group"] == "Primary group not found."

        invalid_exercise = {
            "title": "Test New Exercise",
            "primary_group": self.test_secondary_muscle_group.slug,
            "secondary_groups": [self.test_secondary_muscle_group.slug],
            "gif_link_front":  "https://example.com/gifs/front_view.gif",
            "gif_link_side":  "https://example.com/gifs/side_view.gif",
            "steps": ["Step1", "Step2"],
            "mistakes": ["mistake1"]
        }
        response = self.client.post(url, invalid_exercise, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data["secondary_groups"] == "You cannot select the same group as primary and secondary."

    def test_update(self):
        self.client.force_authenticate(user=self.test_admin)

        url = reverse("update-exercise", args=[self.test_exercise.id])

        updated_data = {
            "title": "Updated Exercise",
            "primary_group": self.test_secondary_muscle_group.slug,
            "secondary_groups": []
        }

        response = self.client.put(url, updated_data, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["message"] == "Exercise updated successfully!"
        assert Exercise.objects.filter(title="Updated Exercise").exists()
        
        updated_exercise = Exercise.objects.get(id=self.test_exercise.id)
        assert updated_exercise.primary_group == self.test_secondary_muscle_group

    def test_update_invalid(self):
        self.client.force_authenticate(user=self.test_admin)

        url = reverse("update-exercise", args=[self.test_exercise.id])

        invalid_updated_data = {
            "primary_group": "invalidgroup",
        }
        response = self.client.put(url, invalid_updated_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data["primary_group"] == "Primary group not found."

        url = reverse("update-exercise", args=[self.test_exercise.id])

        invalid_updated_data = {
            "primary_group": self.test_secondary_muscle_group.slug,
            "secondary_groups": [self.test_secondary_muscle_group.slug]
        }

        response = self.client.put(url, invalid_updated_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data["secondary_groups"] == "You cannot select the same group as primary and secondary."
    
    def test_delete_success(self):
        self.client.force_authenticate(user=self.test_admin)

        url = reverse("delete-exercise", args=[self.test_exercise.id])

        response = self.client.delete(url)

        assert response.status_code == status.HTTP_200_OK

    def test_delete_invalid(self):
        self.client.force_authenticate(user=self.test_admin)

        url = reverse("delete-exercise", args=[999999])

        response = self.client.delete(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_get_exercises_group_success(self):
        self.client.force_authenticate(user=self.test_user)

        url = reverse("exercises-group")

        exercises_group = {
            "muscle_group_id": self.test_muscle_group.slug,
            "search_query": self.test_exercise.title[:4]
        }

        response = self.client.post(url, exercises_group, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert any(ex["title"].startswith(self.test_exercise.title[:4]) for ex in response.data["exercises"])

        exercise_per_group = Exercise.objects.filter(primary_group__slug=self.test_muscle_group.slug).count()
        assert exercise_per_group == 1

    def test_get_exercises_group_missing(self):
        self.client.force_authenticate(user=self.test_user)

        url = reverse("exercises-group")

        missing_excercise_group = {
            "muscle_group_id": "",
            "search_query": self.test_exercise.title[:4]
        }

        response = self.client.post(url, missing_excercise_group, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data["error"] == "Muscle group ID is required."

    def test_get_exercises_group_invalid(self):
        self.client.force_authenticate(user=self.test_user)

        url = reverse("exercises-group")

        invalid_excercise_group = {
            "muscle_group_id": "invalidgroup",
            "search_query": self.test_exercise.title[:4]
        }

        response = self.client.post(url, invalid_excercise_group, format="json")

        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.data["error"] == "Invalid muscle group."

    def test_get_exercise_by_slug_success(self):
        self.client.force_authenticate(user=self.test_user)

        url = reverse("exercises-detail-slug", args=[self.test_muscle_group.slug, self.test_exercise.slug])

        response = self.client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["title"] == self.test_exercise.title
        assert response.data["primary_group"] == self.test_exercise.primary_group.slug

    def test_get_exercise_by_slug_invalid(self):
        self.client.force_authenticate(user=self.test_user)

        url = reverse("exercises-detail-slug", args=["invalidgroup", self.test_exercise.slug])

        response = self.client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.data["error"] == "Invalid muscle group."

        url = reverse("exercises-detail-slug", args=[self.test_muscle_group.slug, "invalidexerciseslug"])

        response = self.client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.data["error"] == "Invalid exercise."
