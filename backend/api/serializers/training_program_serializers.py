from rest_framework import serializers
from datetime import datetime

from api.models import User, TrainingProgram, TrainingSession, ProgramExercise

class ProgramExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramExercise
        fields = ["sequence", "muscle_group", "exercise_input", "reps", "sets"]

class TrainingSessionSerializer(serializers.ModelSerializer):
    exercises = ProgramExerciseSerializer(many=True)

    class Meta:
        model = TrainingSession
        fields = ["session_title", "temp_id", "exercises"]

class TrainingProgramSerializer(serializers.ModelSerializer):
    """
    Serializer for Training Program and it's nested Training Sessions and
    Program Exercises.
    """
    sessions = TrainingSessionSerializer(many=True)

    class Meta:
        model = TrainingProgram
        fields = [
            "program_title", 
            "mode",
            "activation_date",
            "assigned_user", 
            "schedule_array",
            "sessions"
        ]

    def validate(self, data):
        """
        Validate the training program data.
        Checks:
        - Program title min length
        - Existing mode (model supports only pre-defined PROGRAM_MODES)
        - Assigned user exists
        - Activation date not empty and iso format
        - Schedule array exists with temp ids
        - At least one session exists and has at least one exercsie
        - Session title exists
        - Muscle group is custom or existing
        - Exercise is custom or existing
        - Sequence exists
        - Reps exists
        - Sets exists
        """
        instance = (self, "instance", None)

        if "program_title" in data:
            if len(data["program_title"]) < 3:
                raise serializers.ValidationError(
                    {"program_title": "Title must be at least 3 characters long."}
                )

        if "mode" in data:
            valid_modes = [entry[0] for entry in TrainingProgram.PROGRAM_MODES]
            if data["mode"] not in valid_modes:
                raise serializers.ValidationError(
                    {"mode": "Invalid mode."}
                )
        
        if "assigned_user" in data:
            if not User.objects.filter(username=data["assigned_user"]).exists():    
                raise serializers.ValidationError(
                    {"assigned_user": "User doesn't exist."}
                )
        
        if "activation_date" in data:
            date_str = data["activation_date"]
            try:
                datetime.fromisoformat(date_str)
            except ValueError:
                raise serializers.ValidationError(
                    {"activation_date": "Date must be in ISO format (YYYY-MM-DD)."}
                )
            
        if "schedule_array" in data:
            if len(data["schedule_array"]) < 1:
                raise serializers.ValidationError(
                    {"schedule_array": "Schedule cannot be empty."}
                )
            
        
        