# YEK Landing Page

This project is split into two subfolders:

- `frontend`: React + Vite landing page
- `backend`: Node.js + Express API

## Run Locally

Install everything from the project root:

```bash
npm install
npm run install:all
```

Start the backend and frontend together:

```bash
npm run dev
```

The frontend runs on `http://127.0.0.1:5173`. The backend runs on `http://127.0.0.1:4000`.

The landing page calls `http://127.0.0.1:4000/api/landing` directly and falls back to built-in demo data if the backend is not running.

Backend API routes:

- `GET /api/landing`
- `GET /api/counties`
- `GET /api/highways`

To point the frontend at a different backend URL, set:

```bash
VITE_API_BASE_URL=http://127.0.0.1:4000
```
