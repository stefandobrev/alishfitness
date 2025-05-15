from django.contrib import admin
from nested_admin import NestedTabularInline, NestedModelAdmin
from exercise.models import  MuscleGroup, Exercise, Step, Mistake

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
    search_fields = ["title", "primary_group__name"]
    inlines = [StepInline, MistakeInline]

admin.site.register(MuscleGroup, MuscleGroupAdmin)
admin.site.register(Exercise, ExerciseAdmin)
