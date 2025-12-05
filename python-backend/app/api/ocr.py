from flask.views import MethodView
from flask import request
from .views import bp
from ..utils import json_response
from ..utils.ocr import extract_text_from_image

class OCRView(MethodView):
    def post(self):
        if 'image' not in request.files:
            return json_response({'error': 'image file is required (field name: image)'}, 400)
        file = request.files['image']
        data = file.read()
        text = extract_text_from_image(data)
        if text is None:
            return json_response({'error': 'OCR unavailable. Ensure Tesseract and dependencies are installed.'}, 500)
        return json_response({'result': text})

bp.add_url_rule('/ocr', view_func=OCRView.as_view('ocr'))

