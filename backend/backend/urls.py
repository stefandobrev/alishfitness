"""
URL configuration for backend project.
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/users/", include("user.urls")),
    path("api/exercises/", include("exercise.urls")),
    path("api/training-programs/", include("training_program.urls")),
    path("api/session-logs/", include("session_logging.urls"))
]
