def capitalize_sentences(text: str) -> str:
    if not text:
        return text or ""
    result = []
    capitalize_next = True
    for ch in text:
        if capitalize_next and ch.isalpha():
            result.append(ch.upper())
            capitalize_next = False
        else:
            result.append(ch)
        if ch in ".!?":
            capitalize_next = True
        elif ch.strip():
            pass
    return "".join(result)

def lowercase(text: str) -> str:
    return (text or "").lower()

def uppercase(text: str) -> str:
    return (text or "").upper()

def capitalize_words(text: str) -> str:
    if not text:
        return ""
    return " ".join([w[:1].upper() + w[1:] if w else w for w in text.split(" ")])