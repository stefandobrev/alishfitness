from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
import re

from rest_framework_simplejwt.token_blacklist.models import (
    BlacklistedToken,
    OutstandingToken,
)
from user.models import User

class UserSerializer(serializers.ModelSerializer):
    """Serializer for user registration, profile updates, and settings updates."""
    
    confirm_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
            "password",
            "confirm_password",
        ]
        extra_kwargs = {
            "password": {
                "write_only": True,
                "min_length": 8,
            }
        }

    def validate(self, data):
        """
        Validate the user registration data.

        Checks:
        - First and Last names regex chars
        - Passwords match
        - Email case sensitivity, uniqeness
        - Username case sensitivity, uniqeness, regex chars
        """
        instance = getattr(self, "instance", None)

        if "first_name" in data:
            if not data["first_name"].strip():
                raise serializers.ValidationError({"first_name": "First name cannot be empty."})
            if not re.match(r"^[a-zA-Z\s-]+$", data["first_name"]):
                raise serializers.ValidationError({"first_name": "First name can only contain letters, spaces, and hyphens."})

        if "last_name" in data:
            if not data["last_name"].strip():
                raise serializers.ValidationError({"last_name": "Last name cannot be empty."})
            if not re.match(r"^[a-zA-Z\s-]+$", data["last_name"]):
                raise serializers.ValidationError({"last_name": "Last name can only contain letters, spaces, and hyphens."})


        if instance and "password" in data:
            if not instance.check_password(data.get("password")):
                raise serializers.ValidationError({"password": "Incorrect password."})

        if "password" in data or "confirm_password" in data:
            if data.get("password") != data.get("confirm_password"):
                raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        
        if "email" in data:
            email = data["email"].lower()
            data["email"] = email  
            queryset = User.objects.filter(email__iexact=email)
            if instance:
                queryset = queryset.exclude(pk=instance.pk)
            if queryset.exists():
                raise serializers.ValidationError({"email": "This email is already registered."})

        if "username" in data:
            username = data["username"].lower()

            if not re.match(r"^[a-zA-Z0-9_-]+$", username):
                raise serializers.ValidationError({"username": "Username can only contain letters, numbers, hyphens, and underscores."})

            data["username"] = username  
            queryset = User.objects.filter(username__iexact=username)
            if instance:
                queryset = queryset.exclude(pk=instance.pk)
            if queryset.exists():
                raise serializers.ValidationError({"username": "This username is already taken."})

        return data

    def create(self, validated_data):
        """Create and return a new user."""
        validated_data.pop("confirm_password")
        validated_data["password"] = make_password(validated_data["password"])

        return User.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        """Update and return an existing user."""
        validated_data.pop("password", None)
        validated_data.pop("confirm_password", None)    
        
        for field, value in validated_data.items():
            setattr(instance, field, value)

        instance.save()
        return instance


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""

    login_username = serializers.CharField()
    login_password = serializers.CharField(
        write_only=True, style={"input_type": "password"}
    )

    def validate(self, data):
        """
        Validate login credentials and return user if valid.

        Raises:
            AuthenticationFailed: If credentials are invalid
        """
        # Convert username to lowercase for consistency
        username = data["login_username"].lower()

        user = authenticate(username=username, password=data["login_password"])

        if not user:
            raise AuthenticationFailed(
                {"login_username": "Invalid username or password."}
            )

        if not user.is_active:
            raise AuthenticationFailed(
                {"login_username": "This account has been disabled."}
            )

        return {"user": user}

class UpdatePasswordSerializer(serializers.Serializer):
    """Serializer for updating user password."""

    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        """
        Validate the password update data.

        Checks:
        - Current password is correct
        - Current password is not the same as new password
        - New passwords match
        """
        user = self.context["request"].user

        if not user.check_password(data["current_password"]):
            raise serializers.ValidationError(
                {"current_password": "Current password is incorrect."}
            )

        if data["current_password"] == data["new_password"]:
            raise serializers.ValidationError(
                {
                    "new_password": "New password cannot be the same as the current password."
                }
            )

        if data["new_password"] != data["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password": "Passwords do not match."}
            )

        return data

    def save(self, **kwargs):
        """Update the user"s password."""
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save()


class TokenRefreshSerializer(serializers.Serializer):
    refresh = serializers.CharField(required=True)

    def validate_refresh(self, value):
        """Validate the refresh token."""
        try:
            token = RefreshToken(value)

            # Check if token exists in outstanding tokens
            jti = token.get("jti")
            if not OutstandingToken.objects.filter(jti=jti).exists():
                raise serializers.ValidationError(
                    "Token not found in outstanding tokens."
                )

            # Check if token is blacklisted
            if BlacklistedToken.objects.filter(token__jti=jti).exists():
                raise serializers.ValidationError("Token is blacklisted.")

            return token

        except TokenError as e:
            raise serializers.ValidationError(
                f"Invalid or expired refresh token: {str(e)}"
            )
        except Exception as e:
            raise serializers.ValidationError(f"Token validation failed: {str(e)}")
        
class UserSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "username"]
