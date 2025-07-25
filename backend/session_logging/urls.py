from django.urls import path, include
from rest_framework.routers import DefaultRouter

from session_logging.views import (
    ActiveProgramView,
    TrainingSessionView,
    SessionLogsViewSet,
    SetLogsView,ViewTrendsView
)

router = DefaultRouter()
router.register(r"", SessionLogsViewSet, basename="session-logs")

urlpatterns = [
    path("active-training-program/", ActiveProgramView.as_view(), name="active-training-program"),
    path("session-data-view/<int:id>/", TrainingSessionView.as_view(), name="session-data-view"),
    path("view-trends/<int:id>/", ViewTrendsView.as_view(), name="view-trends"),
    path("<int:id>/set-logs/", SetLogsView.as_view(), name="set-logs"),
    path("", include(router.urls))
]