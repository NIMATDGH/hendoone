# Frontend Dev Notes

This Vite + React app proxies `/api` to the Django backend for local dev and keeps cookies intact.

- Backend: `docker compose up --build`
- Frontend: `cd frontend && npm install && npm run dev`
- App: open [http://localhost:5173](http://localhost:5173)

The app loads by POSTing `/api/session/` (with credentials) then GETting `/api/state/` and prints the combined JSON.
