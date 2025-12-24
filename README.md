# Hendoone

Hendoone is a short, step-based real-world puzzle game. Players solve a few lightweight challenges and upload a selfie; admins can review sessions and downloaded selfies. The project ships with a Django API, a Vite + React frontend, and Docker Compose for local and deployment use.

## What lives where
- Backend (Django + MongoDB): `backend/core/views.py` holds the API for steps, selfies, and admin login; `backend/core/mongo.py` handles Mongo connections. Selfies are stored on disk under `UPLOAD_DIR` and are served via `/uploads/<session>/<filename>` (admin cookie required).
- Frontend (Vite + React): `frontend/src/AppGame.jsx` runs the player flow (word gate, color pattern, object counts, selfie upload, final code). `frontend/src/pages/AdminPanel.jsx` is a lightweight admin search/download UI. API calls live in `frontend/src/api/client.js` and always include cookies.
- Compose / infra: `docker-compose.yml` wires backend, Mongo, frontend, and an nginx reverse proxy. `deploy/nginx.conf` is the default proxy used by Compose; `deploy/nginx.example.conf` is a starting point for your own domain/TLS setup.

## Prerequisites
- Docker and Docker Compose
- Optional for non-Docker dev: Node.js 20+ and npm (frontend), Python 3.11+ (backend)

## Configuration
Copy `.env.example` to `.env` in the repo root and fill values. Suggested local values (work with the provided Compose services):
```
DJANGO_SECRET_KEY=dev-change-me
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=*
MONGO_URI=mongodb://mongo:27017/hendoone
MONGO_DB_NAME=hendoone
UPLOAD_DIR=/app/uploads
ADMIN_PASSWORD=choose-a-strong-password
FRONTEND_ORIGIN=http://localhost:8080
```
Notes:
- `UPLOAD_DIR` must match the path mounted into the backend container (Compose already mounts `./backend/uploads` to `/app/uploads`).
- `ADMIN_PASSWORD` controls admin login at `/api/admin/login/`; the admin cookie (`admin_auth`) is required to view `/uploads/...`.
- Frontend builds default to `VITE_API_BASE=/api`; override with `--build-arg VITE_API_BASE=...` if you host the API elsewhere or behind a different path.

## Run locally with Docker
1) Create `.env` as above.
2) Build and start everything:  
   `docker compose up --build`
3) Open the app at `http://localhost:8080` (nginx → frontend). The game will start a session via `/api/session/` and proceed through the steps.
4) Admin panel: `http://localhost:8080/admin-panel` (authenticate with `ADMIN_PASSWORD`). Selfie downloads use `/uploads/<session_id>/selfie.<ext>`.
5) Data is persisted via the `mongo_data` volume (MongoDB) and `./backend/uploads` (selfies).

For frontend-only development, you can still run `docker compose up mongo backend` and then `npm install && npm run dev` inside `frontend/`, hitting `http://localhost:5173`.

## Deployment hints
- Build and run with Compose (or similar): `docker compose --env-file .env up -d --build`. Set `DJANGO_DEBUG=False`, a strong `DJANGO_SECRET_KEY`, and a restrictive `DJANGO_ALLOWED_HOSTS` (your domain).
- Reverse proxy: Start from `deploy/nginx.example.conf`; set `server_name` to your domain and add TLS. Routes should keep everything on one origin: `/` → frontend, `/api/` → backend, `/uploads/` → backend or a file alias to the uploads volume, `/admin/` → backend (optional).
- Frontend build args: ensure `VITE_API_BASE` points to the API path you expose (commonly `/api`). If you serve the static build from another host, make it an absolute URL.
- Storage: persist Mongo data and the uploads directory across deploys. Make sure nginx (or your proxy) can read the uploads path if you use `alias`; otherwise proxy to the backend `/uploads/` route.
- Environment reminders: keep `.env` out of version control, rotate `ADMIN_PASSWORD` periodically, and consider enabling HTTPS and stricter cookies (`secure=True`) in production.
