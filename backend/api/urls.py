from django.urls import path

from api.views.exercise_views import (
    MuscleGroupView,
    ExerciseTitleView,
    ExerciseDetailView,
    ExerciseViewSet,
    ExerciseBySlugView
)
from api.views.user_views import (
    CreateUserView,
    LoginView,
    ProfileView,
    SettingsView,
    TokenView,
    TokenBlacklistView,
    PasswordUpdateView
)

from api.views.training_program_views import (
    TrainingSetupDataView,
    FilterDataView,
    HasActiveProgramView,
    TrainingProgramsView, 
    CreateProgramView
)


urlpatterns = [
    # user paths
    path("user/create-user/", CreateUserView.as_view(), name="create-user"),
    path("user/login/", LoginView.as_view(), name="login-user"),
    path("user/my-profile/", ProfileView.as_view(), name="get-my-profile"),
    path("user/my-profile/update/", ProfileView.as_view(), name="update-my-profile"),
    path("user/settings/", SettingsView.as_view(), name="get-settings"),
    path("user/settings/update/", SettingsView.as_view(), name="update-settings"),
    path("user/refresh-token/", TokenView.as_view(), name="refresh-token"),
    path("user/blacklist-token/", TokenBlacklistView.as_view(), name="blacklist-token"),
    path("user/settings/password/", PasswordUpdateView.as_view(), name="update-password"),

    # exercise paths
    path("exercises/muscle-groups/", MuscleGroupView.as_view(), name="exercises-muscle-groups"),
    path("exercises/exercise-titles/", ExerciseTitleView.as_view(), name="exercise-titles"),
    path("exercises/exercise-detail/<int:id>/", ExerciseDetailView.as_view(), name="exercise-detail"),
    path("exercises/create-exercise/", ExerciseViewSet.as_view({'post': 'create'}), name="create-exercise"),
    path("exercises/update-exercise/<int:pk>/", ExerciseViewSet.as_view({'put': 'update'}), name="update-exercise"),
    path("exercises/delete-exercise/<int:pk>/", ExerciseViewSet.as_view({'delete': 'destroy'}), name="delete-exercise"),
    path("exercises/filter/", ExerciseViewSet.as_view({'post': 'filtered'}), name="filter-exercises"),
    path("exercises/<str:muscle_slug>/<str:exercise_slug>/", ExerciseBySlugView.as_view(), name="exercises-detail-slug"),

    # training programs paths
    path("training-programs/training-setup-data/", TrainingSetupDataView.as_view(), name="training-setup-data"),
    path("training-programs/filter-data/", FilterDataView.as_view(), name="training-programs-filter-data"),
    path("training-programs/has-active/", HasActiveProgramView.as_view(), name="has-active-program"),
    path("training-programs/create-program/", CreateProgramView.as_view(), name="create-program"),
    path("training-programs/", TrainingProgramsView.as_view(), name="training-programs"),
]
