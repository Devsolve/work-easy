import os
import pytest
from app import create_app
from app.api import bp
from app.core.extensions import db


@pytest.fixture()
def client():
    app = create_app()
    app.register_blueprint(bp)
    test_url = os.getenv(
        "TEST_DATABASE_URL",
        os.getenv(
            "DATABASE_URL",
            "postgresql+psycopg2://postgres:postgres@localhost:5432/work_easy_test",
        ),
    )
    app.config.update({"SQLALCHEMY_DATABASE_URI": test_url})
    with app.app_context():
        try:
            db.create_all()
        except Exception:
            pytest.skip("PostgreSQL not available for tests")
    with app.test_client() as c:
        yield c
    with app.app_context():
        db.drop_all()