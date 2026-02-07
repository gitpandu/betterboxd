# Betterboxd

A self-hosted movie diary app. Track movies you've watched, rate them, and write reviews.

## Features

- Search movies via TMDB API
- Rate movies (0.5 - 5 stars)
- Mark favorites
- Write reviews
- Filter and sort your diary

## Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Backend**: Node.js + Express + SQLite
- **Deployment**: Docker + Nginx

## Quick Start

### Prerequisites

- Docker & Docker Compose
- TMDB API key ([get one here](https://www.themoviedb.org/settings/api))

### Deploy

1. Clone the repo:
   ```bash
   git clone https://github.com/gitpandu/betterboxd.git
   cd betterboxd
   ```

2. Create environment file:
   ```bash
   cp .env.example .env
   # Edit .env and add your TMDB API key
   ```

3. Run:
   ```bash
   docker compose up -d --build
   ```

4. Open `http://localhost:8080`

## Ports

| Service  | Port |
|----------|------|
| Frontend | 8080 |
| Backend  | 3000 |

## Configuration

Edit `docker-compose.yml` to change ports or other settings.

## License

MIT
