from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import render

from collections import defaultdict

from training_program.models import TrainingProgram, TrainingSession
from session_logging.models import SessionLog

class ActiveProgramView(APIView):
    """View for get current active training program for logged user."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Return all sessions related to current active training program data."""
        user = request.user
        training_program = TrainingProgram.objects.get(assigned_user=user, status="current")
        training_sessions = TrainingSession.objects.filter(program=training_program)

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
            })

        return Response(data)
