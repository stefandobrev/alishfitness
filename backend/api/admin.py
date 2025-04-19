from django.contrib import admin
from api.models import User, MuscleGroup, Exercise, Step, Mistake, TrainingProgram, TrainingSession, ProgramExercise

class UserAdmin(admin.ModelAdmin):
    ordering = ["username"]
    list_display = ["username", "first_name", "last_name", "is_active"]
    search_fields = ["username", "first_name", "last_name"]

class MuscleGroupAdmin(admin.ModelAdmin):
    ordering = ["name"]
    list_display = ["name", "slug"]

class StepInline(admin.TabularInline):
    model = Step
    extra = 0 
    fields = ["order", "description"]  

class MistakeInline(admin.TabularInline):
    model = Mistake
    extra = 0
    fields = ["description"]

class ExerciseAdmin(admin.ModelAdmin):
    ordering = ["title"]
    list_display = ["title", "primary_group", "id"]
    search_fields = ["title", "primary_group"]
    inlines = [StepInline, MistakeInline]

class ProgramExerciseInline(admin.TabularInline):
    model = ProgramExercise
    extra = 0
    fields = ["exercise", "muscle_group", "custom_exercise", "sequence", "sets", "reps"]

class TrainingSessionInline(admin.TabularInline):
    model = TrainingSession
    extra = 0
    fields = ["session_title"]
    inlines = [ProgramExerciseInline]

class TrainingProgramAdmin(admin.ModelAdmin):
    ordering = ["program_title"]
    list_display = ["mode", "program_title", "assigned_user", "activation_date"]
    search_fields = ["program_title", "assigned_user"]
    inlines = [TrainingSessionInline]

admin.site.register(User, UserAdmin) 
admin.site.register(MuscleGroup, MuscleGroupAdmin)
admin.site.register(Exercise, ExerciseAdmin)
admin.site.register(TrainingProgram, TrainingProgramAdmin)
