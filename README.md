# Hendoone

Hendoone is a short, step-based real-world puzzle game. Players complete a small sequence of lightweight challenges and submit a selfie as proof of completion. An admin interface allows reviewing sessions and downloading submitted images.

The project is implemented as a small, self-contained full-stack app with a Django API, a Vite + React frontend, and a Docker-first setup intended to run behind a single origin.

---

## Gameplay flow

1) Session start (word gate)  
2) Color pattern challenge  
3) Object count challenge  
4) Selfie upload + consent  
5) Completion → final code  

All gameplay is session-based and anonymous. Requests rely on cookies rather than user accounts.

---

## Project structure

- `backend/` — Django API and MongoDB integration  
- `frontend/` — Vite + React app (game flow + admin panel)  
- `docker-compose.yml` — backend, MongoDB, frontend wiring  
- `deploy/` — example reverse-proxy configuration  

---

## Stack

- **Backend:** Django, MongoDB (PyMongo)  
- **Frontend:** React (Vite), `fetch` with cookie-based sessions  
- **Infra:** Docker Compose  

---

## Run locally (Docker)

### Prerequisites
- Docker and Docker Compose

### Setup

1) Copy `.env.example` → `.env` (repo root) and set values, especially:
   - `DJANGO_SECRET_KEY`
   - `DJANGO_DEBUG`
   - `MONGO_URI`, `MONGO_DB_NAME`
   - `UPLOAD_DIR` (selfie storage)
   - `ADMIN_PASSWORD` (admin login)

2) Build and start services:
   ```bash
   docker compose up --build
   ```

Backend will be available at `http://localhost:8000`.

---

## Frontend development (optional)

For frontend-only iteration, you can run the backend via Docker and the Vite dev server locally.

1) Copy `frontend/.env.example` → `frontend/.env` and adjust if needed:
   - `VITE_DEV_PORT=5173`
   - `VITE_BACKEND_URL=http://localhost:8000`
   - `VITE_API_BASE=/api`

2) Start the dev server:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Frontend runs at `http://localhost:5173`.  
The dev server proxies `/api`, `/admin`, and `/uploads` to the backend and preserves cookies.

---

## Admin panel & access model

- Admin UI: `/admin-panel`
- Login endpoint: `/api/admin/login/`
- Authentication is password-based via `ADMIN_PASSWORD`
- Successful login sets an `admin_auth` HttpOnly cookie

Admin capabilities:
- List and search sessions
- View and download submitted selfies

Uploads are served at:
```
/uploads/<session_id>/<filename>
```
Access requires the admin cookie.

There are no user accounts; gameplay sessions are anonymous.

---

## Deployment notes

- Intended to run behind a single reverse proxy (e.g. Nginx)
- Recommended routing:
  - `/` → frontend
  - `/api/` → backend
  - `/uploads/` → backend
  - `/admin/` → backend (optional)

A reference configuration is provided at:
```
deploy/nginx.example.conf
```

Frontend builds should use:
```
VITE_API_BASE=/api
```
to keep all requests on the same origin.

---

## Notes

- Selfies are stored on disk under `UPLOAD_DIR`
- Cookies are required for both gameplay sessions and admin access
- `.env` files should not be committed; `.env.example` documents required keys
