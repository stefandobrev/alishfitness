from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.db import transaction
from django.db.models import Q
from django.utils.dateparse import parse_date

from api.models import User, MuscleGroup, Exercise, TrainingProgram
from api.serializers.common_serializers import ExerciseTitleSerializer, UserNamesSerializer
from api.serializers.training_program_serializers import TrainingProgramSerializer


class TrainingProgramController:
    """Controller handling all training programs-related operations."""

    def get_training_setup_data(self, request):
        """Returns all muscle groups and exercises in a tree structure"""
        all_muscle_groups = MuscleGroup.objects.all().order_by("name").only("name", "slug")
        all_users = User.objects.all().order_by("last_name").only("id", "first_name", "last_name", "username")       

        data = {
            "muscle_groups": {},
            "users": UserNamesSerializer(all_users, many=True).data
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
    
    def get_filter_data(self, request):
        """Returns mode and users for filter modes in View All Training Programs."""

        
    
    def get_training_programs(self, request):
        """Returns all or filtered training programs."""
        search_query = request.data.get("search_query", "")
        filter_mode = request.data.get("filter_mode", None)
        filter_user = request.data.get("filter_user", None)
        filter_date = request.data.get("filter_date", None)
        items_per_page = request.data.get("items_per_page")
        offset = request.data.get("offset", 0)

        if not items_per_page:
            return Response({"items_per_page": "Items per page is required."}, status=400)
        
        query = TrainingProgram.objects.all()

        if search_query:
            query = query.filter(Q(program_title__iexact=search_query) | Q(program_title__icontains=search_query))

        if filter_mode:
            query = query.filter(Q(mode__iexact=filter_mode))

        if filter_user:
            query = query.filter(Q(assigned_user__username__iexact=filter_user))

        if filter_date:
            start_date = parse_date(filter_date.get("from"))
            end_date = parse_date(filter_date.get("to"))
            if start_date and end_date:
                query = query.filter(Q(activation_date__range=(start_date, end_date)))
            else:
                return Response({"filter_date": "Activation date range incomplete."}, status=400)

        training_programs = query[offset: offset + items_per_page].values("program_title", "assigned_user__username", "activation_date")

        return Response({
            "training_programs": list(training_programs),
            "total_count": query.count()
        })
    
    def has_active_program(self, request):
        """Returns boolean whether user has current training program assigned."""
        assigned_user_id = request.data.get("assigned_user")

        query = TrainingProgram.objects.filter(
            status__iexact="current",
            assigned_user__id=assigned_user_id
        )

        return Response(query.exists())
    
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
            if "schedule_array" in request.data:
                schedule_array = request.data["schedule_array"]
                if len(schedule_array) < 1:
                    raise ValidationError({"schedule_array": "Schedule cannot be empty."})
            else:
                raise ValidationError({"schedule_array": "Schedule is missing!"})
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            transformed_data = self._transform_data(request.data)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        serializer = TrainingProgramSerializer(data=transformed_data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        with transaction.atomic():
            program, temp_id_mapping = serializer.save()
            
            try:
                transformed_schedule = self._transform_schedule(schedule_array, temp_id_mapping) 
            except ValidationError as e:
                return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

            program.schedule_array = transformed_schedule
            program.save()

        return Response({"message": "Program created successfully!"}, status=status.HTTP_201_CREATED)
    
    def update(self, request, id):
        """Update an existing program."""
        pass

    def _transform_data(self, data):
        """
        Transform sets to ints, PKs for muscle_group and exercise or 
        is_custom_muscle_group set to True and custom_exercise_title set to None 
        with custom exercise title. Send to serializer.
        """
        if data.get("sessions"):           
            for session in data["sessions"]:
                if session.get("exercises"):
                    for exercise in session["exercises"]:
                        if "sets" in exercise: ## On update it might already be int
                            sets_value = exercise.get("sets")
                            if sets_value:
                                try:
                                    exercise["sets"] = int(sets_value)
                                    if exercise["sets"] < 1:
                                        raise ValidationError({"sets": "Sets must be a positive number."})
                                except (ValueError, TypeError):
                                    raise ValidationError({"sets": "Sets must be a valid number."})

                        if exercise.get("muscle_group_input"):
                            muscle_group_input = exercise.pop("muscle_group_input", None)
                            
                            if muscle_group_input == "custom":
                                exercise["muscle_group"] = None
                                exercise["exercise"] = None
                                exercise["is_custom_muscle_group"] = True
                            
                            else: 
                                try:
                                    exercise["muscle_group"] = MuscleGroup.objects.get(slug=muscle_group_input).id
                                except MuscleGroup.DoesNotExist:
                                    raise ValidationError(
                                        {"muscle_group_input": f"Muscle group '{muscle_group_input}' not found."}
                                    ) 
                                exercise["is_custom_muscle_group"] = False
                                exercise["custom_exercise_title"] = None

                        if exercise.get("exercise_input"):
                            exercise_input = exercise.pop("exercise_input", None)
                            if exercise["is_custom_muscle_group"]:
                                exercise["custom_exercise_title"] = exercise_input
                            else:
                                try:
                                    exercise["exercise"] = Exercise.objects.get(slug=exercise_input).id
                                except Exercise.DoesNotExist:
                                    raise ValidationError(
                                        {"exercise_input": f"Exercise '{exercise_input}' not found."}
                                    )

        return data

    def _transform_schedule(self, schedule_array, temp_id_mapping):
        """Transform temporary session IDs to actual database IDs.
        temp_id_mapping is a dict where temp_ids are they key and values are
        the backend unique ids.
    
        Args:
            schedule_array: List of session strings references to transform as ids"""
        transformed = []
        for temp_id in schedule_array:
            if temp_id in temp_id_mapping:
                transformed.append(temp_id_mapping[temp_id])
            else:
                raise ValidationError({
                    "temp_id": f"{temp_id} is invalid session."
                })
        return transformed