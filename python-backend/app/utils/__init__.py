from flask import jsonify, Response
import psycopg2
from urllib.parse import urlparse

def json_response(payload: dict, status_code: int = 200) -> tuple[Response, int]:
    return jsonify(payload), status_code

def ensure_postgres_db(uri: str) -> None:
    parsed = urlparse(uri.replace("+psycopg2", ""))
    dbname = parsed.path.lstrip("/")
    if not dbname:
        return
    host = parsed.hostname or "localhost"
    port = parsed.port or 5432
    user = parsed.username or "postgres"
    password = parsed.password or "postgres"
    conn = psycopg2.connect(dbname="postgres", user=user, password=password, host=host, port=port)
    conn.autocommit = True
    cur = conn.cursor()
    cur.execute("SELECT 1 FROM pg_database WHERE datname=%s", (dbname,))
    exists = cur.fetchone()
    if not exists:
        cur.execute(f'CREATE DATABASE "{dbname}"')
    cur.close()
    conn.close()