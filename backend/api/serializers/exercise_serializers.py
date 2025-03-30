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

            if Exercise.objects.filter(title__iexact=data["title"]).exists():
                raise serializers.ValidationError(
                    {"title": "An exercise with this title already exists."}
                )
        if "gif_link_front" in data:
            if data["gif_link_front"] == data["gif_link_side"]:
                raise serializers.ValidationError(
                    {"gif links": "Gif links should be different"}
                )

        return data
