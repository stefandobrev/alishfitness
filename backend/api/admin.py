from django.contrib import admin
from api.models import User, MuscleGroup, Exercise, Step, Mistake, TrainingProgram, TrainingSession, ProgramExercise

class UserAdmin(admin.ModelAdmin):
    ordering = ["username"]
    list_display = ["username", "first_name", "last_name", "is_active"]

class MuscleGroupAdmin(admin.ModelAdmin):
    ordering = ["name"]
    list_display = ["name", "slug"]

class ExerciseAdmin(admin.ModelAdmin):
    ordering = ["title"]
    list_display = ["title", "primary_group", "id"]

class StepAdmin(admin.ModelAdmin):
    ordering = ["exercise__title", "order"]
    list_display = ["exercise", "order", "description"]

class MistakeAdmin(admin.ModelAdmin):
    ordering = ["exercise__title"]
    list_display = ["exercise", "description"]


admin.site.register(User, UserAdmin) 
admin.site.register(MuscleGroup, MuscleGroupAdmin)
admin.site.register(Exercise, ExerciseAdmin)
admin.site.register(Step, StepAdmin)
admin.site.register(Mistake, MistakeAdmin)
