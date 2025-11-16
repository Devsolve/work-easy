# Full-Stack Python + React Project

## Overview
- Python backend on `5002` using Flask and class-based views
- React TypeScript frontend on `3001` using Vite
- Works concurrently with existing Node.js backend `5001` and frontend `3000`
- CORS enabled for cross-origin API calls
- Shared constants and utilities in dedicated files on both sides

## Project Structure
- `python-backend/` backend application
- `frontend-react/` frontend application
- `.github/workflows/` CI workflows for both apps

## Backend (Flask)
- Entry: `python-backend/run.py`
- Config: `python-backend/app/config.py` reads `.env` via `python-dotenv`
- Constants: `python-backend/app/constants.py`
- Utils: `python-backend/app/utils.py`
- Views: `python-backend/app/views.py` with `MethodView` classes
- Port: `5002` configurable via `PORT`
- CORS origins: `CORS_ORIGINS` supports `http://localhost:3000,http://localhost:3001`

### Commands
- Create venv: `python3 -m venv .venv` in `python-backend`
- Activate venv (macOS): `source .venv/bin/activate`
- Install: `pip install -r requirements.txt`
- Run dev: `python run.py`
- Test: `pytest -q`
- Lint: `black --check . && flake8 .`

## Frontend (React + Vite + TS)
- Entry: `frontend-react/src/main.tsx`
- App: `frontend-react/src/App.tsx`
- Reusable components: `frontend-react/src/components/`
- Constants: `frontend-react/src/constants.js`
- Utils: `frontend-react/src/utils.js`
- Dev server port: `3001`
- Env: `frontend-react/.env.development` sets `VITE_API_URL`

### Commands
- Install: `npm install` in `frontend-react`
- Dev: `npm run dev`
- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Test: `npm test`
- Build: `npm run build`

## Environment Configuration
- Backend `.env` values:
  - `ENV=development|production`
  - `PORT=5002`
  - `CORS_ORIGINS=http://localhost:3000,http://localhost:3001`
- Frontend env:
  - `.env.development`: `VITE_API_URL=http://localhost:5002`
  - `.env.production`: `VITE_API_URL=/api`

## API Endpoints
- `GET /api/health` returns `{ status: "ok" }`
- `GET /api/items` returns `{ items: [...] }`
- `POST /api/items` with `{ item: string }` returns updated list

## Concurrency
- Existing Node backend: `5001`
- Existing Node frontend: `3000`
- New Python backend: `5002`
- New React frontend: `3001`
- Frontend proxies `/api` to `http://localhost:5002`

## CI/CD
- Frontend workflow: install, lint, typecheck, test, build
- Backend workflow: install, lint (black, flake8), test (pytest)

## Architecture Notes
- Class-based views via `flask.views.MethodView`
- Shared code split into `constants` and `utils` modules
- Strict TypeScript settings with JS interop for shared `.js` modules
- Vite proxy for local API communication

## Running Everything Together
- Start existing Node backend `5001`
- Start existing Node frontend `3000`
- Start Python backend `5002`
- Start React frontend `3001`
- Access new frontend at `http://localhost:3001`