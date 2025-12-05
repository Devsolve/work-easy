import io


def test_ocr_endpoint_monkeypatched(client, monkeypatch):
    def fake_extract(_bytes):
        return "Hello from OCR"

    from app.api import ocr as ocr_api

    monkeypatch.setattr(ocr_api, "extract_text_from_image", fake_extract)

    data = {
        'image': (io.BytesIO(b'fake'), 'fake.png')
    }
    resp = client.post('/api/ocr', data=data, content_type='multipart/form-data')
    assert resp.status_code == 200
    assert resp.get_json()['result'] == 'Hello from OCR'

def test_ocr_requires_file(client):
    resp = client.post('/api/ocr')
    assert resp.status_code == 400
