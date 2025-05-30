from django.contrib import admin
from nested_admin import NestedTabularInline, NestedModelAdmin
from training_program.models import TrainingProgram, TrainingSession, TrainingExercise

class TrainingExerciseInline(NestedTabularInline):
    model = TrainingExercise
    extra = 0
    fields = ["exercise", "muscle_group","is_custom_muscle_group", "custom_exercise_title", "sequence", "sets", "reps", "display_id"]
    readonly_fields = ["display_id"]
    
    def display_id(self, obj):
        return obj.id
    display_id.short_description = "ID"

class TrainingSessionInline(NestedTabularInline):
    model = TrainingSession
    extra = 0
    fields = ["session_title", "display_id"]
    readonly_fields = ["display_id"]
    inlines = [TrainingExerciseInline]

    def display_id(self, obj):
        return obj.id
    display_id.short_description = "ID"

class TrainingProgramAdmin(NestedModelAdmin):
    ordering = ["program_title"]
    list_display = ["program_title","mode", "status", "assigned_user", "activation_date"]
    search_fields = ["program_title", "assigned_user__username"]
    inlines = [TrainingSessionInline]


admin.site.register(TrainingProgram, TrainingProgramAdmin)