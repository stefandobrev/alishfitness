from django.db import models
from exercise.models import Exercise, MuscleGroup
from user.models import User

class TrainingProgram(models.Model):
    PROGRAM_MODES = [
        ("template", "Template"),
        ("assigned", "Assigned"),
    ]

    PROGRAM_STATUSES = [
        ("scheduled", "Scheduled"),
        ("current", "Current"),
        ("archived", "Archived"),
    ]   
    program_title = models.CharField(max_length=255)
    mode = models.CharField(max_length=20, choices=PROGRAM_MODES)
    status = models.CharField(max_length=20, choices=PROGRAM_STATUSES, blank=True, null=True)
    assigned_user = models.ForeignKey(
        User, null=True, blank=True, on_delete=models.CASCADE
    )
    activation_date = models.DateField(null=True, blank=True)
    schedule_data = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.program_title
    
    def is_template(self):
        return self.mode == "template"
    
    def is_active(self):
        return self.mode == "assigned" and self.assigned_user is not None
    
class TrainingSession(models.Model): 
    session_title = models.CharField(max_length=255)  
    program = models.ForeignKey(
        TrainingProgram, 
        related_name="sessions", 
        on_delete=models.CASCADE
    )
  
    def __str__(self):
        return f"{self.program.program_title} - {self.session_title}"

class TrainingExercise(models.Model):
    session = models.ForeignKey(
        TrainingSession, 
        related_name="exercises", 
        on_delete=models.CASCADE
    )
    exercise = models.ForeignKey(
        Exercise, 
        related_name="program_exercises", 
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    muscle_group = models.ForeignKey(
        MuscleGroup,
        related_name="program_muscle_group",
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    is_custom_muscle_group = models.BooleanField(default=False)
    custom_exercise_title = models.CharField(max_length=100,null=True, blank=True)
    sequence = models.CharField(max_length=10)  
    sets = models.IntegerField()
    reps = models.CharField(max_length=50)  
    
    def __str__(self):
        if self.is_custom_muscle_group:
            return f"{self.custom_exercise_title} ({self.sets}x{self.reps})"
        return f"{self.exercise.title} ({self.sets}x{self.reps})"
