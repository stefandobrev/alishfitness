from rest_framework import serializers

from training_program.models import TrainingProgram, TrainingSession, TrainingExercise
from session_logging.models import SessionLog, SetLog

from training_program.serializers import TrainingSessionDetailSerializer

class SessionLogSerializer(serializers.ModelSerializer):
    """ Serializer for training program and session fields within the model. """
    training_program_id = serializers.PrimaryKeyRelatedField(
        source = "training_program",
        queryset = TrainingProgram.objects.all()
    )

    session_id = serializers.PrimaryKeyRelatedField(
        source = "session",
        queryset = TrainingSession.objects.all()
    )

    class Meta:
        model = SessionLog
        fields = ["training_program_id", "session_id"]

class SessionLogWithExercisesSerializer(serializers.ModelSerializer):
    """
        Serializer which includes the session log data, including related session 
        and exercises related to it.
    """
    session = TrainingSessionDetailSerializer(read_only=True)

    class Meta:
        model = SessionLog
        fields = ["id", "status", "session"]   

class SessionLogWithExercisesAndSetLogsSerializer(serializers.ModelSerializer):
    """
        Serializer which includes the session log data and, including related session,
        exercises and set logs related to it.
    """
    session = TrainingSessionDetailSerializer(read_only=True)

    class Meta:
        model = SessionLog
        fields = ["id", "status", "session"]       
