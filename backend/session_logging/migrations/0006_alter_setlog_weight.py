# Generated by Django 5.2.3 on 2025-06-30 14:57

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        (
            "session_logging",
            "0005_alter_setlog_unique_together_setlog_sequence_and_more",
        ),
    ]

    operations = [
        migrations.AlterField(
            model_name="setlog",
            name="weight",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                max_digits=6,
                null=True,
                validators=[django.core.validators.MinValueValidator(0)],
            ),
        ),
    ]
