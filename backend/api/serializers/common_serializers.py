from rest_framework import serializers

from api.models import MuscleGroup, Exercise

class MuscleGroupTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = MuscleGroup
        fields = ["name", "slug"]

class ExerciseTitleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Exercise
        fields = ["title", "slug"]