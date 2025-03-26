from django.urls import path
from .views import user_views, exercise_views


urlpatterns = [
    # user paths
    path("user/create-user/", user_views.create_user, name="create-user"),
    path("user/login/", user_views.login_user, name="login-user"),
    path("user/my-profile/", user_views.my_profile, name="my-profile"),
    path("user/settings/", user_views.profile_settings, name="settings"),
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
    path("exercises/exercises-group/", exercise_views.exercises_group, name="exercises-group"),
    path("exercises/<str:muscle_slug>/<str:exercise_slug>/", exercise_views.exercise_detail_slug, name="exercises-detail-slug"),

    # training programs paths
    path("training-programs/muscle-groups/", exercise_views.muscle_groups, name="training-muscle-groups"),
]
