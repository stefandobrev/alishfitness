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
        """
            Gathers all related training program sessions data.
            Reorders schedule data if there are completed session logs to put the recommended
            (next) session on first place in the new ordered schedule data. Excludes today's 
            completed session log to keep it at the recommended spot.
        
            Returns:
                All sessions related to current active training program data.
                The statuses of the active session logs for today.
                Last updated date of each session id + order.
                Counter based on session ids only (no order included).
        """
        user = request.user
        training_program = get_object_or_404(
            TrainingProgram, assigned_user=user, status="current"
        )
        training_sessions = TrainingSession.objects.filter(program=training_program)
        # Gather completed sessions
        session_ids = training_sessions.values_list("id", flat=True)
        completed_logs = SessionLog.objects.filter(
            training_program=training_program,
            session_id__in=session_ids,
            status="completed"
        )
        # Track count per session_id
        counter = defaultdict(int)
    
        # Track last completed time per (session_id, order)
        last_completed = {}
        for log in completed_logs:
            counter[log.session_id] += 1
            key = (log.session_id, log.order)
            if key not in last_completed or log.completed_at > last_completed[key]:
                last_completed[key] = log.completed_at
        
        # Check for sessions which were updated today
        today = now().date()
        today_logs = SessionLog.objects.filter(
            training_program=training_program,
            session_id__in=session_ids,
            updated_at__date=today,
        )
        today_status_map = {
            (log.session_id, log.order): {"id": log.id, "status": log.status}
            for log in today_logs
        }
        session_map = {session.id: session for session in training_sessions}
        current_schedule = training_program.schedule_data
        
        # Reorder schedule based on last completed session
        past_completed_logs = completed_logs.exclude(completed_at__date=today)

        if past_completed_logs.exists():
            last_completed_log = max(past_completed_logs, key=lambda log: log.completed_at)
            last_completed_order = last_completed_log.order
            
            # Split schedule into items after last_completed_order and the rest
            items_after = [item for item in current_schedule if item["order"] > last_completed_order]
            items_before_and_including = [item for item in current_schedule if item["order"] <= last_completed_order]
            
            # Reorder: items after last_completed_order first, then the rest
            current_schedule = items_after + items_before_and_including
        
        data = {
            "id": training_program.id,
            "program_title": training_program.program_title,
            "schedule_data": current_schedule,
            "sessions": [],
        }
        for item in current_schedule:
            session_id = item["session_id"]
            order = item["order"]
            session = session_map.get(session_id)
            if not session:
                continue
            key = (session_id, order)
            data["sessions"].append({
                "id": session.id,
                "title": session.session_title,
                "order": order,
                "last_completed_at": last_completed.get(key).isoformat() if last_completed.get(key) else None,
                "completed_count": counter.get(session_id, 0),
                "status": today_status_map.get(key, {}).get("status"),
                "session_log_id": today_status_map.get(key, {}).get("id"),
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
            Creates a new daily session log along with all set logs based on number of sets
            for each exercise.
            Session log on default is changed to in progress + 
            complete_at and updated_at set current time.

            Args:
                request: training program, training session ids and order number(int).

            Returns:
                Response with session log id.
        """
        serializer = SessionLogSerializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        session_log = serializer.save()
        return Response({"id": session_log.id}, status=status.HTTP_201_CREATED)

    def partial_update(self, request, pk):
        """
        Completes the session. Change of the status to completed.
        """
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

        return Response({"message": "Set updated."}, status=status.HTTP_200_OK)
    

class ViewTrendsView(APIView):
    """View for View Trends button"""

    def get(self, request, id):
        """ 
        Get all exercises with this id for the particular user to prepare
        the trend graphs.
        """
        active_user = request.user

        session_logs = SessionLog.objects.filter(
            training_program__assigned_user=active_user,
            set_logs__exercise_id = id,
            status="completed"
         ).distinct().order_by("completed_at")
        
        data = []
        for session in session_logs:
            sets = session.set_logs.filter(exercise_id = id)

            if not sets or all((s.weight or 0) == 0 or (s.reps or 0) == 0 for s in sets):
                continue

            max_set = max(sets, key=lambda s: s.weight)
            max_weight = max_set.weight 
            reps_with_max = max_set.reps

            total_volume = sum((s.weight) * (s.reps) for s in sets)

            data.append({
                "date": session.completed_at.date(),
                "max_weight": float(max_weight),
                "reps": reps_with_max,
                "volume": float(total_volume),
            })
        
        return Response(data)