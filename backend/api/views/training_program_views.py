from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated

from api.controllers.training_program_controller import TrainingProgramController

@api_view(["GET"])
@permission_classes([IsAdminUser])
def training_setup_data(request):
    training_program_controller = TrainingProgramController()
    return training_program_controller.get_training_setup_data(request)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def filter_data(request):
    training_program_controller = TrainingProgramController()
    return training_program_controller.get_filter_data(request)

@api_view(["POST"])
@permission_classes([IsAdminUser])
def has_active_program(request):
    training_program_controller = TrainingProgramController()
    return training_program_controller.has_active_program(request)

@api_view(["POST"])
@permission_classes([IsAdminUser])
def create_program(request):
    training_program_controller = TrainingProgramController()
    return training_program_controller.create(request)


@api_view(["POST"])
@permission_classes([IsAdminUser])
def training_programs(request):
    training_program_controller = TrainingProgramController()
    return training_program_controller.get_training_programs(request)