from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from django.core.validators import EmailValidator
from rest_framework.validators import UniqueValidator
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

from rest_framework_simplejwt.token_blacklist.models import (
    BlacklistedToken,
    OutstandingToken,
)
from api.models import User

class UserSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""

    confirm_password = serializers.CharField(write_only=True)
    email = serializers.EmailField(
        validators=[
            EmailValidator(message="Enter a valid email address."),  
            UniqueValidator(queryset=User.objects.all(), message="This email is already registered.") 
        ]
    )
    username = serializers.CharField(
        validators=[UniqueValidator(queryset=User.objects.all(), message="This username is already taken.")]
    )

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
                "style": {"input_type": "password"},
            },
            "first_name": {"required": True},
            "last_name": {"required": True},
        }

    def validate(self, data):
        """
        Validate the user registration data.

        Checks:
        - Passwords match
        - Email case sensitivity uniqeness
        """
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password": "Passwords do not match."}
            )
        
        if User.objects.filter(email__iexact=data["email"].lower()).exists():
            raise serializers.ValidationError(
                {"email": "This email is already registered."}
        )

        return data

    def create(self, validated_data):
        """Create and return a new user."""
        # Remove confirm_password from the data
        validated_data.pop("confirm_password")

        # Hash the password
        validated_data["password"] = make_password(validated_data["password"])

        # Ensure username and email are lowercase
        validated_data["username"] = validated_data["username"].lower()
        validated_data["email"] = validated_data["email"].lower()

        return User.objects.create(**validated_data)


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
                {"non_field_errors": ["Invalid username or password"]}
            )

        if not user.is_active:
            raise AuthenticationFailed(
                {"non_field_errors": ["This account has been disabled"]}
            )

        return {"user": user}


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile updates."""

    class Meta:
        model = User
        fields = ["first_name", "last_name"]
        extra_kwargs = {
            "first_name": {"required": True},
            "last_name": {"required": True},
        }

    def validate(self, data):
        """Validate profile update data."""
        if not data.get("first_name") and not data.get("last_name"):
            raise serializers.ValidationError(
                {"non_field_errors": ["At least one field must be provided"]}
            )
        return data


class UserSettingsSerializer(serializers.ModelSerializer):
    """Serializer for settings updates."""

    confirm_password = serializers.CharField(write_only=True)
    email = serializers.EmailField(validators=[EmailValidator()])

    class Meta:
        model = User
        fields = ["username", "email", "password", "confirm_password"]
        extra_kwargs = {
            "password": {
                "write_only": True,
                "min_length": 8,
                "style": {"input_type": "password"},
            },
        }

    def validate(self, data):
        """
        Validate the user settings data.

        Checks:
        - Current password is correct
        - Passwords match
        - Username uniqueness (excluding current user)
        - Email uniqueness (excluding current user)
        """
        # Verify current password first
        if not self.instance.check_password(data["password"]):
            raise serializers.ValidationError(
                {"password": "Current password is incorrect."}
            )

        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password": "Passwords do not match."}
            )

        # Username and email uniqueness checks (excluding current user)
        if (
            User.objects.exclude(pk=self.instance.pk)
            .filter(username=data["username"].lower())
            .exists()
        ):
            raise serializers.ValidationError(
                {"username": "This username is already taken."}
            )

        if (
            User.objects.exclude(pk=self.instance.pk)
            .filter(email=data["email"].lower())
            .exists()
        ):
            raise serializers.ValidationError(
                {"email": "This email is already registered."}
            )

        return data

    def update(self, instance, validated_data):
        """Update and return the user settings."""
        # Remove password fields as they were only used for validation
        validated_data.pop("confirm_password")
        validated_data.pop("password")

        # Ensure username and email are lowercase
        validated_data["username"] = validated_data["username"].lower()
        validated_data["email"] = validated_data["email"].lower()

        # Update the instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


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

        # Verify current password
        if not user.check_password(data["current_password"]):
            raise serializers.ValidationError(
                {"current_password": "Current password is incorrect."}
            )

        # Check if current and new passwords are the same
        if data["current_password"] == data["new_password"]:
            raise serializers.ValidationError(
                {
                    "new_password": "New password cannot be the same as the current password."
                }
            )

        # Check if new passwords match
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
                    "Token not found in outstanding tokens"
                )

            # Check if token is blacklisted
            if BlacklistedToken.objects.filter(token__jti=jti).exists():
                raise serializers.ValidationError("Token is blacklisted")

            return token

        except TokenError as e:
            raise serializers.ValidationError(
                f"Invalid or expired refresh token: {str(e)}"
            )
        except Exception as e:
            raise serializers.ValidationError(f"Token validation failed: {str(e)}")
