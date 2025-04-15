from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated

from api.controllers.training_program_controller import TrainingProgramController

@api_view(["GET"])
@permission_classes([IsAdminUser])
def training_setup_data(request):
    training_program_controller = TrainingProgramController()
    return training_program_controller.get_muscle_groups_and_exercises(request)


@api_view(["POST"])
@permission_classes([IsAdminUser])
def create_program(request):
    training_program_controller = TrainingProgramController()
    return training_program_controller.create(request)