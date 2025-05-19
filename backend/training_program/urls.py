from django.urls import path, include
from rest_framework.routers import DefaultRouter

from training_program.views import (
    TrainingSetupDataView,
    FilterDataView,
    HasActiveProgramView,
    FilteredTrainingProgramsView, 
    TrainingProgramViewSet
)

router = DefaultRouter()
router.register(r"", TrainingProgramViewSet, basename="training-program" )

urlpatterns = [
    path("training-setup-data/", TrainingSetupDataView.as_view(), name="training-setup-data"),
    path("filter-data/", FilterDataView.as_view(), name="training-programs-filter-data"),
    path("has-active/", HasActiveProgramView.as_view(), name="has-active-program"),
    path("filtered/", FilteredTrainingProgramsView.as_view(), name="filtered-training-programs"),
    path("", include(router.urls)),
]