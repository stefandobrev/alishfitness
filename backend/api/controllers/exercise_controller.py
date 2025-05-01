from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q

from api.models import Exercise, MuscleGroup

from api.serializers.exercise_serializers import ExerciseSerializer
from api.serializers.common_serializers import MuscleGroupTitleSerializer


class ExerciseController:
    """Controller handling all exercise-related operations."""

    def get_muscle_groups(self, request):
        """Return a response containing all muscle groups from the DB."""
        muscle_groups = MuscleGroup.objects.all().order_by("name").only("name")
        serializer = MuscleGroupTitleSerializer(muscle_groups, many=True)
        return Response(serializer.data)
    
    def get_exercise_titles(self, request):
        """
        Creates and returns a filtered list of exercise titles.
        """
        search_query = request.data.get("search_query", "")
        offset = request.data.get("offset", 0)
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
            return Response({"exercise": "Exercise not found."}, status=status.HTTP_404_NOT_FOUND)
        
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
        Create a new exercise model with steps and mistakes.

        Args:
            request: HTTP request containing data.

        Returns:
            Response with success message or error messages.
        """
        serializer = ExerciseSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Exercise created successfully!"}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, id):
        """Update an existing exercise with steps and mistakes."""
        exercise = get_object_or_404(Exercise, id=id)
        
        serializer = ExerciseSerializer(exercise, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Exercise updated successfully!"})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request, id):
        """ Delete an existing exercise model."""
        exercise = get_object_or_404(Exercise, id=id)
        exercise.delete()
        return Response({"message": "Exercise deleted successfully!"})

    def get_filtered_exercises(self, request):
        """
        Return a response containing all exercises related to the muscle 
        group from the DB.
        """
        muscle_group_id = request.data.get("muscle_group_id")
        offset = request.data.get("offset", 0)
        search_query = request.data.get("search_query", "")

        if not muscle_group_id:
            return Response({"muscle_group_id": "Muscle group ID is required."}, status=400)
        
        muscle_group = MuscleGroup.objects.filter(slug=muscle_group_id).first()

        if not muscle_group: 
            return Response({"muscle_group_id": "Invalid muscle group."}, status=status.HTTP_404_NOT_FOUND)

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
            return Response({"muscle_group_slug": "Invalid muscle group."}, status=status.HTTP_404_NOT_FOUND)

        try: 
            exercise = Exercise.objects.prefetch_related(
                "secondary_groups", "steps", "mistakes"
                ).select_related("primary_group").get(slug=exercise_slug, primary_group=muscle_group)
            
            return Response(self._get_exercise_data(exercise))
        except Exercise.DoesNotExist:
            return Response({"exercise_slug": "Invalid exercise."}, status=status.HTTP_404_NOT_FOUND)
