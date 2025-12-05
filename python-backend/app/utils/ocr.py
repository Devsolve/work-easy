from typing import Optional

def extract_text_from_image(file_bytes: bytes) -> Optional[str]:
    try:
        from PIL import Image
        import pytesseract
        import io
        img = Image.open(io.BytesIO(file_bytes))
        text = pytesseract.image_to_string(img)
        return text.strip()
    except Exception:
        return None

