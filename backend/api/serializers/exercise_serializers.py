from rest_framework import serializers
from api.models import Exercise
import re

class ExerciseSerializer(serializers.ModelSerializer):
    """Serializer for Exercise registration."""
    class Meta:
        model = Exercise
        fields = [
            "title",
            "primary_group",
            "secondary_groups",
            "gif_link_front",
            "gif_link_side",
            "video_link",
        ]
    
    def validate(self, data):
        """
        POST: Validate the exercise registration data.
        PUT: Validate only the fields that are being updated.
        Checks:
        - Title min length
        - Title contains only numbers and letters
        - Title uniqueness
        - Gif links contain different urls
        - Primary group is not in secondary groups
        """
        if "title" in data:
            if len(data["title"]) < 3:
                raise serializers.ValidationError(
                    {"title": "Title must be at least 3 characters long."}
                )
            if not re.match(r'^[a-zA-Z0-9 ]+$', data["title"]):
                raise serializers.ValidationError(
                    {"title": "Title should only contain letters and numbers."}
                )
            
            # For updates, need to exclude current instance from uniqueness check
            instance = getattr(self, 'instance', None)
            title_query = Exercise.objects.filter(title__iexact=data["title"])
            if instance:
                title_query = title_query.exclude(pk=instance.pk)
            if title_query.exists():
                raise serializers.ValidationError(
                    {"title": "An exercise with this title already exists."}
                )
        
        if "gif_link_front" in data and "gif_link_side" in data:
            if data["gif_link_front"] == data["gif_link_side"]:
                raise serializers.ValidationError(
                    {"gif_links": "Gif links should be different."}
                )
        
        primary_group = data.get("primary_group")
        secondary_groups = data.get("secondary_groups")

        if primary_group and secondary_groups and primary_group in secondary_groups:
            raise serializers.ValidationError(
                {"secondary_groups": "You cannot select the same group as primary and secondary."}
            )
        
        # For partial updates - check against existing instance data
        instance = getattr(self, 'instance', None)
        if instance:
            if primary_group and "secondary_groups" not in self.initial_data and instance.secondary_groups.filter(id=primary_group.id).exists():
                raise serializers.ValidationError(
                    {"secondary_groups": "You cannot select the same group as primary and secondary."}
                )
            
            if secondary_groups and "primary_group" not in self.initial_data and instance.primary_group in secondary_groups:                raise serializers.ValidationError(
                    {"secondary_groups": "You cannot select the same group as primary and secondary."}
                )
                
        return data