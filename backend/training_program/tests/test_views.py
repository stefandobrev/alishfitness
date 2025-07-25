import pytest
from rest_framework import status
from django.urls import reverse
from copy import deepcopy

from datetime import date, timedelta

from training_program.models import TrainingProgram, TrainingExercise


@pytest.mark.django_db(transaction=True)
class TestTrainingSetupDataView:   
    def test_get_training_setup_data(self, api_client, test_user, test_admin, test_muscle_group):
        api_client.force_authenticate(user=test_admin)
        url = reverse("training-setup-data")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        
        assert len(response.data) >= 1
        assert test_muscle_group.slug in response.data["muscle_groups"] 
        assert any(user["username"] == test_user.username for user in response.data["users"])


@pytest.mark.django_db(transaction=True)
class TestFilterDataView: 
    def test_get_filter_data(self, api_client, test_admin):
        api_client.force_authenticate(user=test_admin)
        url = reverse("training-programs-filter-data")  
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert "modes" in response.data
        assert "users" in response.data
        assert "statuses" in response.data


@pytest.mark.django_db(transaction=True)
class TestHasActiveProgramView:
    def test_user_has_active_program(self, api_client, test_admin, test_training_program, test_user):
        api_client.force_authenticate(user=test_admin)
        url = reverse("has-active-program")  
        
        data = {"assigned_user": test_user.id}
        response = api_client.post(url, data, format="json")
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data is True  

    def test_user_has_no_active_program(self, api_client, test_admin, test_user):
        api_client.force_authenticate(user=test_admin)
        url = reverse("has-active-program")
        
        data = {"assigned_user": test_user.id}
        response = api_client.post(url, data, format="json")
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data is False

    def test_missing_user_id(self, api_client, test_admin):
        api_client.force_authenticate(user=test_admin)
        url = reverse("has-active-program")
        
        response = api_client.post(url, {}, format="json")
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data is False


@pytest.mark.django_db(transaction=True)
class TestFilteredTrainingProgramsView:
    @pytest.fixture
    def valid_search_data(self):
        return {
            "search_query": "",
            "filter_mode": None,
            "filter_user": None,
            "filter_status": None,
            "filter_start_date": None,
            "filter_end_date": None,
            "sort_config": [],
            "items_per_page": 10,
            "offset": 0
        }

    def test_get_training_program_count(self, api_client, valid_search_data, test_admin, test_training_program, test_training_template):
        api_client.force_authenticate(test_admin)
        count_data = deepcopy(valid_search_data)

        url = reverse("filtered-training-programs")
        response = api_client.post(url, count_data, format="json")

        assert response.data["total_count"] == 2

    def test_missing_items_per_page(self, api_client, test_admin):
        api_client.force_authenticate(test_admin)
        data = {"search_query": ""}  
        
        url = reverse("filtered-training-programs")
        response = api_client.post(url, data, format="json")
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Items per page is required." in response.data["items_per_page"]

    def test_get_training_program_by_search(self, api_client, valid_search_data, test_admin, test_training_program, test_training_template):
        api_client.force_authenticate(test_admin)
        search_data = deepcopy(valid_search_data)
        search_data["search_query"] = "Test"

        url = reverse("filtered-training-programs")
        response = api_client.post(url, search_data, format="json")

        assert response.data["total_count"] == 2

        search_data["search_query"] = test_training_program.program_title[7:]

        url = reverse("filtered-training-programs")
        response = api_client.post(url, search_data, format="json")

        assert response.data["total_count"] == 1
        assert any(program["program_title"].endswith(test_training_program.program_title[7:]) for program in response.data["training_programs"])

    def test_get_training_program_by_mode(self, api_client, valid_search_data, test_admin, test_training_program, test_training_template):
        api_client.force_authenticate(test_admin)
        mode_data = deepcopy(valid_search_data)
        mode_data["filter_mode"] = "template"

        url = reverse("filtered-training-programs")
        response = api_client.post(url, mode_data, format="json")

        assert response.data["total_count"] == 1

    def test_get_training_program_by_user(self, api_client, test_user, valid_search_data, test_admin, test_training_program, test_training_template):
        api_client.force_authenticate(test_admin)
        user_data = deepcopy(valid_search_data)
        user_data["filter_user"] = test_user.id

        url = reverse("filtered-training-programs")
        response = api_client.post(url, user_data, format="json")

        assert response.data["total_count"] == 1

    def test_get_training_program_by_status(self, api_client, valid_search_data, test_admin, test_training_program, test_training_template):
        api_client.force_authenticate(test_admin)
        status_data = deepcopy(valid_search_data)
        status_data["filter_status"] = "current"

        url = reverse("filtered-training-programs")
        response = api_client.post(url, status_data, format="json")

        assert response.data["total_count"] == 1

    def test_get_training_program_by_start_date(self, api_client, valid_search_data, test_admin, test_training_program, test_training_template):
        api_client.force_authenticate(test_admin)
        start_date_data = deepcopy(valid_search_data)
        start_date_data["filter_start_date"] = test_training_program.activation_date - timedelta(days=1)

        url = reverse("filtered-training-programs")
        response = api_client.post(url, start_date_data, format="json")

        assert response.data["total_count"] == 1

    def test_get_training_program_by_range_date(self, api_client, valid_search_data, test_admin, test_training_program, test_training_template):
        api_client.force_authenticate(test_admin)
        range_date_data = deepcopy(valid_search_data)
        range_date_data["filter_start_date"] = test_training_program.activation_date - timedelta(days=1)
        range_date_data["filter_end_date"] = test_training_program.activation_date + timedelta(days=1)

        url = reverse("filtered-training-programs")
        response = api_client.post(url, range_date_data, format="json")

        assert response.data["total_count"] == 1

    def test_sort_training_program_by_mode(self, api_client, test_admin, valid_search_data, test_training_program, test_training_template):
        api_client.force_authenticate(test_admin)
        sort_mode_data = deepcopy(valid_search_data)
        sort_mode_data["sort_config"] = [{"key": "mode", "direction": "asc"}]

        url = reverse("filtered-training-programs")
        response = api_client.post(url, sort_mode_data, format="json")
        programs = response.data["training_programs"]
        assert programs[0]["program_title"] == "Test Program"
        assert programs[1]["program_title"] == "Test Template"

    def test_sort_training_program_by_title(self, api_client, test_admin, valid_search_data, test_training_program, test_training_template):
        api_client.force_authenticate(test_admin)
        sort_title_data = deepcopy(valid_search_data)
        sort_title_data["sort_config"] = [{"key": "title", "direction": "desc"}]

        url = reverse("filtered-training-programs")
        response = api_client.post(url, sort_title_data, format="json")
        programs = response.data["training_programs"]

        assert programs[0]["program_title"] == "Test Template"
        assert programs[1]["program_title"] == "Test Program"


@pytest.mark.django_db(transaction=True)
class TestTrainingProgramViewSet:
    @pytest.fixture
    def valid_training_program_data(self, test_user, test_exercise, test_muscle_group):
        activation_date = date.today()

        return {
            "program_title": "Test Program",
            "mode": "assigned",
            "assigned_user": test_user.id,
            "activation_date": activation_date,
            "schedule_data": [{"order": 1, "temp_id": "1", "real_id": None}, {"order": 2, "temp_id": "2", "real_id": None}, {"order": 3, "temp_id": "1", "real_id": None}],
            "sessions": [
                {
                    "session_title": "Day 1",
                    "temp_id": "1",
                    "exercises": [
                        {   
                            "muscle_group_input": test_muscle_group.slug,
                            "exercise_input": test_exercise.slug,
                            "sequence": "A",
                            "sets": "3",
                            "reps": "10-12",
                        },
                    ]
                },
                {
                    "session_title": "Day 2",
                    "temp_id": "2",
                    "exercises": [
                        {
                            "muscle_group_input": "custom",
                            "exercise_input": "Custom Exercise",
                            "sequence": "A",
                            "sets": "2",
                            "reps": "10",
                        },
                    ]
                }
            ]
        }

    def test_retrieve_program(self, api_client, test_admin, test_training_program):
        api_client.force_authenticate(user=test_admin)
        url = reverse("training-program-detail", args=[test_training_program.id])
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data["program_title"] == test_training_program.program_title

    def test_retrieve_nonexistent_program(self, api_client, test_admin):
        api_client.force_authenticate(user=test_admin)
        url = reverse("training-program-detail", args=[999999])
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_create_program(self, valid_training_program_data, api_client, test_admin):
        valid_data = deepcopy(valid_training_program_data)

        api_client.force_authenticate(user=test_admin)
        url = reverse("training-program-list")
        response = api_client.post(url, valid_data, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data.get("message") == "Program created successfully!"
        
        program = TrainingProgram.objects.get(program_title="Test Program")
    
        assert program is not None
        
        day_1_session = program.sessions.filter(session_title="Day 1").first()
        day_2_session = program.sessions.filter(session_title="Day 2").first()

        assert program.schedule_data == [{"order": 1,"session_id": day_1_session.id}, {"order": 2, "session_id": day_2_session.id}, {"order": 3, "session_id": day_1_session.id}]
        
        assert day_1_session is not None
        assert day_2_session is not None
        
        assert TrainingExercise.objects.filter(session=day_2_session, sequence="A").exists()
        assert TrainingExercise.objects.filter(session=day_1_session, sequence="A").exists()

    def test_invalid_schedule(self, valid_training_program_data, api_client, test_admin):
        invalid_schedule_data = deepcopy(valid_training_program_data)
        invalid_schedule_data["schedule_data"] = []

        api_client.force_authenticate(user=test_admin)
        url = reverse("training-program-list")
        response = api_client.post(url, invalid_schedule_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data.get("schedule_data") == "Schedule cannot be empty."

        invalid_schedule_data.pop("schedule_data", None)

        api_client.force_authenticate(user=test_admin)
        url = reverse("training-program-list")
        response = api_client.post(url, invalid_schedule_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data.get("schedule_data") == "Schedule is missing!"

    def test_invalid_sets(self, valid_training_program_data, api_client, test_admin):
        invalid_sets_data = deepcopy(valid_training_program_data)
        invalid_sets_data["sessions"][0]["exercises"][0]["sets"] = "-1"

        api_client.force_authenticate(user=test_admin)
        url = reverse("training-program-list")
        response = api_client.post(url, invalid_sets_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data.get("sets") == "Sets must be a positive number."

        invalid_sets_data["sessions"][0]["exercises"][0]["sets"] = "k"
        api_client.force_authenticate(user=test_admin)
        url = reverse("training-program-list")
        response = api_client.post(url, invalid_sets_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data.get("sets") == "Sets must be a valid number."

    def test_invalid_muscle_group(self, valid_training_program_data, api_client, test_admin):
        invalid_muscle_group_data = deepcopy(valid_training_program_data)
        invalid_muscle_group_data["sessions"][0]["exercises"][0]["muscle_group_input"] = "invalid"

        api_client.force_authenticate(user=test_admin)
        url = reverse("training-program-list")
        response = api_client.post(url, invalid_muscle_group_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "not found." in response.data.get("muscle_group_input")

    def test_invalid_exercise(self, valid_training_program_data, api_client, test_admin):
        invalid_exercise_data = deepcopy(valid_training_program_data)
        invalid_exercise_data["sessions"][0]["exercises"][0]["is_custom_muscle_group"] = False
        invalid_exercise_data["sessions"][0]["exercises"][0]["exercise_input"] = "invalid"

        api_client.force_authenticate(user=test_admin)
        url = reverse("training-program-list")
        response = api_client.post(url, invalid_exercise_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "not found." in response.data.get("exercise_input")

    def test_invalid_schedule_id(self, valid_training_program_data, api_client, test_admin):
        invalid_schedule_id_data = deepcopy(valid_training_program_data)
        invalid_schedule_id_data["schedule_data"] = [{"order": 4, "temp_id": "3", "real_id": None}]

        api_client.force_authenticate(user=test_admin)
        url = reverse("training-program-list")
        response = api_client.post(url, invalid_schedule_id_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "invalid session." in str(response.data)

    def test_missing_date(self, valid_training_program_data, api_client, test_admin):
        missing_date_data = deepcopy(valid_training_program_data)
        missing_date_data["activation_date"] = ""

        api_client.force_authenticate(user=test_admin)
        url = reverse("training-program-list")
        response = api_client.post(url, missing_date_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Activation date is missing." in response.data.get("activation_date")

    def test_valid_program_status(self, test_training_program, valid_training_program_data, api_client, test_admin):
        valid_data = deepcopy(valid_training_program_data)
        valid_data["program_title"] = "Current Test Program"
        
        api_client.force_authenticate(user=test_admin)
        url = reverse("training-program-list")
        response = api_client.post(url, valid_data, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        current_program = TrainingProgram.objects.get(program_title="Current Test Program")

        assert current_program.status == "current"
        
        old_program = TrainingProgram.objects.get(id=test_training_program.id)
        assert old_program.status == "archived"

        valid_data["program_title"] = "Scheduled Test Program"
        valid_data["activation_date"] += timedelta(days=1)

        url = reverse("training-program-list")
        response = api_client.post(url, valid_data, format="json")
        scheduled_program = TrainingProgram.objects.get(program_title="Scheduled Test Program")
        assert scheduled_program.status == "scheduled"

    def test_update_program(self, api_client, test_admin, test_training_program):
        api_client.force_authenticate(user=test_admin)
        url = reverse("training-program-detail", args=[test_training_program.id])
        
        update_data = {
            "program_title": "Updated Program Title",
        }
        
        response = api_client.patch(url, update_data, format="json")
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data["message"] == "Program updated successfully!"

    def test_delete_success(self, api_client, test_admin, test_training_program, test_training_template):
        api_client.force_authenticate(test_admin)

        all_programs = TrainingProgram.objects.all()
        assert len(all_programs) == 2

        url = reverse("training-program-detail", args=[test_training_program.id])
        response = api_client.delete(url)

        all_programs = TrainingProgram.objects.all()

        assert response.status_code == status.HTTP_200_OK
        assert len(all_programs) == 1

    def test_delete_invalid(self, api_client, test_admin):
        api_client.force_authenticate(test_admin)

        url = reverse("training-program-detail", args=[999999])
        response = api_client.delete(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db(transaction=True)
class TestTrainingProgramTitleView:
    def test_get_template_titles(self, api_client, test_admin, test_training_template):
        api_client.force_authenticate(user=test_admin)
        url = reverse("templates") 
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 1
        assert any(program["program_title"] == test_training_template.program_title for program in response.data)

    def test_only_templates_returned(self, api_client, test_admin, test_training_program, test_training_template):
        api_client.force_authenticate(user=test_admin)
        url = reverse("templates")
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert not any(program["program_title"] == test_training_program.program_title for program in response.data)
        assert any(program["program_title"] == test_training_template.program_title for program in response.data)
