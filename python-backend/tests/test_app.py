from app.models import Item
from app.core.extensions import db
import os
import pytest


def test_health_endpoint(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.get_json()["status"] == "ok"


def test_items_get(client):
    with client.application.app_context():
        with db.session.begin():
            db.session.add(Item(name="alpha"))
            db.session.add(Item(name="beta"))
    res = client.get("/api/items")
    assert res.status_code == 200
    assert "items" in res.get_json()
    assert set(res.get_json()["items"]) == {"alpha", "beta"}


def test_items_post(client):
    res = client.post("/api/items", json={"item": "delta"})
    assert res.status_code == 201
    assert "delta" in res.get_json()["items"]