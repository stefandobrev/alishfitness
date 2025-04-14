from django.db import models
from api.models import Exercise, User

class TrainingProgram(models.Model):
    PROGRAM_MODES = [
        ("template", "Template"),
        ("create", "Active Program"),
    ]
    program_title = models.CharField(max_length=255)
    mode = models.CharField(max_length=20, choices=PROGRAM_MODES)
    assigned_user = models.ForeignKey(
        User, null=True, blank=True, on_delete=models.CASCADE
    )
    activation_date = models.DateField(null=True, blank=True)
    schedule_array = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.program_title
    
    def is_template(self):
        return self.mode == "template"
    
    def is_active(self):
        return self.mode == "create" and self.assigned_user is not None
    
class TrainingSession(models.Model): 
    session_title = models.CharField(max_length=255)  
    program = models.ForeignKey(
        TrainingProgram, 
        related_name="sessions", 
        on_delete=models.CASCADE
    )
  
    def __str__(self):
        return f"{self.program.program_title} - {self.session_title}"

class ProgramExercise(models.Model):
    session = models.ForeignKey(
        TrainingSession, 
        related_name="exercises", 
        on_delete=models.CASCADE
    )
    exercise = models.ForeignKey(
        Exercise, 
        related_name="program_exercises", 
        on_delete=models.CASCADE
    )
    sequence = models.CharField(max_length=10, blank=True)  
    sets = models.CharField(max_length=10)
    reps = models.CharField(max_length=50)  
    
    def __str__(self):
        return f"{self.exercise.title} ({self.sets}x{self.reps})"