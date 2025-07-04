from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.response import Response
from django.utils.timezone import now
from django.shortcuts import get_object_or_404

from collections import defaultdict

from training_program.models import TrainingProgram, TrainingSession
from session_logging.models import SessionLog, SetLog

from training_program.serializers import TrainingExerciseDetailSerializer
from session_logging.serializers import SessionLogSerializer, SessionLogDetailSerializer, SetLogSerializer

class ActiveProgramView(APIView):
    """View for get current active training program for logged user."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Return all sessions related to current active training program data."""
        user = request.user
        training_program = get_object_or_404(TrainingProgram, assigned_user=user, status="current")
        training_sessions = TrainingSession.objects.filter(program=training_program)

        # Get updated_at dates and count the completed session
        session_ids = training_sessions.values_list("id", flat=True)
        completed_logs = SessionLog.objects.filter(
            training_program=training_program,
            session_id__in=session_ids,
            status="completed"
        )


        # Summary for each session completed count and last update date
        summary = defaultdict(lambda: {"last_completed_at": None, "completed_count": 0})
        for log in completed_logs:
            s_id = log.session_id
            summary[s_id]["completed_count"] += 1
            if (summary[s_id]["last_completed_at"] is None or 
                log.updated_at > summary[s_id]["last_completed_at"]):
                summary[s_id]["last_completed_at"] = log.updated_at

        # Get sessions with today updates to include in recommended along with status and session log id
        today = now().date()

        today_logs = SessionLog.objects.filter(
            training_program=training_program,
            session_id__in=session_ids,
            updated_at__date=today,
        )

        today_status_map = {log.session_id: {"id": log.id, "status": log.status} for log in today_logs}

        # Reorder sessions according to current schedule data
        session_map = {session.id: session for session in training_sessions}

        current_schedule = training_program.schedule_data

        ordered_sessions = []
        for item in current_schedule:
            session_id = item["session_id"]
            if session_id in session_map:
                ordered_sessions.append(session_map[session_id])

        data = {
            "id": training_program.id,
            "program_title": training_program.program_title,
            "schedule_data": current_schedule,
            "sessions": [],
        }

        print("Current schedule:", current_schedule)
        
        data["sessions"] = []
        for session in ordered_sessions:
            session_summary = summary.get(session.id, {"last_completed_at": None, "completed_count": 0})
            data["sessions"].append({
                "id": session.id,
                "title": session.session_title,
                "last_completed_at": session_summary["last_completed_at"],
                "completed_count": session_summary["completed_count"],
                "status": today_status_map.get(session.id, {}).get("status"),
                "session_log_id": today_status_map.get(session.id, {}).get("id"),
            })

        return Response(data)
    
class TrainingSessionView(APIView):
    """View for get training session ,part of assigned training program."""
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        """Returns filtered exercise data for all exercises related to the selected session."""
        session = get_object_or_404(TrainingSession, id=id)
        exercises = session.exercises.all()
        serializer_data = TrainingExerciseDetailSerializer(exercises, many=True).data

        filtered_data = []

        for ex in serializer_data:
            title = ex.get("exercise_title") or ex.get("custom_exercise_title")
            filtered_data.append({
                "sequence": ex["sequence"],
                "sets": ex["sets"],
                "reps": ex["reps"],
                "exercise_title": title,
            })

        return Response(filtered_data)
    
class SessionLogsViewSet(viewsets.ViewSet):
    """View for session log (daily trainings) operations"""
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, pk):
        """Returns session log data. All set logs created with empty string."""
        try:
            session_log = SessionLog.objects.select_related("session").get(pk=pk)
            if session_log.created_at.date() == session_log.updated_at.date():
                serializer = SessionLogDetailSerializer(session_log)
                return Response(serializer.data) 
            else:
                return Response({"message": "Editing this session is no longer allowed."}, status=status.HTTP_403_FORBIDDEN)
        except:
            return Response({"session_log": "Session log not found"}, status=status.HTTP_404_NOT_FOUND)

    def create(self, request):
        """
            Create a new daily session log along with all set logs based on number of sets
            for each exercise.
            Session log on default is changed to in progress + 
            complete_at and updated_at set current time.

            Args:
                request: training program and training session ids.

            Returns:
                Response with session log id.
        """
        print("Request data:", request.data)
        # serializer = SessionLogSerializer(data = request.data)
        # serializer.is_valid(raise_exception=True)
        # session_log = serializer.save()
        return Response(status=status.HTTP_201_CREATED)
        # return Response({"id": session_log.id}, status=status.HTTP_201_CREATED)

    def partial_update(self, request, pk):
        """
        Completes the session. Change of the status to completed.
        """
        print("Request data:", request.data)
        session_log = SessionLog.objects.get(pk=pk)
        serializer = SessionLogSerializer(session_log, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message", "Session completed!"})

class SetLogsView(APIView):
    """View for updating setLogs"""
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        """Using only patch method to update.""" 
        try:
            session_log = SessionLog.objects.select_related("training_program").get(id=id)
        except SessionLog.DoesNotExist:
            raise NotFound("Session log not found.")

        if session_log.training_program.assigned_user != request.user:
            raise PermissionDenied("You do not have permission to update this session.")

        set_logs_data = request.data

        for key, set_data in set_logs_data.items():
            set_log = SetLog.objects.get(id=set_data["id"])
            serializer = SetLogSerializer(set_log, data=set_data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()

        return Response({"message": "Iei"}, status=status.HTTP_200_OK)