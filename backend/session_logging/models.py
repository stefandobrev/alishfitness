from django.db import models
from training_program.models import TrainingProgram, TrainingSession, TrainingExercise

class SessionLog(models.Model):
    STATUS_CHOICES = [
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
    ]

    training_program = models.ForeignKey(TrainingProgram, on_delete=models.CASCADE, db_index=True)
    session = models.ForeignKey(TrainingSession, on_delete=models.CASCADE, db_index=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="in_progress")
    completed_at = models.DateTimeField(auto_now_add=True)

class SetLog(models.Model):
    session_log = models.ForeignKey(SessionLog, on_delete=models.CASCADE, related_name="set_logs", db_index=True)
    exercise = models.ForeignKey(TrainingExercise, on_delete=models.CASCADE, db_index=True)
    weight = models.PositiveIntegerField(null=True, blank=True)
    reps = models.PositiveIntegerField(null=True, blank=True)
