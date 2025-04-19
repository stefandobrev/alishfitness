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

class TrainingProgramAdmin(admin.ModelAdmin):
    ordering = ["program_title"]
    list_display = ["mode", "program_title", "assigned_user", "activation_date"]

class TrainingSessionAdmin(admin.ModelAdmin):
    ordering = ["program__program_title"]
    list_display = ["program", "session_title"]

class ProgramExerciseAdmin(admin.ModelAdmin):
    ordering = ["session__program__program_title", "session__session_title", "sequence"]
    list_display = ["program_title", "session", "sequence", "exercise", "custom_exercise"]

    def program_title(self, obj):
        return obj.session.program.program_title

admin.site.register(User, UserAdmin) 
admin.site.register(MuscleGroup, MuscleGroupAdmin)
admin.site.register(Exercise, ExerciseAdmin)
admin.site.register(Step, StepAdmin)
admin.site.register(Mistake, MistakeAdmin)
admin.site.register(TrainingProgram, TrainingProgramAdmin)
admin.site.register(TrainingSession, TrainingSessionAdmin)
admin.site.register(ProgramExercise, ProgramExerciseAdmin)
