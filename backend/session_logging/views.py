from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils.timezone import now
from django.shortcuts import get_object_or_404

from collections import defaultdict

from training_program.models import TrainingProgram, TrainingSession
from session_logging.models import SessionLog

from training_program.serializers import TrainingExerciseDetailSerializer

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

        summary = defaultdict(lambda: {"last_completed_at": None, "completed_count": 0})
        for log in completed_logs:
            s_id = log.session_id
            summary[s_id]["completed_count"] += 1
            if (summary[s_id]["last_completed_at"] is None or 
                log.completed_at > summary[s_id]["last_completed_at"]):
                summary[s_id]["last_completed_at"] = log.completed_at

        # Get sessions with today updates to include in recommended
        today = now().date()

        today_logs = SessionLog.objects.filter(
            training_program=training_program,
            session_id__in=session_ids,
            updated_at__date=today,
        )

        today_status_map = {log.session_id: log.status for log in today_logs}

        data = {
            "id": training_program.id,
            "program_title": training_program.program_title,
            "schedule_data": training_program.schedule_data,
            "sessions": [],
        }
        
        data["sessions"] = []
        for session in training_sessions:
            session_summary = summary.get(session.id, {"last_completed_at": None, "completed_count": 0})
            data["sessions"].append({
                "id": session.id,
                "title": session.session_title,
                "last_completed_at": session_summary["last_completed_at"],
                "completed_count": session_summary["completed_count"],
                "status": today_status_map.get(session.id),
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
