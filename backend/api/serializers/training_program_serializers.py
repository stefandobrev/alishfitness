from rest_framework import serializers
from datetime import datetime

from api.models import User, MuscleGroup, Exercise, TrainingProgram, TrainingSession, ProgramExercise

class ProgramExerciseSerializer(serializers.ModelSerializer):
    exercise_input = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = ProgramExercise
        fields = ["muscle_group", "is_custom_muscle_group", "exercise", "custom_exercise_title", "sequence", "reps", "sets"]

class TrainingSessionSerializer(serializers.ModelSerializer):
    temp_id = serializers.CharField(write_only=True, required=False)
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
            if "assigned_user" not in data:
                raise serializers.ValidationError(
                        {"assigned_user": "User is missing."}
                    )
            
            if not User.objects.filter(username=data["assigned_user"]).exists():    
                raise serializers.ValidationError(
                    {"assigned_user": "User doesn't exist."}
                )
        
            if "activation_date" not in data:
                raise serializers.ValidationError(
                            {"activation_date": "Activation date is missing."}
                )
            
            date_str=data["activation_date"]
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
            
        if "sessions" in data:
            if not data.get("sessions"):
                raise serializers.ValidationError({"sessions": "Sessions cannot be empty."})

            for session in data["sessions"]:
                if not session.get("session_title"):
                    raise serializers.ValidationError({"session_title": "Session title cannot be empty."})

                if not session.get("temp_id"):
                    raise serializers.ValidationError({"temp_id": "Temp Id is missing."})

                exercises = session.get("exercises", [])
                if not exercises:
                    raise serializers.ValidationError({"exercises": "Exercises cannot be empty."})

                for exercise in exercises:
                    if not exercise.get("sequence"):
                        raise serializers.ValidationError({"sequence": "Sequence is missing."})

                    if not exercise.get("muscle_group"):
                        raise serializers.ValidationError({"muscle_group": "Muscle group is missing."})

                    if not MuscleGroup.objects.filter(slug=exercise["muscle_group"]).exists():
                        if exercise["muscle_group"] != "custom":
                            raise serializers.ValidationError({
                                "muscle_group": "Muscle group invalid."
                            })

                    if not exercise.get("exercise_input"):
                        raise serializers.ValidationError({"exercise_input": "Exercise is missing."})

                    if not Exercise.objects.filter(slug=exercise["exercise_input"]).exists():
                        if exercise["exercise_input"] != "custom":
                            raise serializers.ValidationError({
                                "exercise_input": "Exercise invalid."
                            })

                    if not exercise.get("reps"):
                        raise serializers.ValidationError({"reps": "Reps is missing."})

                    if not exercise.get("sets"):
                        raise serializers.ValidationError({"sets": "Sets is missing."})

                    if not isinstance(exercise.get("sets"), int) :
                        raise serializers.ValidationError({"sets": "Invalid value for sets. Must be a number."})
                        
        return data
    
    def create(self, validated_date):
        """Create a program with validated data including sessions and exercises within."""
        sessions_data = validated_date.pop("sessions", [])
        schedule_array = validated_date.pop("schedule_array", [])

        program = TrainingProgram.objects.create(**validated_date)
        program.schedule_array = schedule_array
        program.save()

        print("\n\n============= SCHEDULE ARRAY =============")
        print(program.schedule_array)
        print("==========================================\n\n")

        for session_data in sessions_data:
            session_data.pop("temp_id", None)
            exercises_data = session_data.pop("exercises", [])
            session = TrainingSession.objects.create(program=program, **session_data)

            for exercise_data in exercises_data:
                exercise_input = exercise_data.pop("exercise_input", None)

                if exercise_data["muscle_group"] == "custom":
                    custom_muscle_group = exercise_data.pop("muscle_group")
                    exercise_data["muscle_group"] = None
                    exercise_data["exercise"] = None
                    exercise_data["custom_muscle_group"] = custom_muscle_group
                    exercise_data["custom_exercise"] = exercise_input
                else:
                    muscle_group = exercise_data.pop("muscle_group")
                    exercise_data["muscle_group"] = MuscleGroup.objects.get(slug=muscle_group)
                    exercise_data["exercise"] = Exercise.objects.get(slug=exercise_input)
                    exercise_data["custom_muscle_group"] = ""
                    exercise_data["custom_exercise"] = ""
                
                ProgramExercise.objects.create(session=session, **exercise_data)

        return program


    def update(self, instance, validated_date):
        """Update a program with validated data including sessions and exercises within."""
        pass