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

            Args:
                request: HTTP request containing data.

            Returns:
                Response with messages.
        """
        transformed_data = self._transform_data(request.data)
        serializer = TrainingProgramSerializer(data=transformed_data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        with transaction.atomic():
            program = serializer.save()

            self._transform_schedule(program.schedule_array) 

            # program.save()

        return Response({"message": "Program created successfully!"})
    
    def update(self, request, id):
        """Update an existing program."""
        pass

    def _transform_data(self, data):
        """
        Transform sets to ints, PKs for muscle_group and exercise_input or 
        is_custom_muscle_group set to True with custom exercise title.
        """
        if data["assigned_user_username"]:
            data["assigned_user"] = User.objects.get(username=data["assigned_user_username"]).id

        if data["sessions"]:
            for session in data.get("sessions", []):
                for exercise in session.get("exercises", []):
                    if exercise["sets"]:
                        exercise["sets"] = int(exercise.get("sets"))

                    if exercise["muscle_group_input"]:
                        if exercise["muscle_group_input"] != "custom": 
                            try:
                                exercise["muscle_group"] = MuscleGroup.objects.get(slug=exercise["muscle_group_input"]).id
                            except MuscleGroup.DoesNotExist:
                                raise ValidationError(
                                    {"muscle_group_input": f"Muscle group '{exercise['muscle_group_input']}' not found."}
                                ) 
                        elif exercise["muscle_group_input"] == "custom":
                            exercise["muscle_group"] = None
                            exercise["is_custom_muscle_group"] = True

                    if exercise.get("exercise_input"):
                        if exercise.get("is_custom_muscle_group"):
                            exercise["custom_exercise_title"] = exercise["exercise_input"]
                        else:
                            try:
                                exercise["exercise"] = Exercise.objects.get(slug=exercise["exercise_input"]).id
                            except Exercise.DoesNotExist:
                                raise ValidationError(
                                    {"exercise_input": f"Exercise '{exercise['exercise_input']}' not found."}
                                )

            return data

    
    def _transform_schedule(self, schedule_data):
        """Assign backend ids on tempIds places within the schedule."""
        temp_id_mapping = {}
        pass

