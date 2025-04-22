from rest_framework import serializers
from datetime import date

from api.models import TrainingProgram, TrainingSession, ProgramExercise

class ProgramExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramExercise
        fields = [
            "muscle_group",
            "is_custom_muscle_group", 
            "exercise",
            "custom_exercise_title",
            "sequence",
            "reps",
            "sets",
        ]

    def validate(self, data):
        """Validating reps and sequnce. Sets are handled by controller."""
        for field in ["sequence", "reps"]:
            if field in data:
                field_value = data[field]
                if field_value is None:
                    raise serializers.ValidationError(
                        ({f"{field}": f"{field} is required."})
                    )

        return data
        
class TrainingSessionSerializer(serializers.ModelSerializer):
    temp_id = serializers.CharField(write_only=True, required=False)
    exercises = ProgramExerciseSerializer(many=True)

    class Meta:
        model = TrainingSession
        fields = ["session_title", "temp_id", "exercises"]

    def validate(self, data):
        """Validating reps and sequnce. Sets are handled by controller."""
        for field in ["session_title", "temp_id"]:
            if field in data:
                field_value = data[field]
                if field_value is None:
                    raise serializers.ValidationError(
                        ({f"{field}": f"{field} is required."})
                    )

        return data

class TrainingProgramSerializer(serializers.ModelSerializer):
    """
    Serializer for Training Program and nested Training Sessions and
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
            "sessions"
        ]

    def validate(self, data):
        """
        Validate the training program data.
        Checks:
        - Program title min length
        - Existing mode (model supports only pre-defined PROGRAM_MODES)
        - Activation date not empty and iso format
        """

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
        
        if data.get("mode") == "create":
            if "activation_date" not in data:
                raise serializers.ValidationError(
                            {"activation_date": "Activation date is missing."}
                )
            
            date_str=data["activation_date"]
            if not isinstance(date_str, date):
                raise serializers.ValidationError(
                    {"activation_date": "Date must be in ISO format (YYYY-MM-DD)."}
                )
                        
        return data
    
    def create(self, validated_data):
        """Create a program with validated data including sessions and exercises within."""
        sessions_data = validated_data.pop("sessions", [])

        program = TrainingProgram.objects.create(**validated_data)
        program.save()

        print("Validated data:", validated_data)
        for session_data in sessions_data:
            session_data.pop("temp_id", None)
            exercises_data = session_data.pop("exercises", [])
            print("Session data:", session_data)
            
            session = TrainingSession.objects.create(program=program, **session_data)
  
            for exercise_data in exercises_data: 
                print("Exercise data:", exercise_data)             
                ProgramExercise.objects.create(session=session, **exercise_data)

        return program


    def update(self, instance, validated_date):
        """Update a program with validated data including sessions and exercises within."""
        pass