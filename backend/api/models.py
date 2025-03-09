from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify


class User(AbstractUser):
    email = models.EmailField(unique=True)


class MuscleGroup(models.Model):
    name = models.CharField(unique=True, max_length=30)
    slug = models.SlugField(unique=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Exercise(models.Model):
    title = models.CharField(unique=True, max_length=100)
    slug = models.SlugField(unique=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


    def __str__(self):
        return self.name

    primary_group = models.ForeignKey(
        MuscleGroup, related_name="primary_exercises", on_delete=models.CASCADE
    )
    secondary_groups = models.ManyToManyField(
        MuscleGroup, related_name="secondary_exercises", blank=True
    )
    
    gif_link_front = models.URLField(max_length=255, blank=True, null=False, default="")
    gif_link_side = models.URLField(max_length=255, blank=True, null=False, default="")
    video_link = models.URLField(max_length=255, blank=True, null=False, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Step(models.Model):
    exercise = models.ForeignKey(
        Exercise, related_name="steps", on_delete=models.CASCADE
    )
    description = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.description


class Mistake(models.Model):
    exercise = models.ForeignKey(
        Exercise, related_name="mistakes", on_delete=models.CASCADE
    )
    description = models.TextField()

    def __str__(self):
        return self.description
