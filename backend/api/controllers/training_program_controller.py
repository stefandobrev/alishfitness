from django.db import transaction
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from api.models import User, MuscleGroup, Exercise
from api.serializers.common_serializers import ExerciseTitleSerializer, UserNamesSerializer
from api.serializers.training_program_serializers import TrainingProgramSerializer


class TrainingProgramController:
    """Controller handling all training programs-related operations."""

    def get_muscle_groups_and_exercises(self, request):
        """Returns all muscle groups and exercises in a tree structure"""
        all_muscle_groups = MuscleGroup.objects.all().order_by("name").only("name", "slug")
        all_users = User.objects.all().order_by("last_name").only("first_name", "last_name", "username")       

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
        if request.data.get("schedule_array"):
            schedule_array = request.data.pop("schedule_array")
            if len(schedule_array) < 1:
                raise ValidationError({"schedule_array": "Schedule cannot be empty."})
        else:
            raise ValidationError(
                {"schedule_array": "Schedule is missing!"}
            )
        
        transformed_data = self._transform_data(request.data)

        serializer = TrainingProgramSerializer(data=transformed_data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        with transaction.atomic():
            program, temp_id_mapping = serializer.save()
            
            transformed_schedule = self._transform_schedule(schedule_array, temp_id_mapping) 

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
        if data.get("assigned_user_username"):
            username = data.pop("assigned_user_username", None)
            try:
                data["assigned_user"] = User.objects.get(username=username).id
            except User.DoesNotExist: 
                raise ValidationError({"assigned_user": f"User '{data["assigned_user"]}' doesn't exist."})

        if data.get("sessions"):
            if len(data["sessions"]) < 1:
                raise ValidationError({"sessions": "Sessions cannot be empty."})
            
            for session in data["sessions"]:
                if session.get("exercises"):
                    if len(session["exercises"]) < 1:
                        raise ValidationError({"exercises": "Exercises cannot be empty."})
                    
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
                            if muscle_group_input != "custom": 
                                try:
                                    exercise["muscle_group"] = MuscleGroup.objects.get(slug=muscle_group_input).id
                                except MuscleGroup.DoesNotExist:
                                    raise ValidationError(
                                        {"muscle_group_input": f"Muscle group '{muscle_group_input}' not found."}
                                    ) 
                                exercise["is_custom_muscle_group"] = False
                                exercise["custom_exercise_title"] = None

                            elif muscle_group_input == "custom":
                                exercise["muscle_group"] = None
                                exercise["exercise"] = None
                                exercise["is_custom_muscle_group"] = True

                            else:
                                raise ValidationError(
                                    {"muscle_group_input": "Muscle group invalid."}
                                )

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
                    temp_id: f"{temp_id} is invalid session."
                })
        return transformed