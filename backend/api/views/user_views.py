from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from api.controllers.user_controller import UserController


@api_view(["POST"])
def create_user(request):
    user_controller = UserController()
    return user_controller.create(request)

@api_view(["POST"])
def login_user(request):
    user_controller = UserController()
    return user_controller.login(request)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user_controller = UserController()
    return user_controller.get_profile_or_settings(request)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user_controller = UserController()
    return user_controller.update(request)

@api_view(["POST"])
def refresh_token(request):
    user_controller = UserController()
    return user_controller.refresh_token(request)

@api_view(["POST"])
def blacklist_token(request):
    user_controller = UserController()
    return user_controller.blacklist_token(request)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_settings(request):
    user_controller = UserController()
    return user_controller.get_profile_or_settings(request)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_settings(request):
    user_controller = UserController()
    return user_controller.update(request)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_password(request):
    user_controller = UserController()
    return user_controller.update_password(request)
