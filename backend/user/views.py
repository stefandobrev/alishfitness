from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

from user.serializers import (
    UserSerializer,
    LoginSerializer,
    UpdatePasswordSerializer,
    TokenRefreshSerializer,
)


class CreateUserView(APIView):
    """View for creating new user accounts."""
    permission_classes = [AllowAny]

    def post(self, request):
        """Create a new user account."""
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


class LoginView(APIView):
    """View for user authentication."""
    permission_classes = [AllowAny]

    def post(self, request):
        """Authenticate user and generate tokens."""
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


class ProfileView(APIView):
    """View for managing user profile."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get user profile information."""
        user = request.user

        return Response({
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
        })

    def put(self, request):
        """Update user profile."""
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            user = serializer.save()
        
            return Response({
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            }, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SettingsView(APIView):
    """View for managing user settings."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get user settings information."""
        user = request.user

        return Response({
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
        })

    def put(self, request):
        """Update user settings."""
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            user = serializer.save()
        
            return Response({
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            }, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TokenView(APIView):
    """View for token operations."""
    permission_classes = [AllowAny]

    def post(self, request):
        """Refresh access token using refresh token."""
        serializer = TokenRefreshSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        token = serializer.validated_data["refresh"]
        tokens = {"access": str(token.access_token), "refresh": str(token)}

        return Response(
            {"message": "Token refreshed successfully", **tokens},
            status=status.HTTP_200_OK,
        )


class TokenBlacklistView(APIView):
    """View for blacklisting tokens."""
    permission_classes = [AllowAny]

    def post(self, request):
        """Blacklist a refresh token."""
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"refresh_token": "Refresh token is required"},
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
                {"refresh_token": f"Invalid or expired refresh token: {str(e)}"},
                status=status.HTTP_401_UNAUTHORIZED,
            )


class PasswordUpdateView(APIView):
    """View for updating user password."""
    permission_classes = [IsAuthenticated]

    def put(self, request):
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