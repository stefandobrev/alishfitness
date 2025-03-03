from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework.response import Response
from ..serializers.user_serializers import (
    UserSerializer,
    LoginSerializer,
    UserSettingsSerializer,
    UpdatePasswordSerializer,
    TokenRefreshSerializer,
)


class UserController:
    """Controller handling all user-related operations."""

    def create(self, request):
        """
        Create a new user account.

        Args:
            request: HTTP request containing user data

        Returns:
            Response with user data or error messages
        """
        serializer = UserSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        # clear the Response on production
        return Response(
            {
                "message": "User created successfully!",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "is_admin": user.is_staff,
                },
            },
            status=status.HTTP_201_CREATED,
        )

    def login(self, request):
        """
        Authenticate user and generate tokens.

        Args:
            request: HTTP request containing login credentials

        Returns:
            Response with tokens or error message
        """
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.validated_data["user"]
        tokens = self._generate_tokens(user)

        return Response(
            {
                "message": "Login successful", 
                "username": user.username,
                "is_admin": user.is_staff, 
                **tokens
            },
            status=status.HTTP_200_OK,
        )

    def refresh_token(self, request):
        """Refresh access token using refresh token."""
        serializer = TokenRefreshSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        token = serializer.validated_data["refresh"]
        tokens = {"access": str(token.access_token), "refresh": str(token)}

        return Response(
            {"message": "Token refreshed successfully", **tokens},
            status=status.HTTP_200_OK,
        )

    def blacklist_token(self, request):
        """Blacklist a refresh token."""
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"error": "Refresh token is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            refresh = RefreshToken(refresh_token)
            refresh.blacklist()
            return Response(
                {"message": "Token blacklisted successfully"}, status=status.HTTP_200_OK
            )
        except TokenError as e:
            return Response(
                {"error": f"Invalid or expired refresh token: {str(e)}"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

    def handle_profile(self, request):
        """
        Handle profile operations (get/update).

        Args:
            request: HTTP request

        Returns:
            Response with profile data or error message
        """

        if request.method == "GET":
            return self._get_profile(request.user)
        elif request.method == "PUT":
            return self._update_profile(request.user, request.data)

    def _generate_tokens(self, user):
        """Generate access and refresh tokens for user."""
        refresh = RefreshToken.for_user(user)
        return {"access": str(refresh.access_token), "refresh": str(refresh)}

    def _get_profile(self, user):
        """Get user profile data."""
        return Response(
            {
                "first_name": user.first_name,
                "last_name": user.last_name,
            }
        )

    def _update_profile(self, user, data):
        """Update user profile data."""
        user.first_name = data.get("first_name", user.first_name)
        user.last_name = data.get("last_name", user.last_name)
        user.save()
        return Response({"first_name": user.first_name, "last_name": user.last_name})

    def handle_settings(self, request):
        """
        Handle settings operations (get/update).

        Args:
            request: HTTP request

        Returns:
            Response with settings data or error message
        """
        if request.method == "GET":
            return self._get_settings(request.user)
        elif request.method == "PUT":
            return self._update_settings(request.user, request.data)

    def _get_settings(self, user):
        """Get user settings data."""
        return Response(
            {
                "email": user.email,
                "username": user.username,
            }
        )

    def _update_settings(self, user, data):
        """Update user settings data."""
        serializer = UserSettingsSerializer(user, data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        return Response({"username": user.username, "email": user.email})

    def update_password(self, request):
        """Update the user"s password."""
        serializer = UpdatePasswordSerializer(
            data=request.data, context={"request": request}
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        refresh_token = request.data.get("refresh")
        if refresh_token:
            try:
                refresh = RefreshToken(refresh_token)
                refresh.blacklist()
            except Exception as e:
                print(f"Failed to blacklist token: {str(e)}")

        serializer.save()
        return Response(
            {
                "message": "Password updated successfully. Please log in again.",
                "requireReauth": True,
            },
            status=status.HTTP_200_OK,
        )
