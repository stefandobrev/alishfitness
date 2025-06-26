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

    def create(self, validated_data):
        """
        Create function overrides the default one. Creates session log and loops over
        the range of sets to create blank values for weights and reps for each set.
        """
        session_log = SessionLog.objects.create(**validated_data)
        session = validated_data["session"]

        for exercise in session.exercises.all():
            for set_number in range(1, exercise.sets + 1):
                SetLog.objects.create(
                    session_log=session_log,
                    exercise=exercise, 
                    set_number=set_number,
                    sequence=exercise.sequence
                )

        return session_log

class SetLogSerializer(serializers.ModelSerializer):
    """Serializer for set logs."""
    
    class Meta:
        model = SetLog
        fields = ["id", "exercise", "set_number", "sequence", "weight", "reps"]


class SessionLogDetailSerializer(serializers.ModelSerializer):
    """
        Serializer which includes the session log data, including related session 
        and exercises related to it.
    """
    session = TrainingSessionDetailSerializer(read_only=True)
    set_logs = SetLogSerializer(many=True, read_only=True)

    class Meta:
        model = SessionLog
        fields = ["id", "status", "session", "set_logs"]      
