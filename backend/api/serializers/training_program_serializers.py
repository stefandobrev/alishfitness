from rest_framework import serializers
from api.models import Exercise, TrainingProgram, TrainingSession, ProgramExercise

class TriningSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingSession
        fields = ["session_title"]
        extra_kwargs = {"temp_id"}

class ProgramExercise(serializers.ModelSerializer):
    class Meta:
        model = ProgramExercise
        fields = [""]