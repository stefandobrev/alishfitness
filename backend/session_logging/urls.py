from django.urls import path, include
from rest_framework.routers import DefaultRouter

from session_logging.views import (
    ActiveProgramView,
    TrainingSessionView,
    SessionLogsViewSet,
    SetLogsViewSet
)

router = DefaultRouter()
router.register(r"", SessionLogsViewSet, basename="session-logs")
router.register(r"set-logs", SetLogsViewSet, basename="set-logs")

urlpatterns = [
    path("active-training-program/", ActiveProgramView.as_view(), name="active-training-program"),
    path("session-data-view/<int:id>/", TrainingSessionView.as_view(), name="session-data-view"),
    path("", include(router.urls))
]