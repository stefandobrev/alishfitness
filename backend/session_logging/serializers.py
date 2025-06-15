from rest_framework import serializers

from training_program.models import TrainingProgram, TrainingSession, TrainingExercise
from session_logging.models import SessionLog, SetLog

class SessionLogSerializer(serializers.ModelSerializer):
    """ Serializer for training program and session fields within the model. """
    training_program_id = serializers.PrimaryKeyRelatedField(
        source = 'training_program',
        queryset = TrainingProgram.objects.all()
    )

    session_id = serializers.PrimaryKeyRelatedField(
        source = 'session',
        queryset = TrainingSession.objects.all()
    )

    class Meta:
        model = SessionLog
        fields = ['training_program_id', 'session_id']