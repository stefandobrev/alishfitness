from django.urls import path
from .views import user_views, exercise_views, training_program_views


urlpatterns = [
    # user paths
    path("user/create-user/", user_views.create_user, name="create-user"),
    path("user/login/", user_views.login_user, name="login-user"),
    path("user/my-profile/", user_views.get_profile, name="get-my-profile"),
    path("user/my-profile/update/", user_views.update_profile, name="update-my-profile"),
    path("user/settings/", user_views.get_settings, name="get-settings"),
    path("user/settings/update/", user_views.update_settings, name="update-settings"),
    path("user/refresh-token/", user_views.refresh_token, name="refresh-token"),
    path("user/blacklist-token/", user_views.blacklist_token, name="blacklist-token"),
    path("user/settings/password/", user_views.update_password, name="update-password"),

    # exercise paths
    path("exercises/muscle-groups/", exercise_views.muscle_groups, name="exercises-muscle-groups"),
    path("exercises/exercise-titles/", exercise_views.exercise_titles, name="exercise-titles"),
    path("exercises/exercise-detail/<int:id>/", exercise_views.exercise_detail, name="exercise-detail"),
    path("exercises/create-exercise/", exercise_views.create_exercise, name="create-exercise"),
    path("exercises/update-exercise/<int:id>/", exercise_views.update_exercise, name="update-exercise"),
    path("exercises/delete-exercise/<int:id>/", exercise_views.delete_exercise, name="delete-exercise"),
    path("exercises/filter/", exercise_views.filter_exercises, name="filter-exercises"),
    path("exercises/<str:muscle_slug>/<str:exercise_slug>/", exercise_views.exercise_detail_slug, name="exercises-detail-slug"),

    # training programs paths
    path("training-programs/training-setup-data/", training_program_views.training_setup_data, name="training-setup-data"),
    path("training-programs/filter-data/", training_program_views.filter_data, name="training-programs-filter-data"),
    path("training-programs/create-program/", training_program_views.create_program, name="create-program"),
    path("training-programs/", training_program_views.training_programs, name="training-programs")
]
