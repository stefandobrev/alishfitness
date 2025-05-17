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
    path("", include(router.urls)),
    path("muscle-groups/", MuscleGroupView.as_view(), name="exercises-muscle-groups"),
    path("exercise-titles/", ExerciseTitleView.as_view(), name="exercise-titles"),
    # path("exercise-detail/<int:id>/", ExerciseViewSet.as_view({"get": "retrieve"}), name="exercise-detail"),
    # path("create-exercise/", ExerciseViewSet.as_view({"post": "create"}), name="create-exercise"),
    # path("update-exercise/<int:pk>/", ExerciseViewSet.as_view({"put": "update"}), name="update-exercise"),
    # path("delete-exercise/<int:pk>/", ExerciseViewSet.as_view({"delete": "destroy"}), name="delete-exercise"),
    path("filtered/", ExerciseViewSet.as_view({"post": "filtered"}), name="filtered-exercises"),
    path("<str:muscle_slug>/<str:exercise_slug>/", ExerciseBySlugView.as_view(), name="exercises-detail-slug"),
]