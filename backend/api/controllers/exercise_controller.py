from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q

from ..models import Exercise, MuscleGroup, Step, Mistake
from ..serializers.common_serializers import MuscleGroupTitleSerializer


class ExerciseController:
    """Controller handling all exercise-related operations."""

    def get_muscle_groups(self, request):
        """Return a response containing all muscle groups from the DB."""
        muscle_groups = MuscleGroup.objects.all().order_by("name")
        serializer = MuscleGroupTitleSerializer(muscle_groups, many=True)
        return Response(serializer.data)
    
    def get_exercise_titles(self, request):
        """
        Creates and returns a filtered list of exercise titles.
        """
        offset = request.data.get("offset", 0)
        search_query = request.data.get("search_query", "")
        sort = request.data.get("sort", None)
        muscle_groups = request.data.get("muscle_groups", [])

        query = Exercise.objects.all()

        if muscle_groups:
            query = query.filter(
                primary_group__slug__in=muscle_groups
            )

        if search_query:
            query = query.filter(Q(title__iexact=search_query) |  Q(title__icontains=search_query))

        if sort == "created_at":
            query = query.order_by("-created_at")
        elif sort == "updated_at":
            query = query.order_by("-updated_at")
        else:
            query = query.order_by("title") 

        ITEMS_PER_PAGE = 10
        exercise_titles = query[offset : offset + ITEMS_PER_PAGE].values("id", "title", "created_at", "updated_at")
        
        return Response(list(exercise_titles))
    
    def get_exercise(self, request, id):
        """Return a response containing an exercise"s data from the DB."""
        try: 
            exercise = Exercise.objects.prefetch_related(
                "secondary_groups", "steps", "mistakes"
                ).select_related("primary_group").get(id=id)
            
            return Response(self._get_exercise_data(exercise))
        except Exercise.DoesNotExist:
            return Response({"error": "Exercise not found."}, status=status.HTTP_404_NOT_FOUND)
        
    def _get_exercise_data(self, exercise):
        return {
            "id": exercise.id,
            "title": exercise.title,
            "slug": exercise.slug,
            "primary_group": exercise.primary_group.slug,
            "secondary_groups": [group.slug for group in exercise.secondary_groups.all()],
            "gif_link_front": exercise.gif_link_front,
            "gif_link_side": exercise.gif_link_side,
            "video_link": exercise.video_link,
            "steps": [step.description for step in exercise.steps.all()],
            "mistakes": [mistake.description for mistake in exercise.mistakes.all()]
        }

        

    def create(self, request):
        """
        Create a new exercise model(optional: add secondary_groups, 
        steps and mistakes to it.)

        Args:
            request: HTTP request containing data.

        Returns:
            Response with exercise, steps and mistakes data or error messages.
        """
        exercise_data = {key: value for key, value in request.data.items() if key in ExerciseSerializer.Meta.fields }
        steps_data = request.data.get("steps", [])
        mistakes_data = request.data.get("mistakes", [])

        primary_group_name = exercise_data.get("primary_group")
        if primary_group_name:
            primary_group = MuscleGroup.objects.filter(slug=primary_group_name).first()
            if not primary_group:
                return Response({"primary_group": "Primary group not found."}, status=status.HTTP_400_BAD_REQUEST)
            exercise_data["primary_group"] = primary_group.id
        
        secondary_groups = []
        if "secondary_groups" in exercise_data:
            for group_name in exercise_data["secondary_groups"]:
                group = MuscleGroup.objects.filter(slug=group_name).first()
                if group:
                    secondary_groups.append(group.id)
            
            if primary_group and primary_group.id in secondary_groups:
                return Response(
                    {"secondary_groups": "You cannot select the same group as primary and secondary."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        exercise_data["secondary_groups"] = secondary_groups

        serializer = ExerciseSerializer(data=exercise_data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        exercise = serializer.save()

        for index, step_description in enumerate(steps_data, start=1):
            Step.objects.create(exercise=exercise, description=step_description, order=index)

        for mistake_description in mistakes_data:
            Mistake.objects.create(exercise=exercise, description=mistake_description)

        return Response({"message": "Exercise created successfully!"})

    def update(self, request, id):
        """ Update an existing exercise model (only provided fields)."""
        exercise = get_object_or_404(Exercise, id=id)

        exercise_data = {key: value for key, value in request.data.items() if key in ExerciseSerializer.Meta.fields}
        steps_data = request.data.get("steps")
        mistakes_data = request.data.get("mistakes")

        new_primary_group = None
        secondary_groups = []

        if "primary_group" in exercise_data:
            primary_group_name = exercise_data["primary_group"]
            new_primary_group = MuscleGroup.objects.filter(slug=primary_group_name).first()
            if not new_primary_group:
                return Response({"primary_group": "Primary group not found."}, status=status.HTTP_400_BAD_REQUEST)
            exercise_data["primary_group"] = new_primary_group.id

        if "secondary_groups" in exercise_data:
            for group_name in exercise_data["secondary_groups"]:
                group = MuscleGroup.objects.filter(slug=group_name).first()
                if group:
                    secondary_groups.append(group.id)

        if new_primary_group and new_primary_group.id in secondary_groups:
            return Response(
                {"secondary_groups": "You cannot select the same group as primary and secondary."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        elif not new_primary_group and exercise.primary_group.id in secondary_groups:
            return Response(
                {"secondary_groups": "You cannot select the same group as primary and secondary."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        exercise_data["secondary_groups"] = secondary_groups

        serializer = ExerciseSerializer(exercise, data=exercise_data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        exercise = serializer.save()

        if steps_data is not None:
            exercise.steps.all().delete()
            for index, step_description in enumerate(steps_data, start=1):
                Step.objects.create(exercise=exercise, description=step_description, order=index)
        
        if mistakes_data is not None:
            exercise.mistakes.all().delete()
            for mistake_description in mistakes_data:
                Mistake.objects.create(exercise=exercise, description=mistake_description)
        
        return Response({"message": "Exercise updated successfully!"})
    
    def delete(self, request, id):
        """ Delete an existing exercise model."""
        exercise = get_object_or_404(Exercise, id=id)
        exercise.delete()
        return Response({"message": "Exercise deleted successfully!"})

    def get_exercises_group(self, request):
        """
        Return a response containing all exercises related to the muscle 
        group from the DB.
        """
        muscle_group_id = request.data.get("muscle_group_id")
        offset = request.data.get("offset", 0)
        search_query = request.data.get("search_query", "")

        if not muscle_group_id:
            return Response({"error": "Muscle group ID is required."}, status=400)
        
        muscle_group = MuscleGroup.objects.filter(slug=muscle_group_id).first()

        if not muscle_group: 
            return Response({"error": "Invalid muscle group."}, status=status.HTTP_404_NOT_FOUND)

        query = Exercise.objects.filter(primary_group__slug=muscle_group_id)

        if search_query:
            query = query.filter(Q(title__iexact=search_query) |  Q(title__icontains=search_query))

        ITEMS_PER_PAGE = 6
        exercises = query[offset : offset + ITEMS_PER_PAGE].values("id", "title", "gif_link_front")

        return Response({
            "name": muscle_group.name,
            "exercises": list(exercises),
            "total_count": query.count() 
        })
    
    def get_exercise_by_slug(self, request, muscle_slug, exercise_slug):
        """
        Use existing get_exercise function to return exercise detail.
        Check if the exercise and the muscle group exists, otherwise return 404.
        """
        muscle_group = MuscleGroup.objects.filter(slug=muscle_slug).first()

        if not muscle_group: 
            return Response({"error": "Invalid muscle group."}, status=status.HTTP_404_NOT_FOUND)

        try: 
            exercise = Exercise.objects.prefetch_related(
                "secondary_groups", "steps", "mistakes"
                ).select_related("primary_group").get(slug=exercise_slug, primary_group=muscle_group)
            
            return Response(self._get_exercise_data(exercise))
        except Exercise.DoesNotExist:
            return Response({"error": "Invalid exercise."}, status=status.HTTP_404_NOT_FOUND)
