from app import create_app
from app.api import bp
from app.core.extensions import db
from app.utils import ensure_postgres_db

app = create_app()
app.register_blueprint(bp)

if __name__ == "__main__":
    port = app.config.get("PORT", 5002)
    with app.app_context():
        uri = app.config.get("SQLALCHEMY_DATABASE_URI", "")
        if uri.startswith("postgresql"):
            ensure_postgres_db(uri)
        db.create_all()
    app.run(host="0.0.0.0", port=port)