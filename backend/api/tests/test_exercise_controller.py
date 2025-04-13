import pytest
from rest_framework import status
from django.urls import reverse
from django.utils.dateparse import parse_datetime

from api.models import Exercise, Step

@pytest.mark.django_db(transaction=True)
class TestExerciseController:
    def test_get_muscle_groups(self, api_client, test_user, test_muscle_group, test_secondary_muscle_group):        
        api_client.force_authenticate(user=test_user)
        url = reverse("exercises-muscle-groups")
        response = api_client.get(url)

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

    def test_get_exercise_titles(self, api_client, test_user, test_exercise, test_muscle_group):
        api_client.force_authenticate(user=test_user)

        url = reverse("exercise-titles")

        response = api_client.post(url, {"search_query": test_exercise.title}, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 1
       
        if test_exercise.primary_group:
            response = api_client.post(url, {"muscle_groups": [test_exercise.primary_group.slug]}, format="json")
            assert response.status_code == status.HTTP_200_OK
            exercise_ids = [exercise["id"] for exercise in response.data]
            filtered_exercises = Exercise.objects.filter(primary_group__slug=test_exercise.primary_group.slug)[:10]
            for exercise in filtered_exercises:
                assert exercise.id in exercise_ids

        response = api_client.post(url, {"sort": "created_at"}, format="json")
        if len(response.data) >= 2:
            assert parse_datetime(response.data[0]["created_at"]) >= parse_datetime(response.data[1]["created_at"])

        response = api_client.post(url, {"sort": "updated_at"}, format="json")
        if len(response.data) >= 2:
            assert parse_datetime(response.data[0]["updated_at"]) >= parse_datetime(response.data[1]["updated_at"])

        response = api_client.post(url, {}, format="json")
        assert response.status_code == status.HTTP_200_OK
        if len(response.data) >= 2:
            sorted_titles = sorted([exercise["title"] for exercise in response.data])
            assert [exercise["title"] for exercise in response.data] == sorted_titles

        for i in range(15):
            Exercise.objects.create(
                title=f"Test Exercise {i}",
                slug=f"test-exercise-{i}",
                primary_group=test_muscle_group,
                gif_link_front = "https://example.com/gifs/front_view.gif",
                gif_link_side = "https://example.com/gifs/side_view.gif",
            )
    
        response = api_client.post(url, {}, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 10  
        
        response = api_client.post(url, {"offset": 10}, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) > 0  

        if test_exercise.primary_group:
            filtered_titles = {
                    "search_query": test_exercise.title[:4],  
                    "muscle_groups": [test_exercise.primary_group.slug],
                    "sort": "created_at"
                }
            response = api_client.post(url, filtered_titles, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert any(ex["title"].startswith(test_exercise.title[:4]) for ex in response.data)

    def test_get_exercise(self, api_client, test_user, test_exercise):
        api_client.force_authenticate(user=test_user)

        url = reverse("exercise-detail", args=[test_exercise.id])
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["id"] == test_exercise.id
        assert response.data["title"] == test_exercise.title
        assert len(response.data["secondary_groups"]) == 1

    def test_get_exercise_invalid(self, api_client, test_user):
        api_client.force_authenticate(user=test_user)

        invalid_id = 999999999
        url = reverse("exercise-detail", args=[invalid_id])
        response = api_client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "error" in response.data
        assert response.data["error"] == "Exercise not found."

    def test_create(self, api_client, test_admin, test_muscle_group):
        api_client.force_authenticate(user=test_admin)

        url = reverse("create-exercise")
        new_exercise = {
            "title": "Test New Exercise",
            "primary_group": test_muscle_group.slug,
            "gif_link_front":  "https://example.com/gifs/front_view.gif",
            "gif_link_side":  "https://example.com/gifs/side_view.gif",
            "steps": ["Step1", "Step2"],
            "mistakes": ["mistake1"]
        }
        response = api_client.post(url, new_exercise, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["message"] == "Exercise created successfully!"
        assert Exercise.objects.filter(title="Test New Exercise").exists()
        
        steps = Step.objects.filter(exercise__title="Test New Exercise").order_by("order")
        assert steps[0].description == "Step1"
        assert steps[0].order == 1
        assert steps[1].description == "Step2"
        assert steps[1].order == 2

    def test_create_invalid_primary_group(self, api_client, test_admin, test_secondary_muscle_group):
        api_client.force_authenticate(user=test_admin)

        url = reverse("create-exercise")

        invalid_exercise = {
            "title": "Test New Exercise",
            "primary_group": "invalidgroup",
            "gif_link_front":  "https://example.com/gifs/front_view.gif",
            "gif_link_side":  "https://example.com/gifs/side_view.gif",
            "steps": ["Step1", "Step2"],
            "mistakes": ["mistake1"]
        }
        response = api_client.post(url, invalid_exercise, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data["primary_group"] == "Primary group not found."

        invalid_exercise = {
            "title": "Test New Exercise",
            "primary_group": test_secondary_muscle_group.slug,
            "secondary_groups": [test_secondary_muscle_group.slug],
            "gif_link_front":  "https://example.com/gifs/front_view.gif",
            "gif_link_side":  "https://example.com/gifs/side_view.gif",
            "steps": ["Step1", "Step2"],
            "mistakes": ["mistake1"]
        }
        response = api_client.post(url, invalid_exercise, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data["secondary_groups"][0] == "You cannot select the same group as primary and secondary."

    def test_update(self, api_client, test_admin, test_exercise, test_secondary_muscle_group):
        api_client.force_authenticate(user=test_admin)

        url = reverse("update-exercise", args=[test_exercise.id])

        print(test_secondary_muscle_group.slug)

        updated_data = {
            "title": "Updated Test Exercise",
            "primary_group": test_secondary_muscle_group.slug, 
            "secondary_groups": []
        }

        response = api_client.put(url, updated_data, format="json")

        print(response.data)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["message"] == "Exercise updated successfully!"
        assert Exercise.objects.filter(title="Updated Test Exercise").exists()
        
        updated_exercise = Exercise.objects.get(id=test_exercise.id)
        assert updated_exercise.primary_group == test_secondary_muscle_group

    def test_update_invalid(self, api_client, test_admin, test_exercise, test_secondary_muscle_group):
        api_client.force_authenticate(user=test_admin)

        url = reverse("update-exercise", args=[test_exercise.id])

        invalid_updated_data = {
            "primary_group": "invalidgroup",
        }
        response = api_client.put(url, invalid_updated_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data["primary_group"] == "Primary group not found."
    
    def test_delete_success(self, api_client, test_admin, test_exercise):
        api_client.force_authenticate(user=test_admin)

        url = reverse("delete-exercise", args=[test_exercise.id])

        response = api_client.delete(url)

        assert response.status_code == status.HTTP_200_OK

    def test_delete_invalid(self, api_client, test_admin):
        api_client.force_authenticate(user=test_admin)

        url = reverse("delete-exercise", args=[999999])

        response = api_client.delete(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_get_exercises_group_success(self, api_client, test_user, test_muscle_group ,test_exercise):
        api_client.force_authenticate(user=test_user)

        url = reverse("exercises-group")

        exercises_group = {
            "muscle_group_id": test_muscle_group.slug,
            "search_query": test_exercise.title[:4]
        }

        response = api_client.post(url, exercises_group, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert any(ex["title"].startswith(test_exercise.title[:4]) for ex in response.data["exercises"])

        exercise_per_group = Exercise.objects.filter(primary_group__slug=test_muscle_group.slug).count()
        assert exercise_per_group == 1

    def test_get_exercises_group_missing(self, api_client, test_user, test_exercise):
        api_client.force_authenticate(user=test_user)

        url = reverse("exercises-group")

        missing_excercise_group = {
            "muscle_group_id": "",
            "search_query": test_exercise.title[:4]
        }

        response = api_client.post(url, missing_excercise_group, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data["error"] == "Muscle group ID is required."

    def test_get_exercises_group_invalid(self, api_client, test_user, test_exercise):
        api_client.force_authenticate(user=test_user)

        url = reverse("exercises-group")

        invalid_excercise_group = {
            "muscle_group_id": "invalidgroup",
            "search_query": test_exercise.title[:4]
        }

        response = api_client.post(url, invalid_excercise_group, format="json")

        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.data["error"] == "Invalid muscle group."

    def test_get_exercise_by_slug_success(self, api_client, test_user, test_muscle_group, test_exercise):
        api_client.force_authenticate(user=test_user)

        url = reverse("exercises-detail-slug", args=[test_muscle_group.slug, test_exercise.slug])

        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["title"] == test_exercise.title
        assert response.data["primary_group"] == test_exercise.primary_group.slug

    def test_get_exercise_by_slug_invalid(self, api_client, test_user, test_exercise, test_muscle_group):
        api_client.force_authenticate(user=test_user)

        url = reverse("exercises-detail-slug", args=["invalidgroup", test_exercise.slug])

        response = api_client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.data["error"] == "Invalid muscle group."

        url = reverse("exercises-detail-slug", args=[test_muscle_group.slug, "invalidexerciseslug"])

        response = api_client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.data["error"] == "Invalid exercise."
