# Chronos — Chronos Performance

Chronos is a web app for collecting and sharing real-world game performance metrics (FPS, GPU, RAM, etc.) tied to game data from IGDB. Users can search games, view game details, submit performance reports, favorite games, and view other users' reports.

## Stack

- Frontend: React + TypeScript + Vite
- UI: Mantine + Tailwind
- Backend: Node + Express (TypeScript)
- Database & Auth: Firebase (Auth + Firestore)
- External API: IGDB (via Twitch/IGDB access token)
- Deployment: Vercel (backend) + static frontend

## Main features

- Game search & details powered by IGDB
- User authentication (Google / email / anonymous) via Firebase
- Submit performance reports (FPS, settings, hardware) stored in Firestore
- User profiles and favorites
- Backend REST endpoints that proxy IGDB queries

## Project structure (high level)

- frontend/ — React app (Vite)
- backend/ — Express server (TypeScript) serving IGDB proxy routes
- common code & hooks in frontend under src/
