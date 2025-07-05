from django.db import models
from django.utils.timezone import now
from django.core.validators import MinValueValidator
from training_program.models import TrainingProgram, TrainingSession, TrainingExercise

class SessionLog(models.Model):
    STATUS_CHOICES = [
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
    ]

    training_program = models.ForeignKey(TrainingProgram, on_delete=models.SET_NULL, null=True, blank=True, db_index=True)
    session = models.ForeignKey(TrainingSession, on_delete=models.SET_NULL, null=True, blank=True, db_index=True)
    order = models.PositiveSmallIntegerField()

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="in_progress")
    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.status == "completed" and self.completed_at is None:
            self.completed_at = now()
        elif self.status != "completed":
            self.completed_at = None
        super().save(*args, **kwargs)

class SetLog(models.Model):
    session_log = models.ForeignKey(SessionLog, on_delete=models.CASCADE, related_name="set_logs", db_index=True)
    exercise = models.ForeignKey(TrainingExercise, on_delete=models.SET_NULL, null=True, blank=True, db_index=True)
    set_number = models.PositiveSmallIntegerField() 
    sequence = models.CharField(max_length=10)
    weight = models.DecimalField(
        max_digits=6, 
        decimal_places=2, 
        null=True, 
        blank=True, 
        validators=[MinValueValidator(0)]
    )
    reps = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        unique_together = ("session_log", "set_number", "sequence")

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.session_log.save()  
