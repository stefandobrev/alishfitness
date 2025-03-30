from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated

from api.controllers.training_program_controller import TrainingProgramController

@api_view(["GET"])
@permission_classes([IsAdminUser])
def muscle_groups_and_exercises(request):
    training_program_controller = TrainingProgramController()
    return training_program_controller.get_muscle_groups_and_exercises(request)