from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from ..controllers.user_controller import UserController


@api_view(["POST"])
def create_user(request):
    user_controller = UserController()
    return user_controller.create(request)


@api_view(["POST"])
def login_user(request):
    user_controller = UserController()
    return user_controller.login(request)


@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def your_profile(request):
    user_controller = UserController()
    return user_controller.handle_profile(request)


@api_view(["POST"])
def refresh_token(request):
    user_controller = UserController()
    return user_controller.refresh_token(request)


@api_view(["POST"])
def blacklist_token(request):
    user_controller = UserController()
    return user_controller.blacklist_token(request)


@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def profile_settings(request):
    user_controller = UserController()
    return user_controller.handle_settings(request)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_password(request):
    user_controller = UserController()
    return user_controller.update_password(request)
