from django.test import TestCase
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from api.models import MuscleGroup, Exercise, Step, Mistake

class ExerciseModelBaseCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.primary_group = MuscleGroup.objects.create(name="Biceps")

        cls.base_exercise = Exercise.objects.create(
            title = "Base Exercise",
            primary_group = cls.primary_group,
            gif_link_front = "https://media.musclewiki.com/media/uploads/videos/branded/male-Dumbbells-dumbbell-curl-front.mp4#t=0.1",
            gif_link_side = "https://media.musclewiki.com/media/uploads/videos/branded/male-Dumbbells-dumbbell-curl-side.mp4#t=0.1",
        )

class MuscleGroupTestCase(TestCase):
    def test_valid_creation(self):
        mg = MuscleGroup.objects.create(name="Quadriceps")
        self.assertEqual(MuscleGroup.objects.count(), 1)

    def test_invalid_title(self):
        with self.assertRaises(ValidationError):
            MuscleGroup(name="").full_clean()

        MuscleGroup.objects.create(name="Triceps")
        with self.assertRaises(IntegrityError):
            MuscleGroup.objects.create(name="Triceps")

        long_name = "A" * 31
        with self.assertRaises(ValidationError):
            MuscleGroup(name=long_name).full_clean()

    def test_slug_behaviour(self):
        mg = MuscleGroup.objects.create(name="Lower Back")
        self.assertEqual(mg.slug, "lower-back")

        mg = MuscleGroup.objects.create(name="Middle (Back)")
        self.assertEqual(mg.slug, "middle-back")

class ExerciseTestCast(ExerciseModelBaseCase):
    def test_valid_creation(self):
        ex = Exercise.objects.create(
            title = "Valid Exercise",
            primary_group = self.primary_group,
            gif_link_front="http://example.com/valid.gif",
            gif_link_side="http://example.com/validside.gif",
        )
        self.assertEqual(Exercise.objects.count(), 2)