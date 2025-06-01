from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.exceptions import ValidationError
from django.db import transaction
from django.db.models import Q, F
from django.utils import timezone
from django.utils.dateparse import parse_date
from django.shortcuts import get_object_or_404

from user.models import User
from exercise.models import Exercise, MuscleGroup
from training_program.models import TrainingProgram, TrainingSession, TrainingExercise

from user.serializers import UserSummarySerializer
from exercise.serializers import ExerciseTitleSerializer
from training_program.serializers import TrainingProgramSerializer, TrainingProgramDetailSerializer


class TrainingSetupDataView(APIView):
    """View for retrieving training setup data."""
    permission_classes = [IsAdminUser]

    def get(self, request):
        """Returns all muscle groups and exercises in a tree structure"""
        all_muscle_groups = MuscleGroup.objects.all().order_by("name").only("name", "slug")
        all_users = User.objects.all().order_by("last_name").only("id", "first_name", "last_name", "username")       

        data = {
            "muscle_groups": {},
            "users": UserSummarySerializer(all_users, many=True).data
        }

        for muscle_group in all_muscle_groups:
            exercises = Exercise.objects.filter(primary_group=muscle_group).order_by("title").only("title", "slug")

            exercise_data = ExerciseTitleSerializer(exercises, many=True).data

            data["muscle_groups"][muscle_group.slug] = {
                "name": muscle_group.name,
                "slug": muscle_group.slug,
                "exercises": exercise_data
            }
        return Response(data)


class FilterDataView(APIView):
    """View for retrieving filter data."""
    permission_classes = [IsAdminUser]

    def get(self, request):
        """
        Returns mode, users and status for filter 
        modes in View All Training Programs.
        """
        all_modes = TrainingProgram.PROGRAM_MODES
        all_users = User.objects.all().order_by("last_name").only("id", "first_name", "last_name", "username")       
        all_statuses = TrainingProgram.PROGRAM_STATUSES

        data = {
            "modes": all_modes,
            "users": UserSummarySerializer(all_users, many=True).data,
            "statuses": all_statuses
        }

        return Response(data)


class HasActiveProgramView(APIView):
    """View for checking if a user has an active program."""
    permission_classes = [IsAdminUser]

    def post(self, request):
        """Returns boolean whether user has current training program assigned."""
        assigned_user_id = request.data.get("assigned_user")

        query = TrainingProgram.objects.filter(
            status__iexact="current",
            assigned_user__id=assigned_user_id
        )

        return Response(query.exists())


class FilteredTrainingProgramsView(APIView):
    """View for retrieving training programs."""
    permission_classes = [IsAdminUser]

    def post(self, request):
        """Returns all or filtered training programs."""
        search_query = request.data.get("search_query", "")
        filter_mode = request.data.get("filter_mode", None)
        filter_user = request.data.get("filter_user", None)
        filter_status = request.data.get("filter_status", None)
        filter_start_date = request.data.get("filter_start_date", None)
        filter_end_date = request.data.get("filter_end_date", None)
        items_per_page = request.data.get("items_per_page")
        sort_config = request.data.get("sort_config", [])
        offset = request.data.get("offset", 0)

        if not items_per_page:
            return Response({"items_per_page": "Items per page is required."}, status=400)
        
        query = TrainingProgram.objects.all()

        if search_query:
            query = query.filter(Q(program_title__iexact=search_query) | Q(program_title__icontains=search_query))

        if filter_mode:
            query = query.filter(Q(mode__iexact=filter_mode))

        if filter_user:
            query = query.filter(Q(assigned_user=filter_user))

        if filter_status:
            query = query.filter(Q(status__iexact=filter_status))

        if filter_start_date:
            start_date = parse_date(filter_start_date)
            if start_date:
                if filter_end_date:
                    end_date = parse_date(filter_end_date)
                    if end_date:
                        query = query.filter(activation_date__range=(start_date, end_date))
                else:
                    query = query.filter(activation_date__gte=start_date)
        
        sort_key_map = {
            "title": "program_title",
            "mode": "mode",
            "assigned_user": "assigned_user__last_name",
            "status": "status",
            "activation_date": "activation_date",
            "last_updated": "updated_at"
        }
        
        ordering = []
        sort_keys = [s["key"] for s in sort_config]
        for sort in sort_config:
            key = sort_key_map.get(sort["key"])
            direction = "" if sort["direction"] == "asc" else "-"
            ordering.append(f"{direction}{key}")
        if "last_updated" not in sort_keys:
            ordering.append('-updated_at')
        
        query = query.order_by(*ordering)

        training_programs = query[offset: offset + items_per_page].annotate(
            assigned_user_username=F("assigned_user__username"),
            assigned_user_first_name=F("assigned_user__first_name"),
            assigned_user_last_name=F("assigned_user__last_name"),
        ).values(
            "id",
            "program_title",
            "assigned_user_username",
            "assigned_user_first_name",
            "assigned_user_last_name",
            "mode",
            "status",
            "activation_date",
            "updated_at"
        )

        return Response({
            "training_programs": list(training_programs),
            "total_count": query.count()
        })


class TrainingProgramViewSet(viewsets.ViewSet):
    """View for creating a new training program."""

    def get_permissions(self):
        """Set appropriate permissions based on action."""
        if self.action in ["create", "update", "destroy"]:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def retrieve(self, request, pk):
        """Return an training program's data from the DB."""
        try:
            program = TrainingProgram.objects.prefetch_related(
                "sessions__exercises"
            ).select_related("assigned_user").get(pk=pk)
            
            return Response(TrainingProgramDetailSerializer(program).data)
        except:
            return Response({"training_program": "Training program not found"}, status=status.HTTP_404_NOT_FOUND)

    def create(self, request):
        """
            Create a new training program or new template.
            Schedule array is removed from serializer validation (validated first)
            and send to transform schedule to have it mapped with created session ids.

            Args:
                request: HTTP request containing data.

            Returns:
                Response with messages.
        """
        try:
            if "schedule_data" in request.data:
                schedule_data = request.data["schedule_data"]
                if len(schedule_data) < 1:
                    raise ValidationError({"schedule_data": "Schedule cannot be empty."})
            else:
                raise ValidationError({"schedule_data": "Schedule is missing!"})
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        try:
            transformed_data = self._transform_data(request.data)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        # print("Schedule array is: ", transformed_data["schedule_data"])
        serializer = TrainingProgramSerializer(data=transformed_data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        with transaction.atomic():
            try:
                program, temp_id_mapping = serializer.save()
                
                transformed_schedule = self._transform_schedule(schedule_data, temp_id_mapping) 
                
                program.schedule_data = transformed_schedule
                
                program.save()
            except ValidationError as e:
                return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Program created successfully!"}, status=status.HTTP_201_CREATED)
    
    def partial_update(self, request, pk=None):
        """
        Update an existing program.
        
        Args:
            Id, request: HTTP request containing data.

        Returns:
            Response with messages.
        """
        program = TrainingProgram.objects.get(pk=pk)

        deleted_session_ids = request.data.pop("deleted_session_ids", [])
        deleted_exercise_ids = []
        for session_id in deleted_session_ids:
            session = TrainingSession.objects.get(id=session_id)
            session.delete()

        for session in request.data.get("sessions", []):
            erased_exercise_ids = session.pop("deleted_exercise_ids", [])
            deleted_exercise_ids.extend(erased_exercise_ids)

        for exercise_id in deleted_exercise_ids:
            exercise = TrainingExercise.objects.get(id=exercise_id)
            exercise.delete()

        transformed_data = self._transform_data(request.data)
        serializer = TrainingProgramSerializer(program, data=transformed_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Program updated successfully!"}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def _transform_data(self, data):
        """
        Helper functions for transforming sets, muscle groups and exercises.

        Assigns status based on activation date. Future dates will assign scheduled, today's date
        will assing current, making a previous current program archived.
        """
        if data.get("sessions"):
            for session in data["sessions"]:
                for exercise in session.get("exercises", []):
                    self._validate_sets(exercise)
                    self._process_muscle_group(exercise)
                    self._process_exercise_input(exercise)

        if data.get("mode") == "assigned" and data.get("assigned_user"): 
            activation_date = parse_date(data.get("activation_date"))
            if not activation_date:
                raise ValidationError({"activation_date": "Activation date is missing."})
            
            today = timezone.now().date()
            print(f"Activation date: {activation_date}, Type: {type(activation_date)}, Today: {today}, Type: {type(today)}")

            if activation_date > today:
                data["status"] = "scheduled"
            else:
                TrainingProgram.objects.filter(
                    assigned_user=data["assigned_user"],
                    status="current"
                ).update(status="archived")

                data["status"] = "current"

        return data
    
    def _validate_sets(self, exercise):
        """Transforms set string to int."""
        sets_value = exercise.get("sets")
        if not sets_value:
            return
        try:
            exercise["sets"] = int(sets_value)
            if exercise["sets"] < 1:
                raise ValidationError({"sets": "Sets must be a positive number."})
        except (ValueError, TypeError):
            raise ValidationError({"sets": "Sets must be a valid number."})
        
    def _process_muscle_group(self, exercise):
        """Assigns PK to muscle group. Saves as custom as alternative."""
        muscle_group_input = exercise.pop("muscle_group_input", None)
        if not muscle_group_input:
            return
        if muscle_group_input == "custom":
            exercise.update({
                "muscle_group": None,
                "exercise": None,
                "is_custom_muscle_group": True,
            })
        else:
            try:
                exercise["muscle_group"] = MuscleGroup.objects.get(slug=muscle_group_input).id
            except MuscleGroup.DoesNotExist:
                raise ValidationError({"muscle_group_input": f"Muscle group '{muscle_group_input}' not found."})
            exercise.update({
                "is_custom_muscle_group": False,
                "custom_exercise_title": None,
            })

    def _process_exercise_input(self, exercise):
        """Assigns PK to exercise. Saves as custom if muscle group is custom."""
        exercise_input = exercise.pop("exercise_input", None)
        if not exercise_input:
            return
        if exercise.get("is_custom_muscle_group"):
            exercise["custom_exercise_title"] = exercise_input
        else:
            try:
                exercise["exercise"] = Exercise.objects.get(slug=exercise_input).id
            except Exercise.DoesNotExist:
                raise ValidationError({"exercise_input": f"Exercise '{exercise_input}' not found."})

    def _transform_schedule(self, schedule_data, temp_id_mapping):
        """Transform temporary session IDs to actual database IDs.
        temp_id_mapping is a dict where temp_ids are they key and values are
        the backend unique ids.
    
        Args:
            schedule_data: List of session strings references to transform as ids"""
        transformed = []
        for entry in schedule_data:
            temp_id = entry.get("temp_id")
            if temp_id in temp_id_mapping:
                transformed.append(temp_id_mapping[temp_id])
            else:
                raise ValidationError({
                    "temp_id": f"{temp_id} is invalid session."
                })
        return transformed
    
    def destroy(self, request, pk=None):
        """Delete an existing training-program model."""
        program = get_object_or_404(TrainingProgram, id=pk)
        program.delete()
        return Response({"message": "Program deleted successfully!"})
    
class TrainingProgramTitleView(APIView):
    """View for getting training program titles with template mode."""
    permission_classes = [IsAdminUser]

    def get(self, request):
        "Return all training program titles with template mode from DB."
        templates = TrainingProgram.objects.filter(mode="template").order_by("program_title")
        template_list = templates.values("id","program_title")
        return Response(list(template_list))