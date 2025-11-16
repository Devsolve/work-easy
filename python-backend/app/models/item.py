from datetime import datetime
from ..core.extensions import db


class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False,
    )