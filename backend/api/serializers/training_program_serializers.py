from rest_framework import serializers

from api.models import User, TrainingProgram, TrainingSession, ProgramExercise

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
    assigned_user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

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
        - Assigned users exists
        - Activation date not empty 
        """
        title = data.get("program_title")
        mode = data.get("mode")
        activation_date = data.get("activation_date")
        assigned_user = data.get("assigned_user")

        if title and len(title) < 3:
            raise serializers.ValidationError({"program_title": "Title must be at least 3 characters long."})

        valid_modes = [entry[0] for entry in TrainingProgram.PROGRAM_MODES]
        if mode not in valid_modes:
            raise serializers.ValidationError({"mode": "Invalid mode."})

        if mode == "create":
            if not assigned_user:
                raise serializers.ValidationError({"assigned_user": "Assigned user is missing."})
            if not activation_date:
                raise serializers.ValidationError({"activation_date": "Activation date is missing."})

        if mode == "template" and activation_date:
            raise serializers.ValidationError({"activation_date": "Templates should not have activation date."})

        return data
    
    def create(self, validated_data):
        """Create a program with validated data including sessions and exercises within."""
        sessions_data = validated_data.pop("sessions", [])
        assigned_user = validated_data.pop("assigned_user")
    
        # Extract the user ID and use it directly
        user_id = assigned_user.id
        program = TrainingProgram.objects.create(assigned_user_id=user_id, **validated_data)
        program.save()

        temp_id_mapping = {} ## Create a mapping track to assign correlation between ids and temp_ids

        for session_data in sessions_data:
            temp_id = session_data.pop("temp_id", None)
            exercises_data = session_data.pop("exercises", [])
            
            session = TrainingSession.objects.create(program=program, **session_data)

            temp_id_mapping[temp_id] = session.id

            for exercise_data in exercises_data: 
                ProgramExercise.objects.create(session=session, **exercise_data)

        return program, temp_id_mapping


    def update(self, instance, validated_date):
        """Update a program with validated data including sessions and exercises within."""
        pass