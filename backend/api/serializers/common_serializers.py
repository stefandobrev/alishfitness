from rest_framework import serializers

from ..models import MuscleGroup, Exercise

class MuscleGroupTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = MuscleGroup
        fields = ["name", "slug"]

class ExerciseTitleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Exercise
        fields = ["title", "slug"]