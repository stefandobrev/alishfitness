import pytest
from rest_framework import status
from django.urls import reverse
from django.utils import timezone

from datetime import date, timedelta, datetime      

from training_program.models import TrainingSession, TrainingExercise
from session_logging.models import SessionLog, SetLog

@pytest.fixture
def training_session(test_exercise, test_training_program, test_muscle_group):
    session = TrainingSession.objects.create(
        session_title="Test Session Title",
        program=test_training_program,
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
        status="in_progress",
        order=1
    )

@pytest.fixture
def session_log_with_set_logs(existing_session_log):
    training_exercise = existing_session_log.session.exercises.first()

    set_log_1 = SetLog.objects.create(
        session_log=existing_session_log,
        exercise=training_exercise,
        set_number=1,
        sequence="A", 
        weight=None,
        reps=None
    )
    set_log_2 = SetLog.objects.create(
        session_log=existing_session_log,
        exercise=training_exercise,
        set_number=2,
        sequence="A",  
        weight=None,
        reps=None
    )
    
    existing_session_log.test_set_log_1_id = set_log_1.id
    existing_session_log.test_set_log_2_id = set_log_2.id
    return existing_session_log


@pytest.mark.django_db(transaction=True)
class TestActiveProgramView:
    def test_get_current_program_with_sessions(self, api_client, test_user, test_training_program, training_session):
        api_client.force_authenticate(test_user)

        url = reverse("active-training-program")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["program_title"] == test_training_program.program_title
        assert "sessions" in response.data
        assert "schedule_data" in response.data
        assert response.data["id"] == test_training_program.id
        
        sessions = response.data["sessions"]
        assert len(sessions) > 0
        
        session = sessions[0]
        assert "id" in session
        assert "title" in session
        assert "order" in session
        assert "last_completed_at" in session
        assert "completed_count" in session
        assert "status" in session
        assert "session_log_id" in session

    def test_get_current_program_no_active_program(self, api_client, test_user):
        api_client.force_authenticate(test_user)

        url = reverse("active-training-program")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_program_with_no_completed_sessions(self, api_client, test_user, test_training_program, training_session):
        api_client.force_authenticate(test_user)
        
        url = reverse("active-training-program")
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        
        sessions = response.data["sessions"]
        assert len(sessions) > 0
        
        for session in sessions:
            assert session["completed_count"] == 0
            assert session["last_completed_at"] is None
            assert session["status"] is None
            assert session["session_log_id"] is None

    def test_program_with_completed_sessions_reordering(self, api_client, test_user, test_training_program, training_session):
        api_client.force_authenticate(test_user)
        
        session_2 = TrainingSession.objects.create(
            session_title="Session 2",
            program=test_training_program,
        )
        session_3 = TrainingSession.objects.create(
            session_title="Session 3", 
            program=test_training_program,
        )
        
        test_training_program.schedule_data = [
            {"session_id": training_session.id, "order": 1},
            {"session_id": session_2.id, "order": 2},
            {"session_id": session_3.id, "order": 3},
        ]
        test_training_program.save()
        
        yesterday = timezone.now() - timedelta(days=1)
        
        SessionLog.objects.create(
            training_program=test_training_program,
            session=session_2,
            order=2,
            status="completed",
            completed_at=yesterday
        )
        
        url = reverse("active-training-program")
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        
        sessions = response.data["sessions"]
        orders = [session["order"] for session in sessions]
        assert orders == [3, 1, 2]  

    def test_program_with_todays_session_logs(self, api_client, test_user, test_training_program, training_session):
        api_client.force_authenticate(test_user)
        
        today_log = SessionLog.objects.create(
            training_program=test_training_program,
            session=training_session,
            order=1,
            status="in_progress"
        )
        
        url = reverse("active-training-program")
        test_training_program.schedule_data = [
            {"session_id": training_session.id, "order": 1}
        ]
        test_training_program.save()
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        
        sessions = response.data["sessions"]
        session = sessions[0]
        
        assert session["status"] == "in_progress"
        assert session["session_log_id"] == today_log.id

    def test_program_with_completed_count_tracking(self, api_client, test_user, test_training_program, training_session):
        api_client.force_authenticate(test_user)
        
        test_training_program.schedule_data = [
            {"session_id": training_session.id, "order": 1}
        ]
        test_training_program.save()
        
        for i in range(3):
            SessionLog.objects.create(
                training_program=test_training_program,
                session=training_session,
                order=1,
                status="completed",
                completed_at=timezone.now() - timedelta(days=i+1)
            )
        
        url = reverse("active-training-program")
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        
        sessions = response.data["sessions"]
        session = sessions[0]
        
        assert session["completed_count"] == 3
        assert session["last_completed_at"] is not None

    def test_program_excludes_todays_completed_from_reordering(self, api_client, test_user, test_training_program, training_session):
        api_client.force_authenticate(test_user)
        
        session_2 = TrainingSession.objects.create(
            session_title="Session 2",
            program=test_training_program,
        )
        
        test_training_program.schedule_data = [
            {"session_id": training_session.id, "order": 1},
            {"session_id": session_2.id, "order": 2},
        ]
        test_training_program.save()
        
        SessionLog.objects.create(
            training_program=test_training_program,
            session=training_session,
            order=1,
            status="completed",
            completed_at=timezone.now()
        )
        
        url = reverse("active-training-program")
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        
        sessions = response.data["sessions"]
        orders = [session["order"] for session in sessions]
        assert orders == [1, 2] 

    def test_program_with_last_completed_tracking(self, api_client, test_user, test_training_program, training_session):
        api_client.force_authenticate(test_user)

        old_time = timezone.now() - timedelta(days=2)
        recent_time = timezone.now() - timedelta(days=1)

        SessionLog.objects.create(
            training_program=test_training_program,
            session=training_session,
            order=1,
            status="completed",
            completed_at=old_time
        )
        recent_log = SessionLog.objects.create(
            training_program=test_training_program,
            session=training_session,
            order=1,
            status="completed",
            completed_at=recent_time
        )

        test_training_program.schedule_data = [
            {"session_id": training_session.id, "order": 1}
        ]
        test_training_program.save()

        url = reverse("active-training-program")
        response = api_client.get(url)

        assert response.status_code == 200

        session_data = next(
            s for s in response.data["sessions"]
            if s["id"] == training_session.id and int(s["order"]) == 1
        )

        assert session_data["last_completed_at"] is not None
        returned_time = datetime.fromisoformat(session_data["last_completed_at"].replace("Z", "+00:00"))

        assert abs((returned_time - recent_log.completed_at).total_seconds()) < 1


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
        url = reverse("session-logs-list")
        response = api_client.post(url, {
            "training_program_id": training_session.program.id,
            "session_id": training_session.id,
            "order": 1 
        })
        assert response.status_code == status.HTTP_201_CREATED

        today_session_quantity = SessionLog.objects.filter(
            session_id=training_session.id,
            training_program__assigned_user = test_user,
            created_at__date = date.today(),
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
        assert existing_session_log.completed_at != None


@pytest.mark.django_db(transaction=True)
class TestSetLogsViewSet:
    def test_update_set_log(self, api_client, test_user, session_log_with_set_logs):
        api_client.force_authenticate(test_user)
        url = reverse("set-logs", args=[session_log_with_set_logs.id])

        update_data = {
            "a_1": {
                "id": session_log_with_set_logs.test_set_log_1_id,
                "weight": 55,
                "reps": 8
            }
        }
        
        response = api_client.patch(url, update_data, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["message"] == "Set updated."
        
        updated_set_log = SetLog.objects.get(id=session_log_with_set_logs.test_set_log_1_id)
        assert updated_set_log.weight == 55
        assert updated_set_log.reps == 8

    def test_update_multiple_set_logs(self, api_client, test_user, session_log_with_set_logs):
        api_client.force_authenticate(test_user)
        url = reverse("set-logs", args=[session_log_with_set_logs.id])

        update_data = {
            "a_1": {
                "id": session_log_with_set_logs.test_set_log_1_id,
                "weight": 50,
                "reps": 10
            },
            "a_2": {
                "id": session_log_with_set_logs.test_set_log_2_id,
                "weight": 55,
                "reps": 8
            }
        }
        
        response = api_client.patch(url, update_data, format='json')

        assert response.status_code == status.HTTP_200_OK
        
        set_log_1 = SetLog.objects.get(id=session_log_with_set_logs.test_set_log_1_id)
        set_log_2 = SetLog.objects.get(id=session_log_with_set_logs.test_set_log_2_id)
        
        assert set_log_1.weight == 50
        assert set_log_1.reps == 10
        assert set_log_2.weight == 55
        assert set_log_2.reps == 8

    def test_update_set_log_not_found(self, api_client, test_user):
        api_client.force_authenticate(test_user)
        url = reverse("set-logs", args=[999999])
        
        update_data = {
            "a_1": {
                "id": 1,
                "weight": 55,
                "reps": 8
            }
        }
        
        response = api_client.patch(url, update_data, format='json')
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_update_set_log_unauthorized(self, api_client, test_admin, session_log_with_set_logs):
        api_client.force_authenticate(test_admin)
        url = reverse("set-logs", args=[session_log_with_set_logs.id])
        
        update_data = {
            "a_1": {
                "id": session_log_with_set_logs.test_set_log_1_id,
                "weight": 55,
                "reps": 8
            }
        }
        
        response = api_client.patch(url, update_data, format="json")
        assert response.status_code == status.HTTP_403_FORBIDDEN
  