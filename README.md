# Hendoone

Hendoone is a short, step-based real-world puzzle game built as a full-stack web application.  
It combines a React frontend with a Django backend and MongoDB for session persistence.

Players progress through a sequence of interactive steps. Progress is tracked per device using a server-side session stored in MongoDB.

---

## Features

- Step-based puzzle flow with enforced order
- Persistent session state stored in MongoDB
- React (Vite) frontend with a clean, minimal UI
- Django REST-style backend
- Optional image upload (selfie step)
- Dockerized backend and database
- Simple admin endpoints for session inspection

---

## Tech Stack

**Frontend**
- React (Vite)
- JavaScript (ES modules)
- Fetch API

**Backend**
- Django
- Django REST Framework
- MongoDB (via PyMongo)

**Infrastructure**
- Docker & Docker Compose
- MongoDB 6

---

## Project Structure

```
.
├── backend/
│   ├── config/
│   ├── core/
│   ├── uploads/
│   ├── Dockerfile
│   └── manage.py
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   └── App.jsx
│   ├── index.html
│   └── vite.config.js
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Game Flow

1. Start session  
2. Step 0 – Secret word  
3. Step 1 – Color pattern  
4. Step 2 – Object selection  
5. Step 3 – Optional selfie upload  
6. Finish screen  

Each step is validated by the backend. A player cannot skip ahead.

---

## Environment Variables

See `.env.example` for required variables.

---

## Running Locally

```bash
docker-compose up --build
```

Backend: http://localhost:8000  
Frontend: http://localhost:5173

---

## Status

Active development.

---

## License

Private / internal use.
