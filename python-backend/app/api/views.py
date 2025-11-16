from flask.views import MethodView
from flask import Blueprint, request
from ..utils import json_response
from ..core.constants import API_PREFIX, STATUS_OK
from ..models import Item
from ..core.extensions import db

bp = Blueprint("api", __name__, url_prefix=API_PREFIX)


class HealthView(MethodView):
    def get(self):
        return json_response({"status": STATUS_OK})


class ItemsView(MethodView):
    def get(self):
        items = [i.name for i in Item.query.order_by(Item.id).all()]
        return json_response({"items": items})

    def post(self):
        data = request.get_json() or {}
        item = data.get("item")
        if item:
            exists = Item.query.filter_by(name=item).first()
            if not exists:
                new_item = Item(name=item)
                db.session.add(new_item)
                db.session.commit()
        items = [i.name for i in Item.query.order_by(Item.id).all()]
        return json_response({"items": items}, 201)


bp.add_url_rule("/health", view_func=HealthView.as_view("health"))
bp.add_url_rule("/items", view_func=ItemsView.as_view("items"))