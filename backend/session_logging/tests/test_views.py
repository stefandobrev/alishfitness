import pytest
from rest_framework import status
from django.urls import reverse

from datetime import date

from training_program.models import TrainingSession, TrainingExercise
from session_logging.models import SessionLog, SetLog

@pytest.fixture
def training_session(test_exercise, test_training_program, test_muscle_group):
    session = TrainingSession.objects.create(
        session_title="Test Session Title",
        program=test_training_program
    )

    TrainingExercise.objects.create(
        session=session,
        exercise=test_exercise,
        muscle_group=test_muscle_group,
        is_custom_muscle_group=False,
        custom_exercise_title=None,
        sequence="A",
        sets=3,
        reps="10-12"
    )

    TrainingExercise.objects.create(
        session=session,
        exercise=None,
        muscle_group=None,
        is_custom_muscle_group=True,
        custom_exercise_title="Custom Test Exercise",
        sequence="B",
        sets=4,
        reps="5"
    )

    TrainingExercise.objects.create(
        session=session,
        exercise=test_exercise,
        muscle_group=test_muscle_group,
        is_custom_muscle_group=False,
        custom_exercise_title=None,
        sequence="C",
        sets=4,
        reps="10"
    )

    return session


@pytest.fixture
def existing_session_log(test_training_program, training_session):
    return SessionLog.objects.create(
        training_program=test_training_program,
        session=training_session,
        status="in_progress"
    )

@pytest.fixture
def session_log_with_set_logs(existing_session_log):
    training_exercise = existing_session_log.session.exercises.first()

    SetLog.objects.create(
        session_log=existing_session_log,
        exercise=training_exercise,
        set_number=1,
        weight=50,
        reps=10
    )
    SetLog.objects.create(
        session_log=existing_session_log,
        exercise=training_exercise,
        set_number=2,
        weight=55,
        reps=8
    )
    return existing_session_log


@pytest.mark.django_db(transaction=True)
class TestActiveProgramView:
    def test_get_current_program_with_sessions(self, api_client, test_user, test_training_program):
        api_client.force_authenticate(test_user)

        url = reverse("active-training-program")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["program_title"] == test_training_program.program_title
        assert "sessions" in response.data

    def test_get_current_program_no_active_program(self, api_client, test_user):
        api_client.force_authenticate(test_user)

        url = reverse("active-training-program")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db(transaction=True)
class TestTrainingSessionView:
    def test_get_session_preview(self, api_client, test_user, training_session):
        api_client.force_authenticate(test_user)
        url = reverse("session-data-view", args=[training_session.id])
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        title = response.data[0].get("exercise_title")
        custom_title = response.data[1].get("exercise_title")
        assert title == "Test Exercise"
        assert custom_title == "Custom Test Exercise"

    def test_get_session_preview_no_active_session(self, api_client, test_user):
        api_client.force_authenticate(test_user)
        url = reverse("session-data-view", args=[999999])
        response = api_client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND

@pytest.mark.django_db(transaction=True)
class TestSessionLogsViewSet:
    def test_create_new_session_log(self, api_client, test_user, training_session):
        api_client.force_authenticate(test_user)
        url = reverse("session-logs-detail", args=[1])
        response = api_client.post(url)
        
        assert response.status_code == status.HTTP_201_CREATED

        today_session_quantity = SessionLog.objects.filter(
            session_id = 1,
            training_program__assigned_user = test_user,
            completed_at__date = date.today(),
            status = "in_progress"
        )

        assert today_session_quantity.count() == 1

    def test_update_session_status_to_completed(self, api_client, test_user, training_session, existing_session_log):
        api_client.force_authenticate(test_user)
        
        url = reverse("session-logs-detail", args=[existing_session_log.id])
        update_data = {"status": "completed"}
        response = api_client.patch(url, data=update_data)
        
        assert response.status_code == status.HTTP_200_OK
        
        existing_session_log.refresh_from_db()
        assert existing_session_log.status == "completed"


@pytest.mark.django_db(transaction=True)
class TestSetLogsViewSet:
    def test_update_set_log(self, api_client, test_user, training_session, existing_session_log, session_log_with_set_logs):
        api_client.force_authenticate(test_user)
        url = reverse("set-logs-detail", args=[existing_session_log.id])

        update_data = {
            "set_number": 3,
            "weight": 55,
            "reps": 8}
        response = api_client.patch(url, update_data)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["set_logs"]) == 3 


    def test_get_fresh_session_data_after_create(self, api_client, test_user, training_session, existing_session_log):
        api_client.force_authenticate(test_user)
        
        url = reverse("set-logs-detail", args=[existing_session_log.id])
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data["session_title"] == "Test Session Title"

    def test_get_session_data_with_existing_set_logs(self, api_client, test_user, training_session, session_log_with_set_logs, existing_session_log):
        api_client.force_authenticate(test_user)
        
        url = reverse("set-logs-detail", args=[existing_session_log.id])
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data["session_title"] == "Test Session Title"

        assert "set_logs" in response.data
        assert len(response.data["set_logs"]) == 2 

        first_set = response.data["set_logs"][0]
        assert first_set["reps"] == 10

        second_set = response.data["set_logs"][1]
        assert second_set["weight"] == 55


    