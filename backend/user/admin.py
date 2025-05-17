from django.contrib import admin
from user.models import User
from django.contrib.auth.models import Group

class UserAdmin(admin.ModelAdmin):
    ordering = ["username"]
    list_display = ["username", "first_name", "last_name", "is_active"]
    search_fields = ["username", "first_name", "last_name"]

admin.site.register(User, UserAdmin) 
admin.site.unregister(Group)
