from django.urls import path

from user.views import (
    CreateUserView,
    LoginView,
    ProfileView,
    SettingsView,
    TokenView,
    TokenBlacklistView,
    PasswordUpdateView
)

urlpatterns = [ 
    path("create-user/", CreateUserView.as_view(), name="create-user"),
    path("login/", LoginView.as_view(), name="login-user"),
    path("my-profile/", ProfileView.as_view(), name="get-my-profile"),
    path("my-profile/update/", ProfileView.as_view(), name="update-my-profile"),
    path("settings/", SettingsView.as_view(), name="get-settings"),
    path("settings/update/", SettingsView.as_view(), name="update-settings"),
    path("refresh-token/", TokenView.as_view(), name="refresh-token"),
    path("blacklist-token/", TokenBlacklistView.as_view(), name="blacklist-token"),
    path("settings/password/", PasswordUpdateView.as_view(), name="update-password"),
]