from django.db import models
from django.utils.text import slugify

class MuscleGroup(models.Model):
    name = models.CharField(unique=True, max_length=30)
    slug = models.SlugField(unique=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name