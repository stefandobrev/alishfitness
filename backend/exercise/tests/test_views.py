import pytest
from rest_framework import status
from django.urls import reverse
from django.utils.dateparse import parse_datetime
from copy import deepcopy
from exercise.models import Exercise, Step

@pytest.mark.django_db(transaction=True)
class TestMuscleGroup:
    def test_get_muscle_groups(self, api_client, test_user, test_muscle_group, test_secondary_muscle_group):        
        api_client.force_authenticate(user=test_user)
        url = reverse("exercises-muscle-groups")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        expected_data = [
            {"name": "Test Muscle Group", "slug": "test-muscle-group"},
            {"name": "Test Secondary Muscle Group", "slug": "test-secondary-muscle-group"}
        ]
        assert response.data == expected_data


@pytest.mark.django_db(transaction=True)
class TestExerciseTitleView:
    @pytest.fixture
    def valid_search_data(self):
        return {
            "search_query": "",
            "sort": None,
            "muscle_groups":  [],
            "items_per_page": 6,
            "offset": 0        
        }

    def test_get_exercise_titles(self, api_client, test_admin, valid_search_data, test_exercise):
        api_client.force_authenticate(user=test_admin)
        url = reverse("exercise-titles")
        response = api_client.post(url, valid_search_data, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 1

    def test_get_exercise_titles_by_muscle_group(self, api_client, test_admin, valid_search_data, test_exercise, test_muscle_group):
        api_client.force_authenticate(user=test_admin)
        search_data = deepcopy(valid_search_data)
        search_data["muscle_groups"] = [test_muscle_group.slug]
        url = reverse("exercise-titles")
        response = api_client.post(url, search_data, format="json")
        assert response.status_code == status.HTTP_200_OK
        exercise_ids = [ex["id"] for ex in response.data]
        filtered_exercises = Exercise.objects.filter(primary_group__slug=test_muscle_group.slug)
        for ex in filtered_exercises:
            assert ex.id in exercise_ids

    def test_get_exercise_titles_by_sort(self, api_client, test_admin, valid_search_data, test_muscle_group):
        api_client.force_authenticate(user=test_admin)
        url = reverse("exercise-titles")

        Exercise.objects.create(
            title="Test Exercise 1",
            slug="test-exercise-1",
            primary_group=test_muscle_group,
            gif_link_front="https://example.com/gifs/front_view.gif",
            gif_link_side="https://example.com/gifs/side_view.gif",
        )
        Exercise.objects.create(
            title="Test Exercise 2",
            slug="test-exercise-2",
            primary_group=test_muscle_group,
            gif_link_front="https://example.com/gifs/front_view.gif",
            gif_link_side="https://example.com/gifs/side_view.gif",
        )

        search_data = deepcopy(valid_search_data)
        search_data["sort"] = "created_at"
        response = api_client.post(url, search_data, format="json")
        if len(response.data) >= 2:
            created_0 = parse_datetime(str(response.data[0]["created_at"]))
            created_1 = parse_datetime(str(response.data[1]["created_at"]))
            assert created_0 >= created_1

        search_data["sort"] = "updated_at"
        response = api_client.post(url, search_data, format="json")
        if len(response.data) >= 2:
            updated_0 = parse_datetime(str(response.data[0]["updated_at"]))
            updated_1 = parse_datetime(str(response.data[1]["updated_at"]))
            assert updated_0 >= updated_1

    def test_get_exercise_titles_by_search(self, api_client, test_admin, test_exercise, valid_search_data):
        api_client.force_authenticate(user=test_admin)
        search_data = deepcopy(valid_search_data)
        search_data["search_query"] = test_exercise.title[:4]
        url = reverse("exercise-titles")
        response = api_client.post(url, search_data, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert any(ex["title"].startswith(test_exercise.title[:4]) for ex in response.data)

    def test_get_exercise_titles_offset(self, api_client, test_admin, valid_search_data, test_muscle_group):
        api_client.force_authenticate(user=test_admin)

        for i in range(10):
            Exercise.objects.create(
                title=f"Test Exercise {i}",
                slug=f"test-exercise-{i}",
                primary_group=test_muscle_group,
                gif_link_front="https://example.com/gifs/front_view.gif",
                gif_link_side="https://example.com/gifs/side_view.gif",
            )
        
        url = reverse("exercise-titles")

        response = api_client.post(url, valid_search_data, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 6  

        valid_search_data["offset"] = 6
        response = api_client.post(url, valid_search_data, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) > 0  


@pytest.mark.django_db(transaction=True)
class TestExerciseViewSet:
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
        url = reverse("exercise-detail", args=[999999999])
        response = api_client.get(url)
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "exercise" in response.data
        assert response.data["exercise"] == "Exercise not found."

    def test_create(self, api_client, test_admin, test_muscle_group):
        api_client.force_authenticate(user=test_admin)
        url = reverse("exercise-list")
        new_exercise = {
            "title": "Test New Exercise",
            "primary_group": test_muscle_group.slug,
            "gif_link_front": "https://example.com/gifs/front_view.gif",
            "gif_link_side": "https://example.com/gifs/side_view.gif",
            "steps": [{"description": "Step1"}, {"description": "Step2"}],
            "mistakes": [{"description": "mistake1"}]
        }
        response = api_client.post(url, new_exercise, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["message"] == "Exercise created successfully!"
        assert Exercise.objects.filter(title="Test New Exercise").exists()
        steps = Step.objects.filter(exercise__title="Test New Exercise").order_by("order")
        assert steps[0].description == "Step1"
        assert steps[1].description == "Step2"   

    def test_update(self, api_client, test_admin, test_exercise, test_secondary_muscle_group):
        api_client.force_authenticate(user=test_admin)
        url = reverse("exercise-detail", args=[test_exercise.id])
        updated_data = {
            "title": "Updated Test Exercise",
            "primary_group": test_secondary_muscle_group.slug, 
            "secondary_groups": []
        }
        response = api_client.put(url, updated_data, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["message"] == "Exercise updated successfully!"
        assert Exercise.objects.filter(title="Updated Test Exercise").exists()
        updated_exercise = Exercise.objects.get(id=test_exercise.id)
        assert updated_exercise.primary_group == test_secondary_muscle_group
    
    def test_delete_success(self, api_client, test_admin, test_exercise):
        api_client.force_authenticate(user=test_admin)
        url = reverse("exercise-detail", args=[test_exercise.id])
        response = api_client.delete(url)
        assert response.status_code == status.HTTP_200_OK

    def test_delete_invalid(self, api_client, test_admin):
        api_client.force_authenticate(user=test_admin)
        url = reverse("exercise-detail", args=[999999])
        response = api_client.delete(url)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_get_exercises_group_success(self, api_client, test_user, test_muscle_group, test_exercise):
        api_client.force_authenticate(user=test_user)
        url = reverse("filtered-exercises")
        exercises_group = {
            "muscle_group_id": test_muscle_group.slug,
            "search_query": test_exercise.title[:4],
            "items_per_page": 6
        }
        response = api_client.post(url, exercises_group, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert any(ex["title"].startswith(test_exercise.title[:4]) for ex in response.data["exercises"])
        exercise_per_group = Exercise.objects.filter(primary_group__slug=test_muscle_group.slug).count()
        assert exercise_per_group == 1

    def test_get_exercises_group_missing(self, api_client, test_user, test_exercise):
        api_client.force_authenticate(user=test_user)
        url = reverse("filtered-exercises")
        missing_excercise_group = {
            "muscle_group_id": "",
            "search_query": test_exercise.title[:4],
            "items_per_page": 6
        }
        response = api_client.post(url, missing_excercise_group, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data["muscle_group_id"] == "Muscle group ID is required."

    def test_get_exercises_group_invalid(self, api_client, test_user, test_exercise):
        api_client.force_authenticate(user=test_user)
        url = reverse("filtered-exercises")
        invalid_excercise_group = {
            "muscle_group_id": "invalidgroup",
            "search_query": test_exercise.title[:4],
            "items_per_page": 6
        }
        response = api_client.post(url, invalid_excercise_group, format="json")
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.data["muscle_group_id"] == "Invalid muscle group."


@pytest.mark.django_db(transaction=True)
class TestExerciseBySlugView:
    def test_get_exercise_by_slug(self, api_client, test_user, test_exercise):
        api_client.force_authenticate(user=test_user)
        url = reverse("exercises-detail-slug", args=[test_exercise.primary_group.slug, test_exercise.slug])
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["slug"] == test_exercise.slug

    def test_get_exercise_by_slug_invalid(self, api_client, test_user, test_exercise):
        api_client.force_authenticate(user=test_user)
        url = reverse("exercises-detail-slug", args=[test_exercise.primary_group.slug, "invalid-exercise"])
        response = api_client.get(url)
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "exercise_slug" in response.data
        assert response.data["exercise_slug"] == "Invalid exercise."