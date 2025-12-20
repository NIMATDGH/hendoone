```md
# Hendoone

Hendoone is a **mobile-first**, **session-based** puzzle game.

- No accounts, no login for players
- **One browser = one anonymous session**
- Backend is the **source of truth** (MongoDB stores progress)
- Frontend is UI only (renders steps, sends answers)
- Admin can review completed sessions (code + selfie) in a **frontend admin panel**

---

## Tech stack

- Backend: Django + PyMongo
- Database: MongoDB
- Frontend: React (Vite)
- Storage: local disk uploads (`backend/uploads` mounted into the backend container)

---

## Project structure

```

.
├── backend/              # Django app
├── frontend/             # React (Vite) app
├── docker-compose.yml
├── .env                  # local secrets (not committed)
└── .env.example          # template for deploy

````

---

## Environment variables

### Backend (root `.env`)

Create a `.env` in the repo root:

```bash
cp .env.example .env
````

Key variables (examples):

```env
DJANGO_SECRET_KEY=change-me
DJANGO_DEBUG=1
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

MONGO_URI=mongodb://mongo:27017
MONGO_DB_NAME=hendoone

UPLOAD_DIR=/app/uploads

ADMIN_PASSWORD=change-me
```

Notes:

* `UPLOAD_DIR` is the path **inside** the backend container. With the default docker-compose volume, uploads end up in `backend/uploads` on your host.
* `ADMIN_PASSWORD` is used to login to the frontend admin panel.

### Frontend (`frontend/.env`)

Vite exposes env vars only if they start with `VITE_`.

Create:

```bash
cd frontend
cp .env.example .env
```

Example:

```env
VITE_DEV_PORT=5173
VITE_BACKEND_URL=http://localhost:8000
VITE_API_BASE=/api
```

---

## Run the project (local dev)

### 1) Start backend + Mongo with Docker

From repo root:

```bash
docker compose up --build
```

Backend runs on:

* `http://localhost:8000`

### 2) Start frontend (Vite dev server)

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

* `http://localhost:5173`

---

## Important URLs

### Player

* Frontend: `http://localhost:5173/`

### Backend API

* Health: `GET http://localhost:8000/api/health/`
* Create/resume session: `POST http://localhost:8000/api/session/`
* Current state: `GET http://localhost:8000/api/state/`

### Admin

* Frontend admin panel: `http://localhost:5173/admin-panel`
* Django admin (backend): `http://localhost:8000/admin/`

---

## Gameplay API (summary)

All gameplay endpoints are under `/api/`:

* `POST /api/session/`
  Create/resume session. Sets `session_id` (HTTP-only cookie).

* `GET /api/state/`
  Returns session progress and current step.

* `POST /api/step0/word/`
  Body: `{ "word": "..." }`

* `POST /api/step1/color/`
  Body: `{ "colors": ["red","blue","green","yellow"] }`

* `POST /api/step2/objects/`
  Body: `{ "answers": [12,7,4,19,3,8] }`

* `POST /api/step3/selfie/`
  `multipart/form-data` with:

  * `file` (image)
  * `retain` (boolean)

* `POST /api/finish/`
  Returns `{ "success": true, "final_code": "......" }`. Code is permanent per session.

---

## Admin panel behavior

### Login

Admin panel login calls:

* `POST /api/admin/login/` with JSON `{ "password": "..." }`

Backend sets `admin_auth` cookie (HTTP-only). Password is checked against `ADMIN_PASSWORD` in backend `.env`.

### List/search completed sessions

Admin panel uses:

* `GET /api/admin/sessions/?q=...&limit=...`

Search supports partial match of:

* `session_id`
* `final_code`

Recommended behavior: only show completed sessions (sessions with `final_code`).

### View and download selfies

Uploads are served via:

* `GET /uploads/<session_id>/<filename>`
* Add `?download=1` to force download

Uploads are admin-protected (requires valid `admin_auth` cookie).

---

## Quick testing

### Health check

```bash
curl http://localhost:8000/api/health/
```

### PowerShell notes

In PowerShell, `curl` is often an alias for `Invoke-WebRequest`.

Example:

```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/session/" -Method POST
```

---

## Troubleshooting

### Docker build fails to pull base images (TLS timeout)

This is usually a Docker Hub network/proxy/DNS issue.

Things to try:

* Remove any Docker registry mirrors in Docker Desktop settings
* Set Docker Engine DNS to `1.1.1.1` and `8.8.8.8`
* Try a different network / VPN / hotspot for first-time image pulls

### Admin panel shows “No selfie” for every session

Usually means the backend list endpoint isn’t returning a usable selfie link (e.g., `selfie_url`) or the frontend isn’t proxying `/uploads` in dev.

Ensure:

* backend admin sessions response includes selfie path (filename or URL)
* frontend dev proxy includes `/uploads` → backend

---

## License

Private project (add license later if needed).

```
::contentReference[oaicite:0]{index=0}
```
