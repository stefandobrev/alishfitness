from rest_framework import serializers

from user.models import User
from user.serializers import UserSummarySerializer
from training_program.models import TrainingProgram, TrainingSession, TrainingExercise

class TrainingExerciseSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = TrainingExercise
        fields = [
            "id",
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
    id = serializers.IntegerField(required=False)
    temp_id = serializers.CharField(write_only=True, required=False)
    exercises = TrainingExerciseSerializer(many=True)

    class Meta:
        model = TrainingSession
        fields = ["id", "session_title", "temp_id",  "exercises"]

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
    assigned_user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        allow_null=True,
        required=False
    )

    class Meta:
        model = TrainingProgram
        fields = [
            "program_title", 
            "mode",
            "activation_date",
            "assigned_user", 
            "sessions",
            "status"
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
        
        if title is not None and len(title) < 3:
            raise serializers.ValidationError({"program_title": "Title must be at least 3 characters long."})

        if mode is not None:
            valid_modes = [entry[0] for entry in TrainingProgram.PROGRAM_MODES]
            if mode not in valid_modes:
                raise serializers.ValidationError({"mode": "Invalid mode."})

        if mode == "assigned":
            if not assigned_user:
                raise serializers.ValidationError({"assigned_user": "Assigned user is missing."})

        if mode == "template" and activation_date:
            raise serializers.ValidationError({"activation_date": "Templates should not have activation date."})

        return data
    
    def create(self, validated_data):
        """Create a program with validated data including sessions and exercises within."""
        sessions_data = validated_data.pop("sessions", [])
        assigned_user = validated_data.pop("assigned_user")
    
        # Extract the user ID and use it directly
        user_id = assigned_user.id if assigned_user else None
        program = TrainingProgram.objects.create(assigned_user_id=user_id, **validated_data)
        program.save()

        temp_id_array= [] # Create a mapping track to assign correlation between ids and temp_ids

        for session_data in sessions_data:
            temp_id = session_data.pop("temp_id", None)
            exercises_data = session_data.pop("exercises", [])
            
            session = TrainingSession.objects.create(program=program, **session_data)

            temp_id_array.append({
                "temp_id": temp_id,
                "session_id": session.id
            })

            for exercise_data in exercises_data: 
                TrainingExercise.objects.create(session=session, **exercise_data)

        return program, temp_id_array


    def update(self, instance, validated_data):
        """Update a program with validated data including sessions and exercises within."""
        print("Val data:", validated_data)
        sessions_data = validated_data.pop("sessions", None)
        assigned_user = validated_data.pop("assigned_user", None)

        # Update user
        if assigned_user:
            instance.assigned_user = assigned_user
        
        # Update date, program title
        for attr, value in  validated_data.items():
            setattr(instance, attr, value)

        temp_id_array = []

        if sessions_data:
            for session_data in sessions_data:
                session_id = session_data.get("id", None)
                temp_id = session_data.pop("temp_id", None)
                exercises_data = session_data.pop("exercises", None)

                # Update existing session
                session = None
                if session_id:
                    session = TrainingSession.objects.get(id=session_id, program=instance)
                    for key, val in session_data.items():
                        if key != "id":
                            setattr(session, key, val)
                    session.save()
                else:
                    session = TrainingSession.objects.create(program=instance, **session_data)

                    if temp_id is not None:
                        temp_id_array.append({
                            "temp_id": temp_id,
                            "session_id": session.id
                        })
                
                if exercises_data:
                    for exercise_data in exercises_data:
                        exercise_id = exercise_data.get("id", None)

                        if exercise_id:
                            exercise = TrainingExercise.objects.get(id=exercise_id, session=session)
                            for key, val in exercise_data.items():
                                if key != "id":
                                    setattr(exercise, key, val)
                            exercise.save()
                        else:
                            TrainingExercise.objects.create(session=session, **exercise_data)
                         
        instance.save()

        return instance, temp_id_array


class TrainingExerciseDetailSerializer(serializers.ModelSerializer):
    exercise_title = serializers.CharField(source="exercise.title", read_only=True)
    exercise_slug = serializers.CharField(source="exercise.slug", read_only=True)
    muscle_group_name = serializers.CharField(source="muscle_group.name", read_only=True)
    muscle_group_slug = serializers.CharField(source="muscle_group.slug", read_only=True)

    class Meta:
        model = TrainingExercise
        fields = [
            "id",
            "sequence",
            "sets",
            "reps",
            "is_custom_muscle_group",
            "custom_exercise_title",
            "exercise_title",
            "exercise_slug",
            "muscle_group_name",
            "muscle_group_slug",
        ]

class TrainingSessionDetailSerializer(serializers.ModelSerializer):
    exercises = TrainingExerciseDetailSerializer(many=True, read_only=True)

    class Meta:
        model = TrainingSession
        fields = [
            "id",
            "session_title",
            "exercises",
        ]

class TrainingProgramDetailSerializer(serializers.ModelSerializer):
    sessions = TrainingSessionDetailSerializer(many=True, read_only=True)
    assigned_user = UserSummarySerializer(read_only=True)

    class Meta:
        model = TrainingProgram
        fields = [
            "id",
            "program_title",
            "mode",
            "status",
            "assigned_user",
            "activation_date",
            "schedule_data",
            "sessions",
        ]
