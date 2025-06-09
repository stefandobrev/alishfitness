from django.urls import path, include
from rest_framework.routers import DefaultRouter

from session_logging.views import (
    ActiveProgramView
)

urlpatterns = [
    path("active-training-program/", ActiveProgramView.as_view(), name="active-training-program"),
]