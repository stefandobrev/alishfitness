import pytest
from rest_framework.exceptions import ValidationError

from api.serializers.exercise_serializers import ExerciseSerializer

@pytest.mark.django_db(transaction=True)
class TestExerciseSerializer:
    def test_valid_data(self, test_muscle_group, test_secondary_muscle_group):
        valid_data = {
            "title": "Test Exercise",
            "primary_group": test_muscle_group.id,
            "secondary_groups": [test_secondary_muscle_group.id],
            "gif_link_front": "https://example.com/gifs/front_view.gif",
            "gif_link_side": "https://example.com/gifs/side_view.gif",
        } 
        
        serializer = ExerciseSerializer(data=valid_data)
        assert serializer.is_valid()
    
    def test_data_invalid_title_len(self, test_muscle_group):
        invalid_data = {
            "title": "Te",
            "primary_group": test_muscle_group.id,
            "gif_link_front": "https://example.com/gifs/front_view.gif",
            "gif_link_side": "https://example.com/gifs/side_view.gif",
        }

        serializer = ExerciseSerializer(data=invalid_data)
        assert not serializer.is_valid()
        with pytest.raises(ValidationError) as exc_info:
            serializer.is_valid(raise_exception=True)
        assert "Title must be at least 3 characters long." in str(exc_info)

    def test_data_invalid_title_chars(self, test_muscle_group):
        invalid_data = {
            "title": "@Title@",
            "primary_group": test_muscle_group.id,
            "gif_link_front": "https://example.com/gifs/front_view.gif",
            "gif_link_side": "https://example.com/gifs/side_view.gif",
        }

        serializer = ExerciseSerializer(data=invalid_data)
        assert not serializer.is_valid()
        with pytest.raises(ValidationError) as exc_info:
            serializer.is_valid(raise_exception=True)
        assert "Title should only contain letters and numbers." in str(exc_info)

    def test_data_existing_title(self,test_muscle_group, test_exercise):
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
        assert "exercise with this title already exists." in str(exc_info) ## taken from model
    
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
            "primary_group": test_secondary_muscle_group.id,
            "secondary_groups": [test_muscle_group.id],
            "gif_link_front": "https://example.com/gifs/front_view.gif",
            "gif_link_side": "https://example.com/gifs/side_view.gif",
        }
        serializer = ExerciseSerializer(data=initial_data)
        assert serializer.is_valid()
        exercise = serializer.save()
        
        update_data = {
            "primary_group": test_muscle_group.id,
        }
        update_serializer = ExerciseSerializer(exercise, data=update_data, partial=True)
        assert not update_serializer.is_valid()
        with pytest.raises(ValidationError) as exc_info:
            update_serializer.is_valid(raise_exception=True)
        assert "You cannot select the same group as primary and secondary." in str(exc_info)

    def test_update_secondary_conflicts_with_existing_primary(self, test_muscle_group, test_secondary_muscle_group):
        initial_data = {
            "title": "Update Test Exercise",
            "primary_group": test_muscle_group.id,
            "secondary_groups": [test_secondary_muscle_group.id],
            "gif_link_front": "https://example.com/gifs/front_view.gif",
            "gif_link_side": "https://example.com/gifs/side_view.gif",
        }
        serializer = ExerciseSerializer(data=initial_data)
        assert serializer.is_valid()
        exercise = serializer.save()
        
        update_data = {
            "secondary_groups": [test_muscle_group.id, test_secondary_muscle_group.id],
        }
        update_serializer = ExerciseSerializer(exercise, data=update_data, partial=True)
        assert not update_serializer.is_valid()
        with pytest.raises(ValidationError) as exc_info:
            update_serializer.is_valid(raise_exception=True)
        assert "You cannot select the same group as primary and secondary." in str(exc_info)

    def test_valid_update_with_different_primary_and_secondary(self, test_muscle_group, test_secondary_muscle_group):
        initial_data = {
            "title": "Update Test Exercise",
            "primary_group": test_muscle_group.id,
            "secondary_groups": [],
            "gif_link_front": "https://example.com/gifs/front_view.gif",
            "gif_link_side": "https://example.com/gifs/side_view.gif",
        }
        serializer = ExerciseSerializer(data=initial_data)
        assert serializer.is_valid()
        exercise = serializer.save()
        
        update_data = {
            "secondary_groups": [test_secondary_muscle_group.id],
        }
        update_serializer = ExerciseSerializer(exercise, data=update_data, partial=True)
        assert update_serializer.is_valid()
        
        update_data_2 = {
            "primary_group": test_secondary_muscle_group.id,
            "secondary_groups": [],
        }
        update_serializer_2 = ExerciseSerializer(exercise, data=update_data_2, partial=True)
        assert update_serializer_2.is_valid()

    def test_same_primary_and_secondary_groups_list(self, test_muscle_group):
        invalid_data = {
            "title": "Test Exercise",
            "primary_group": test_muscle_group.id,
            "secondary_groups": [test_muscle_group.id],  
            "gif_link_front": "https://example.com/gifs/front_view.gif",
            "gif_link_side": "https://example.com/gifs/side_view.gif",
        }
        serializer = ExerciseSerializer(data=invalid_data)
        assert not serializer.is_valid()
        with pytest.raises(ValidationError) as exc_info:
            serializer.is_valid(raise_exception=True)
        assert "You cannot select the same group as primary and secondary." in str(exc_info)