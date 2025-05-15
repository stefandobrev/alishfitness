from django.urls import path

from training_program.views import (
    TrainingSetupDataView,
    FilterDataView,
    HasActiveProgramView,
    TrainingProgramsView, 
    CreateProgramView
)

urlpatterns = [
    path("training-setup-data/", TrainingSetupDataView.as_view(), name="training-setup-data"),
    path("filter-data/", FilterDataView.as_view(), name="training-programs-filter-data"),
    path("has-active/", HasActiveProgramView.as_view(), name="has-active-program"),
    path("create-program/", CreateProgramView.as_view(), name="create-program"),
    path("", TrainingProgramsView.as_view(), name="training-programs"),
]