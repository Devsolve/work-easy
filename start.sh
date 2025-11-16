#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_PID_FILE="$ROOT_DIR/.backend.pid"

# Kill if ports are already in use (stale dev servers)
if lsof -ti tcp:5002 >/dev/null 2>&1; then
  lsof -ti tcp:5002 | xargs kill -9 || true
fi
if lsof -ti tcp:3001 >/dev/null 2>&1; then
  lsof -ti tcp:3001 | xargs kill -9 || true
fi

# Start Python backend (Flask) on 5002
(
  cd "$ROOT_DIR/python-backend"
  # Ensure venv and dependencies
  if [ ! -d .venv ]; then
    python3 -m venv .venv
    ./.venv/bin/pip install --upgrade pip
  fi
  ./.venv/bin/pip install -r requirements.txt

  # Environment configuration
  ENV=${ENV:-development}
  PORT=${PORT:-5002}
  DATABASE_URL=${DATABASE_URL:-postgresql+psycopg2://postgres:postgres@localhost:5432/work_easy_dev}

  ENV="$ENV" PORT="$PORT" DATABASE_URL="$DATABASE_URL" ./.venv/bin/python run.py &
  echo $! > "$BACKEND_PID_FILE"
)

cleanup() {
  if [ -f "$BACKEND_PID_FILE" ]; then
    PID="$(cat "$BACKEND_PID_FILE")"
    if ps -p "$PID" > /dev/null 2>&1; then
      kill "$PID" || true
    fi
    rm -f "$BACKEND_PID_FILE"
  fi
}
trap cleanup EXIT INT TERM

# Start React frontend on 3001
(
  cd "$ROOT_DIR/frontend-react"
  if [ ! -d node_modules ]; then
    npm install
  fi
  npm run dev -- --port 3001 --open
)