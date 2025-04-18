import pytest
from rest_framework.exceptions import ValidationError

from api.serializers.exercise_serializers import ExerciseSerializer

@pytest.mark.django_db(transaction=True)
class TestExerciseSerializer:
    def test_valid_data(self, test_muscle_group, test_secondary_muscle_group):
        valid_data = {
            "title": "Test Exercise",
            "primary_group": test_muscle_group.slug,
            "secondary_groups": [test_secondary_muscle_group.slug],
            "gif_link_front": "https://example.com/gifs/front_view.gif",
            "gif_link_side": "https://example.com/gifs/side_view.gif",
        } 
        
        serializer = ExerciseSerializer(data=valid_data)
        assert serializer.is_valid()
    
    def test_data_invalid_title_len(self, test_muscle_group):
        invalid_data = {
            "title": "Te",
            "primary_group": test_muscle_group.slug,
            "gif_link_front": "https://example.com/gifs/front_view.gif",
            "gif_link_side": "https://example.com/gifs/side_view.gif",
        }

        serializer = ExerciseSerializer(data=invalid_data)
        assert not serializer.is_valid()
        with pytest.raises(ValidationError) as exc_info:
            serializer.is_valid(raise_exception=True)
        assert "Title must be at least 3 characters long." in str(exc_info)

    def test_data_existing_title(self, test_muscle_group, test_exercise):
        invalid_data = {
            "title": "Test Exercise",
            "primary_group": test_muscle_group.id,
            "gif_link_front": "https://example.com/gifs/front_view.gif",
            "gif_link_side": "https://example.com/gifs/side_view.gif",
        }

        serializer = ExerciseSerializer(data=invalid_data)
        assert not serializer.is_valid()
        with pytest.raises(ValidationError) as exc_info:
            serializer.is_valid(raise_exception=True)
        assert "exercise with this title already exists." in str(exc_info)
    
    def test_same_gifs(self, test_muscle_group):
        invalid_data = {
            "title": "Test Exercise",
            "primary_group": test_muscle_group.id,
            "gif_link_front": "https://example.com/gifs/same_view.gif",
            "gif_link_side": "https://example.com/gifs/same_view.gif",
        }

        serializer = ExerciseSerializer(data=invalid_data)
        assert not serializer.is_valid()
        with pytest.raises(ValidationError) as exc_info:
            serializer.is_valid(raise_exception=True)
        assert "Gif links should be different." in str(exc_info)

    def test_update_primary_conflicts_with_existing_secondary(self, test_muscle_group, test_secondary_muscle_group):
        initial_data = {
            "title": "Update Test Exercise",
            "primary_group": test_secondary_muscle_group.slug,
            "secondary_groups": [test_muscle_group.slug],
            "gif_link_front": "https://example.com/gifs/front_view.gif",
            "gif_link_side": "https://example.com/gifs/side_view.gif",
        }
        serializer = ExerciseSerializer(data=initial_data)
        assert serializer.is_valid()
        exercise = serializer.save()
        
        update_data = {
            "primary_group": test_muscle_group.slug,
        }
        update_serializer = ExerciseSerializer(exercise, data=update_data, partial=True)
        assert not update_serializer.is_valid()
        with pytest.raises(ValidationError) as exc_info:
            update_serializer.is_valid(raise_exception=True)
        assert "You cannot select the same group as primary and secondary." in str(exc_info)

    def test_update_secondary_conflicts_with_existing_primary(self, test_muscle_group, test_secondary_muscle_group):
        initial_data = {
            "title": "Update Test Exercise",
            "primary_group": test_muscle_group.slug,
            "secondary_groups": [test_secondary_muscle_group.slug],
            "gif_link_front": "https://example.com/gifs/front_view.gif",
            "gif_link_side": "https://example.com/gifs/side_view.gif",
        }
        serializer = ExerciseSerializer(data=initial_data)
        assert serializer.is_valid()
        exercise = serializer.save()
        
        update_data = {
            "secondary_groups": [test_muscle_group.slug, test_secondary_muscle_group.slug],
        }
        update_serializer = ExerciseSerializer(exercise, data=update_data, partial=True)
        assert not update_serializer.is_valid()
        with pytest.raises(ValidationError) as exc_info:
            update_serializer.is_valid(raise_exception=True)
        assert "You cannot select the same group as primary and secondary." in str(exc_info)

    def test_valid_update_with_different_primary_and_secondary(self, test_muscle_group, test_secondary_muscle_group):
        initial_data = {
            "title": "Update Test Exercise",
            "primary_group": test_muscle_group.slug,
            "secondary_groups": [],
            "gif_link_front": "https://example.com/gifs/front_view.gif",
            "gif_link_side": "https://example.com/gifs/side_view.gif",
        }
        serializer = ExerciseSerializer(data=initial_data)
        assert serializer.is_valid()
        exercise = serializer.save()
        
        update_data = {
            "secondary_groups": [test_secondary_muscle_group.slug],
        }
        update_serializer = ExerciseSerializer(exercise, data=update_data, partial=True)
        assert update_serializer.is_valid()
        
        update_data_2 = {
            "primary_group": test_secondary_muscle_group.slug,
            "secondary_groups": [],
        }
        update_serializer_2 = ExerciseSerializer(exercise, data=update_data_2, partial=True)
        assert update_serializer_2.is_valid()

    def test_same_primary_and_secondary_groups_list(self, test_muscle_group):
        invalid_data = {
            "title": "Test Exercise",
            "primary_group": test_muscle_group.slug,
            "secondary_groups": [test_muscle_group.slug],  
            "gif_link_front": "https://example.com/gifs/front_view.gif",
            "gif_link_side": "https://example.com/gifs/side_view.gif",
        }
        serializer = ExerciseSerializer(data=invalid_data)
        assert not serializer.is_valid()
        with pytest.raises(ValidationError) as exc_info:
            serializer.is_valid(raise_exception=True)
        assert "You cannot select the same group as primary and secondary." in str(exc_info)
        
    def test_invalid_same_groups(self, test_secondary_muscle_group):
        invalid_exercise = {
            "title": "Test New Exercise",
            "primary_group": test_secondary_muscle_group.slug,
            "secondary_groups": [test_secondary_muscle_group.slug],
            "gif_link_front": "https://example.com/gifs/front_view.gif",
            "gif_link_side": "https://example.com/gifs/side_view.gif",
            "steps": [{"description": "Step1"}, {"description": "Step2"}],
            "mistakes": [{"description": "mistake1"}]
        }
        
        serializer = ExerciseSerializer(data=invalid_exercise)
        assert not serializer.is_valid()
        assert "You cannot select the same group as primary and secondary." in serializer.errors["secondary_groups"][0]

    def test_invalid_primary_group(self):
        invalid_data = {
            "title": "Test Exercise",
            "primary_group": "invalidgroup",
            "gif_link_front": "https://example.com/gifs/front_view.gif",
            "gif_link_side": "https://example.com/gifs/side_view.gif",
        }
        
        serializer = ExerciseSerializer(data=invalid_data)
        assert not serializer.is_valid()
        assert "Primary group not found." in serializer.errors["primary_group"]

    def test_invalid_secondary_group(self, test_muscle_group):
        invalid_data = {
            "title": "Test Exercise",
            "primary_group": test_muscle_group.slug,
            "secondary_groups": ["nonexistentgroup"],
            "gif_link_front": "https://example.com/gifs/front_view.gif",
            "gif_link_side": "https://example.com/gifs/side_view.gif",
        }
        
        serializer = ExerciseSerializer(data=invalid_data)
        assert not serializer.is_valid()
        assert "Secondary groups not found" in serializer.errors["secondary_groups"][0]

    def test_create_with_steps_and_mistakes(self, test_muscle_group):
        valid_data = {
            "title": "Test Exercise with Steps",
            "primary_group": test_muscle_group.slug,
            "gif_link_front": "https://example.com/gifs/front_view.gif",
            "gif_link_side": "https://example.com/gifs/side_view.gif",
            "steps": [{"description": "Step 1"}, {"description": "Step 2"}],
            "mistakes": [{"description": "Common mistake 1"}]
        }
        
        serializer = ExerciseSerializer(data=valid_data)
        assert serializer.is_valid()
        exercise = serializer.save()
        
        steps = exercise.steps.all().order_by("order")
        assert steps.count() == 2
        assert steps[0].description == "Step 1"
        assert steps[0].order == 1
        assert steps[1].description == "Step 2"
        assert steps[1].order == 2
        
        mistakes = exercise.mistakes.all()
        assert mistakes.count() == 1
        assert mistakes[0].description == "Common mistake 1"

    def test_update_exercise_fields(self, test_muscle_group, test_secondary_muscle_group):
        initial_data = {
            "title": "Initial Exercise",
            "primary_group": test_muscle_group.slug,
            "gif_link_front": "https://example.com/gifs/front_view.gif",
            "gif_link_side": "https://example.com/gifs/side_view.gif",
        }
        
        serializer = ExerciseSerializer(data=initial_data)
        assert serializer.is_valid()
        exercise = serializer.save()
        
        update_data = {
            "title": "Updated Exercise Title",
            "primary_group": test_secondary_muscle_group.slug,
            "video_link": "https://example.com/videos/exercise.mp4"
        }
        
        update_serializer = ExerciseSerializer(exercise, data=update_data, partial=True)
        assert update_serializer.is_valid()
        updated_exercise = update_serializer.save()
        
        assert updated_exercise.title == "Updated Exercise Title"
        assert updated_exercise.primary_group == test_secondary_muscle_group
        assert updated_exercise.video_link == "https://example.com/videos/exercise.mp4"
        assert updated_exercise.gif_link_front == "https://example.com/gifs/front_view.gif"
        assert updated_exercise.gif_link_side == "https://example.com/gifs/side_view.gif"
        
    def test_update_steps_and_mistakes(self, test_muscle_group):
        initial_data = {
            "title": "Exercise With Steps",
            "primary_group": test_muscle_group.slug,
            "gif_link_front": "https://example.com/gifs/front_view.gif",
            "gif_link_side": "https://example.com/gifs/side_view.gif",
            "steps": [{"description": "Original Step 1"}, {"description": "Original Step 2"}],
            "mistakes": [{"description": "Original Mistake 1"}]
        }
        
        serializer = ExerciseSerializer(data=initial_data)
        assert serializer.is_valid()
        exercise = serializer.save()
        
        update_data = {
            "steps": [
                {"description": "New Step 1"}, 
                {"description": "New Step 2"}, 
                {"description": "New Step 3"}
            ],
            "mistakes": [
                {"description": "New Mistake 1"}, 
                {"description": "New Mistake 2"}
            ]
        }
        
        update_serializer = ExerciseSerializer(exercise, data=update_data, partial=True)
        assert update_serializer.is_valid()
        updated_exercise = update_serializer.save()
        
        steps = updated_exercise.steps.all().order_by("order")
        assert steps.count() == 3
        assert steps[0].description == "New Step 1"
        assert steps[1].description == "New Step 2"
        assert steps[2].description == "New Step 3"
        
        mistakes = updated_exercise.mistakes.all()
        assert mistakes.count() == 2
        mistake_descriptions = [m.description for m in mistakes]
        assert "New Mistake 1" in mistake_descriptions
        assert "New Mistake 2" in mistake_descriptions