# Betterboxd - Deployment Guide

This guide will help you deploy the Betterboxd application on your self-hosted server using Docker.

## Prerequisites

- Docker installed (version 20.10 or higher)
- Docker Compose installed (version 2.0 or higher)
- TMDB API key (get one at https://www.themoviedb.org/settings/api)

## Quick Start

### 1. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit the `.env` file and add your TMDB API key:

```env
VITE_TMDB_API_KEY=your_actual_tmdb_api_key_here
```

### 2. Build and Start the Containers

```bash
docker compose up -d --build
```

This command will:
- Build the backend and frontend Docker images
- Start both containers in detached mode
- Create a persistent volume for the SQLite database

### 3. Access the Application

- **Frontend**: Open your browser and navigate to `http://localhost:8080` (or `http://your-server-ip:8080`)
- **Backend API**: Available at `http://localhost:3000` (or `http://your-server-ip:3000`)

## Port Configuration

The application uses the following ports:

- **Frontend**: `8080` (configurable in `docker-compose.yml`)
- **Backend**: `3000` (configurable in `docker-compose.yml`)

To change ports, edit the `docker-compose.yml` file:

```yaml
services:
  frontend:
    ports:
      - "8080:80"
  
  backend:
    ports:
      - "3000:3000"
```

## Managing the Application

### View Logs

```bash
# All services
docker compose logs -f

# Backend only
docker compose logs -f backend

# Frontend only
docker compose logs -f frontend
```

### Stop the Application

```bash
docker compose down
```

### Restart the Application

```bash
docker compose restart
```

### Rebuild After Code Changes

```bash
docker compose up -d --build
```

## Data Persistence

The SQLite database is stored in a Docker volume named `betterboxd-data`. This ensures your movie reviews persist even when containers are stopped or removed.

### Backup Your Data

```bash
# Find the volume location
docker volume inspect betterboxd-data

# Copy the database file
docker cp betterboxd-backend:/app/data/betterboxd.db ./backup-betterboxd.db
```

### Restore Data

```bash
# Copy backup to container
docker cp ./backup-betterboxd.db betterboxd-backend:/app/data/betterboxd.db

# Restart backend
docker compose restart backend
```

## Troubleshooting

### Frontend can't connect to backend

1. Check if both containers are running:
   ```bash
   docker compose ps
   ```

2. Check backend logs:
   ```bash
   docker compose logs backend
   ```

### Port already in use

If ports 8080 or 3000 are already in use:

1. Edit `docker-compose.yml` to use different ports
2. Rebuild: `docker compose up -d --build`

### Database not persisting

Ensure the volume is properly created:

```bash
docker volume ls | grep betterboxd-data
```

If missing, recreate it:

```bash
docker compose down
docker compose up -d
```

## Security Considerations

**Important**: This application has no authentication. Anyone who can access the ports can view and modify your movie reviews.

Recommended security measures:

1. **Firewall**: Use a firewall to restrict access to ports 8080 and 3000
2. **VPN**: Access the application through a VPN
3. **Reverse Proxy**: Use a reverse proxy (like Nginx Proxy Manager or Traefik) with authentication
4. **Network Isolation**: Keep the application on a private network

## Updating the Application

To update to a new version:

```bash
# Pull latest code
git pull

# Rebuild and restart
docker compose down
docker compose up -d --build
```

## Uninstalling

To completely remove the application and its data:

```bash
# Stop and remove containers
docker compose down

# Remove volume (WARNING: This deletes all your reviews!)
docker volume rm betterboxd-data

# Remove images
docker rmi betterboxd-frontend betterboxd-backend
```

## Support

For issues or questions, check the logs first:

```bash
docker compose logs -f
```

Common issues are usually related to:
- Missing or incorrect environment variables
- Port conflicts
- Network connectivity between containers
