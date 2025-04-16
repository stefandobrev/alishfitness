from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework.response import Response

from api.serializers.user_serializers import (
    UserSerializer,
    LoginSerializer,
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
            Response with messages.
        """
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        return Response(
            {
                "message": "User created successfully!",
                "user": {
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
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
            Response with tokens or error message.
        """
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)
        tokens = {"access": str(refresh.access_token), "refresh": str(refresh)}

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
        serializer.is_valid(raise_exception=True)

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

    def handle_profile_or_settings(self, request):
        """
        Handle profile/settings operations (get/update).

        Args:
            request: HTTP request

        Returns:
            Response with profile/settings data or error message
        """
        user = request.user
        
        if request.method == "GET":
            return Response({
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            })
        elif request.method == "PUT":
            serializer = UserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                user = serializer.save()
            
                return Response({
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                })
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update_password(self, request):
        """Update the user's password."""
        serializer = UpdatePasswordSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

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