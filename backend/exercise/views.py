from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.db.models import Q

from exercise.models import Exercise, MuscleGroup
from exercise.serializers import ExerciseSerializer, MuscleGroupTitleSerializer, ExerciseDetailSerializer

class MuscleGroupView(APIView):
    """View for getting all muscle groups."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Return all muscle groups from the DB."""
        muscle_groups = MuscleGroup.objects.all().order_by("name").only("name")
        serializer = MuscleGroupTitleSerializer(muscle_groups, many=True)
        return Response(serializer.data)


class ExerciseTitleView(APIView):
    """View for getting exercise titles with filtering."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Creates and returns a filtered list of exercise titles."""
        search_query = request.data.get("search_query", "")
        sort = request.data.get("sort", None)
        muscle_groups = request.data.get("muscle_groups", [])
        items_per_page = request.data.get("items_per_page")
        offset = request.data.get("offset", 0)
        
        if not items_per_page:
            return Response({"items_per_page": "Items per page is required."}, status=400)

        query = Exercise.objects.all()

        if muscle_groups:
            query = query.filter(
                primary_group__slug__in=muscle_groups
            )

        if search_query:
            query = query.filter(Q(title__iexact=search_query) | Q(title__icontains=search_query))

        if sort == "created_at":
            query = query.order_by("-created_at")
        elif sort == "updated_at":
            query = query.order_by("-updated_at")
        else:
            query = query.order_by("title") 

        exercise_titles = query[offset : offset + items_per_page].values("id", "title", "created_at", "updated_at")
        
        return Response(list(exercise_titles))


class ExerciseViewSet(viewsets.ModelViewSet):
    """ViewSet for exercise CRUD operations."""
    serializer_class = ExerciseSerializer

    def get_queryset(self):
        return Exercise.objects.all()
    
    def get_permissions(self):
        """Set appropriate permissions based on action."""
        if self.action in ["create", "update", "destroy"]:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def retrieve(self, request, pk):
        """Return an exercise's data from the DB."""
        try: 
            exercise = Exercise.objects.prefetch_related(
                "secondary_groups", "steps", "mistakes"
                ).select_related("primary_group").get(id=pk)
            
            return Response(ExerciseDetailSerializer(exercise).data)
        except Exercise.DoesNotExist:
            return Response({"exercise": "Exercise not found."}, status=status.HTTP_404_NOT_FOUND)
    
    def create(self, request):
        """Create a new exercise model with steps and mistakes."""
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Exercise created successfully!"}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        """Update an existing exercise with steps and mistakes."""
        partial = kwargs.pop("partial", False)
        exercise = self.get_object()
        serializer = self.get_serializer(exercise, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Exercise updated successfully!"}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        """Delete an existing exercise model."""
        exercise = get_object_or_404(Exercise, id=pk)
        exercise.delete()
        return Response({"message": "Exercise deleted successfully!"})
    
    @action(detail=False, methods=["post"])
    def filtered(self, request):
        """Return exercises filtered by muscle group and search query."""
        muscle_group_id = request.data.get("muscle_group_id")
        search_query = request.data.get("search_query", "")
        items_per_page = request.data.get("items_per_page")
        offset = request.data.get("offset", 0)
        
        if not muscle_group_id:
            return Response({"muscle_group_id": "Muscle group ID is required."}, status=400)
        
        if not items_per_page:
            return Response({"items_per_page": "Items per page is required."}, status=400)
        
        muscle_group = MuscleGroup.objects.filter(slug=muscle_group_id).first()

        if not muscle_group: 
            return Response({"muscle_group_id": "Invalid muscle group."}, status=status.HTTP_404_NOT_FOUND)

        query = Exercise.objects.filter(primary_group__slug=muscle_group_id)

        if search_query:
            query = query.filter(Q(title__iexact=search_query) | Q(title__icontains=search_query))

        exercises = query[offset : offset + items_per_page].values("id", "title", "gif_link_front")

        return Response({
            "name": muscle_group.name,
            "exercises": list(exercises),
            "total_count": query.count() 
        })


class ExerciseBySlugView(APIView):
    """View for getting exercise details by slug."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, muscle_slug, exercise_slug):
        """Return exercise detail by slug."""
        muscle_group = MuscleGroup.objects.filter(slug=muscle_slug).first()

        if not muscle_group: 
            return Response({"muscle_group_slug": "Invalid muscle group."}, status=status.HTTP_404_NOT_FOUND)

        try: 
            exercise = Exercise.objects.prefetch_related(
                "secondary_groups", "steps", "mistakes"
                ).select_related("primary_group").get(slug=exercise_slug, primary_group=muscle_group)
            
            return Response(ExerciseDetailSerializer(exercise).data)
        except Exercise.DoesNotExist:
            return Response({"exercise_slug": "Invalid exercise."}, status=status.HTTP_404_NOT_FOUND)