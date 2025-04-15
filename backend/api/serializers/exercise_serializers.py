from rest_framework import serializers
from api.models import Exercise, Step, Mistake, MuscleGroup
import re

class StepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Step
        fields = ['description', 'order']
        extra_kwargs = {'order': {'required': False}}

class MistakeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mistake
        fields = ['description']

class ExerciseSerializer(serializers.ModelSerializer):
    """Serializer for Exercise with nested steps and mistakes."""
    primary_group = serializers.CharField(required=False)  # Changed to CharField to handle slugs manually
    secondary_groups = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )
    steps = StepSerializer(many=True, required=False)
    mistakes = MistakeSerializer(many=True, required=False)
    
    class Meta:
        model = Exercise
        fields = [
            "title",
            "primary_group",
            "secondary_groups",
            "gif_link_front",
            "gif_link_side",
            "video_link",
            "steps",
            "mistakes"
        ]
   
    def validate(self, data):
        """
        Validate the exercise data.
        Checks:
        - Title min length
        - Title contains only numbers and letters
        - Title uniqueness
        - Gif links contain different urls
        - Primary and secondary groups exist
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
       
        if "primary_group" in data:
            primary_group_slug = data["primary_group"]
            primary_group = MuscleGroup.objects.filter(slug=primary_group_slug).first()
            if not primary_group:
                raise serializers.ValidationError(
                    {"primary_group": "Primary group not found."}
                )
            data["primary_group"] = primary_group

        if "secondary_groups" in data:
            secondary_groups = []
            invalid_groups = []
            
            for group_slug in data["secondary_groups"]:
                group = MuscleGroup.objects.filter(slug=group_slug).first()
                if group:
                    secondary_groups.append(group)
                else:
                    invalid_groups.append(group_slug)
            
            if invalid_groups:
                raise serializers.ValidationError(
                    {"secondary_groups": f"Secondary groups not found: {', '.join(invalid_groups)}"}
                )
            
            data["secondary_groups"] = secondary_groups
        
        # Handle validation between primary and secondary groups
        primary_group = data.get("primary_group")
        secondary_groups = data.get("secondary_groups", [])
        
        # Direct comparison for create operations
        if primary_group and secondary_groups and primary_group in secondary_groups:
            raise serializers.ValidationError(
                {"secondary_groups": "You cannot select the same group as primary and secondary."}
            )
            
        # For partial updates - check against existing instance data
        instance = getattr(self, 'instance', None)
        if instance:
            # If primary_group is being updated but secondary_groups isn't provided
            if primary_group and "secondary_groups" not in data:
                if instance.secondary_groups.filter(id=primary_group.id).exists():
                    raise serializers.ValidationError(
                        {"secondary_groups": "You cannot select the same group as primary and secondary."}
                    )
                
            # If secondary_groups is being updated but primary_group isn't provided
            if secondary_groups and "primary_group" not in data:
                if instance.primary_group in secondary_groups:
                    raise serializers.ValidationError(
                        {"secondary_groups": "You cannot select the same group as primary and secondary."}
                    )
        
        return data
    
    def create(self, validated_data):
        """Create exercise with related steps and mistakes."""
        steps_data = validated_data.pop('steps', [])
        mistakes_data = validated_data.pop('mistakes', [])
        secondary_groups = validated_data.pop('secondary_groups', [])
        
        exercise = Exercise.objects.create(**validated_data)
        
        # Add secondary groups
        if secondary_groups:
            exercise.secondary_groups.set(secondary_groups)
        
        # Create steps with order
        for index, step_data in enumerate(steps_data, start=1):
            Step.objects.create(
                exercise=exercise,
                description=step_data['description'],
                order=index
            )
        
        # Create mistakes
        for mistake_data in mistakes_data:
            Mistake.objects.create(
                exercise=exercise,
                description=mistake_data['description']
            )
        
        return exercise
    
    def update(self, instance, validated_data):
        """Update exercise with related steps and mistakes."""
        steps_data = validated_data.pop('steps', None)
        mistakes_data = validated_data.pop('mistakes', None)
        secondary_groups = validated_data.pop('secondary_groups', None)
        
        # Update exercise fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update secondary groups if provided
        if secondary_groups is not None:
            instance.secondary_groups.set(secondary_groups)
        
        # Update steps if provided
        if steps_data is not None:
            instance.steps.all().delete()
            for index, step_data in enumerate(steps_data, start=1):
                Step.objects.create(
                    exercise=instance,
                    description=step_data['description'],
                    order=index
                )
        
        # Update mistakes if provided
        if mistakes_data is not None:
            instance.mistakes.all().delete()
            for mistake_data in mistakes_data:
                Mistake.objects.create(
                    exercise=instance,
                    description=mistake_data['description']
                )
        
        return instance