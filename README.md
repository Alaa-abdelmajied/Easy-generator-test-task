# Full Stack Authentication App

A simple authentication application built with NestJS (backend) and React (frontend).

## Quick Start

### Backend

```bash
cd backend
npm install
npm run start:dev
```

Server runs on http://localhost:3000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs on http://localhost:5173

## Running Tests

```bash
cd backend
npm test
```

## API Documentation

Swagger docs available at: http://localhost:3000/api/docs

## Logging

Logs are output to both the console and files located in `backend/logs/`:
- `error.log` - Error-level logs only
- `app.log` - All logs

## Environment Variables

> **Note:** The `.env` files are included in this repo for ease of running and testing. In a real project, these would be in `.gitignore` and only `.env.example` would be committed.

If the frontend port changes, update `FRONTEND_URL` in `backend/.env` to match (used for CORS).
