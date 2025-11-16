def test_capitalize_basic(client):
    res = client.post('/api/capitalize', json={'text': 'hello world. this is IBM!'})
    assert res.status_code == 200
    assert res.get_json()['result'].startswith('Hello world. This is IBM!')

def test_capitalize_quotes(client):
    res = client.post('/api/capitalize', json={'text': '"quoted" sentence. wow?'})
    assert res.status_code == 200
    assert 'Wow?' in res.get_json()['result']

def test_capitalize_empty(client):
    res = client.post('/api/capitalize', json={'text': ''})
    assert res.status_code == 200
    assert res.get_json()['result'] == ''

def test_capitalize_missing(client):
    res = client.post('/api/capitalize', json={})
    assert res.status_code == 400