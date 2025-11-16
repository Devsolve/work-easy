from flask import Flask
from flask_cors import CORS
from .core.config import Config
from .core.extensions import db


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config())
    CORS(app, resources={r"/api/*": {"origins": app.config.get("CORS_ORIGINS")}})
    db.init_app(app)
    return app