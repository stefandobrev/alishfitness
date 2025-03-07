import pytest
from django.conf import settings

@pytest.fixture(scope="session", autouse=True)
def _set_test_db():
    # Override the default database with a test database
    settings.DATABASES["default"] = {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": settings.BASE_DIR / "test_db.sqlite3",
        "ATOMIC_REQUESTS": True,  # Test database
    }