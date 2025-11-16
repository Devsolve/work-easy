def test_format_modes(client):
    resp = client.post('/api/format', json={'text': 'Hello WORLD. this is a test', 'mode': 'lowercase'})
    assert resp.status_code == 200
    assert resp.get_json()['result'] == 'hello world. this is a test'

    resp = client.post('/api/format', json={'text': 'Hello world', 'mode': 'uppercase'})
    assert resp.get_json()['result'] == 'HELLO WORLD'

    resp = client.post('/api/format', json={'text': 'hello world. this is ok!', 'mode': 'sentence'})
    assert 'Hello world.' in resp.get_json()['result']

    resp = client.post('/api/format', json={'text': 'hello world', 'mode': 'capitalize'})
    assert resp.get_json()['result'] == 'Hello World'

def test_format_invalid_mode(client):
    resp = client.post('/api/format', json={'text': 'hello', 'mode': 'unknown'})
    assert resp.status_code == 400