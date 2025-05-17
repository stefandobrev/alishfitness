from django.urls import path, include
from rest_framework.routers import DefaultRouter

from exercise.views import (
    MuscleGroupView,
    ExerciseTitleView,
    ExerciseViewSet,
    ExerciseBySlugView
)

router = DefaultRouter()
router.register(r"", ExerciseViewSet, basename="exercise")

urlpatterns = [
    path("muscle-groups/", MuscleGroupView.as_view(), name="exercises-muscle-groups"),
    path("exercise-titles/", ExerciseTitleView.as_view(), name="exercise-titles"),
    path("filtered/", ExerciseViewSet.as_view({"post": "filtered"}), name="filtered-exercises"),
    path("", include(router.urls)),
    path("<str:muscle_slug>/<str:exercise_slug>/", ExerciseBySlugView.as_view(), name="exercises-detail-slug"),
]