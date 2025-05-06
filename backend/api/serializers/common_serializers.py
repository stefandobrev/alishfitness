from rest_framework import serializers

from api.models import User, MuscleGroup, Exercise

class UserNamesSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "username"]

class MuscleGroupTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = MuscleGroup
        fields = ["name", "slug"]

class ExerciseTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ["title", "slug"]