from rest_framework import status
from rest_framework.response import Response

from ..models import MuscleGroup, Exercise
from ..serializers.common_serializers import ExerciseTitleSerializer


class TrainingProgramController:
    """Controller handling all training programs-related operations."""

    def get_muscle_groups_and_exercises(self, request):
        """Returns all muscle groups and exercises in a tree structure"""
        muscle_groups = MuscleGroup.objects.all()

        data = {}

        for muscle_group in muscle_groups:
            excercises = Exercise.objects.filter(primary_group=muscle_group)

            exercise_data = ExerciseTitleSerializer(excercises, many=True).data

            data[muscle_group.slug] = {
                "name": muscle_group.name,
                "slug": muscle_group.slug,
                "excercises": exercise_data
            }
        return Response(data)