from django.contrib import admin
from session_logging.models import SessionLog, SetLog

class SetLogAdmin(admin.TabularInline):
    model = SetLog
    extra = 0
    fields = ["sequence", "exercise_title", "set_number", "weight", "reps"]
    readonly_fields = ["exercise_title", "sequence"]
    ordering = ["exercise__sequence", "set_number"]
    
    def exercise_title(self, obj):
        if obj.exercise and obj.exercise.exercise:
            return obj.exercise.exercise.title
        elif obj.exercise and obj.exercise.custom_exercise_title:
            return obj.exercise.custom_exercise_title
        return "-"
    exercise_title.short_description = "Exercise"
   
    def sequence(self, obj):
        if obj.exercise:
            return obj.exercise.sequence
        return "-"
    sequence.short_description = "Seq"

class SessionLogAdmin(admin.ModelAdmin):
    ordering = ["training_program__program_title"]
    list_display = ["program_title", "session_title", "status", "completed_at"]
    search_fields = ["training_program__program_title", "session__session_title"]
    inlines = [SetLogAdmin]  
    
    def program_title(self, obj):
        return obj.training_program.program_title
    program_title.admin_order_field = "training_program__program_title"
    program_title.short_description = "Program Title"
    
    def session_title(self, obj):
        return obj.session.session_title
    session_title.admin_order_field = "session__session_title"
    session_title.short_description = "Session Title"

admin.site.register(SessionLog, SessionLogAdmin)