from flask.views import MethodView
from flask import request
from ..utils import json_response
from ..core.constants import API_PREFIX
from .views import bp
from ..utils.text import capitalize_sentences

class CapitalizeView(MethodView):
    def post(self):
        data = request.get_json(silent=True) or {}
        text = data.get("text")
        if text is None:
            return json_response({"error": "text is required"}, 400)
        result = capitalize_sentences(str(text))
        return json_response({"result": result})

bp.add_url_rule("/capitalize", view_func=CapitalizeView.as_view("capitalize"))