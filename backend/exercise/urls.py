from django.urls import path

from exercise.views import (
    MuscleGroupView,
    ExerciseTitleView,
    ExerciseViewSet,
    ExerciseBySlugView
)

urlpatterns = [
    path("muscle-groups/", MuscleGroupView.as_view(), name="exercises-muscle-groups"),
    path("exercise-titles/", ExerciseTitleView.as_view(), name="exercise-titles"),
    path("exercise-detail/<int:id>/", ExerciseViewSet.as_view({"get": "retrieve"}), name="exercise-detail"),
    path("create-exercise/", ExerciseViewSet.as_view({"post": "create"}), name="create-exercise"),
    path("update-exercise/<int:pk>/", ExerciseViewSet.as_view({"put": "update"}), name="update-exercise"),
    path("delete-exercise/<int:pk>/", ExerciseViewSet.as_view({"delete": "destroy"}), name="delete-exercise"),
    path("filter/", ExerciseViewSet.as_view({"post": "filtered"}), name="filter-exercises"),
    path("<str:muscle_slug>/<str:exercise_slug>/", ExerciseBySlugView.as_view(), name="exercises-detail-slug"),
]