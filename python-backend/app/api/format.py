from flask.views import MethodView
from flask import request
from ..utils import json_response
from .views import bp
from ..utils.text import (
    lowercase,
    uppercase,
    capitalize_sentences,
    capitalize_words,
)

class FormatView(MethodView):
    def post(self):
        data = request.get_json(silent=True) or {}
        text = data.get("text")
        mode = str(data.get("mode", "")).lower()
        if text is None:
            return json_response({"error": "text is required"}, 400)
        handlers = {
            "lowercase": lowercase,
            "uppercase": uppercase,
            "sentence": capitalize_sentences,
            "capitalize": capitalize_words,
        }
        fn = handlers.get(mode)
        if not fn:
            return json_response({"error": "invalid mode"}, 400)
        result = fn(str(text))
        return json_response({"result": result, "mode": mode})

bp.add_url_rule("/format", view_func=FormatView.as_view("format"))