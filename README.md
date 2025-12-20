# Hendoone

Short, step-based real-world puzzle game with a Django backend and Vite + React frontend.

## Stack
- Backend: Django, MongoDB (PyMongo)
- Frontend: React (Vite), fetch with cookie-based sessions
- Infra: Docker Compose

## Repo layout
- `backend/` — Django app and API
- `frontend/` — Vite + React app (game + admin panel)
- `docker-compose.yml` — backend + MongoDB
- `deploy/` — example reverse-proxy config

## Prereqs
- Docker & Docker Compose
- Node.js 18+ and npm (for frontend dev server)

## Backend setup
1) Copy `.env.example` → `.env` (repo root) and set values, especially:
   - `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `MONGO_URI`, `MONGO_DB_NAME`
   - `UPLOAD_DIR` (for selfies)
   - `ADMIN_PASSWORD` (for admin login)
2) Start backend + MongoDB:
   ```bash
   docker compose up --build
   ```
   Backend listens on `http://localhost:8000`.

## Frontend setup
1) Copy `frontend/.env.example` → `frontend/.env` and adjust if needed:
   - `VITE_DEV_PORT=5173`
   - `VITE_BACKEND_URL=http://localhost:8000`
   - `VITE_API_BASE=/api`
2) Install deps and run dev server:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`.

## Gameplay flow
1) Session start (Step 0 word gate)
2) Step 1 color pattern
3) Step 2 object numbers
4) Step 3 selfie upload + consent
5) Finish → final code
All requests include cookies (`credentials: "include"`). Dev proxy forwards `/api`, `/admin`, `/uploads` to the backend.

## Admin panel
- UI at `http://localhost:5173/admin-panel`
- Login posts to `/api/admin/login/` with the password set in `ADMIN_PASSWORD`; sets `admin_auth` HttpOnly cookie.
- Sessions list/search uses `/api/admin/sessions/`; selfie thumbnails use `/uploads/<session_id>/<filename>`.

## Deployment (with your own reverse proxy / Nginx)
- This repo does not include Nginx; run your own reverse proxy.
- Recommended routing (single origin):
  - `/` -> frontend
  - `/api/` -> backend
  - `/uploads/` -> backend
  - `/admin/` -> backend (optional)
- Reference config: `deploy/nginx.example.conf`
- Frontend build should use relative API base: `VITE_API_BASE=/api`

## Notes
- Selfie upload path is `/uploads/<session_id>/<filename>`; admin cookie required to view/download.
- Vite dev server proxies `/api`, `/admin`, `/uploads` to the backend (values controlled by env).
- Keep `.env` files out of VCS; `.env.example` files show required keys.
