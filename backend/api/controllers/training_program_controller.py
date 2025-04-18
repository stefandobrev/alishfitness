from django.db import transaction
from rest_framework import status
from rest_framework.response import Response

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
        serializer = TrainingProgramSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        with transaction.atomic():
            program = serializer.save()

            self.transform_program_structure(program, request) ## assign real ids to tempIds

            # program.save()

        return Response({"message": "Program created successfully!"})