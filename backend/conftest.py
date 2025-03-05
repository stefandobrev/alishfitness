import os
import django
from django.conf import settings

import pytest

# Configure Django settings
os.environ["DJANGO_SETTINGS_MODULE"] = "backend.settings"
django.setup()

@pytest.fixture(scope="session")
def django_db_setup():
    """
    Customize database setup for tests
    """
    settings.DATABASES["default"] = {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }