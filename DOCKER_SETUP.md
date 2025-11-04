# 🐳 Docker Setup Guide - AI Chat Assistant

Complete guide for running the AI Chat Assistant application using Docker.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Docker Architecture](#docker-architecture)
- [Configuration](#configuration)
- [Docker Commands](#docker-commands)
- [Troubleshooting](#troubleshooting)
- [Advanced Usage](#advanced-usage)
- [Production Deployment](#production-deployment)

## Overview

This application uses Docker Compose to orchestrate two services:
- **Backend** - Node.js Express API (Port 3001)
- **Frontend** - React app served by Nginx (Port 80)

### Benefits of Using Docker

✅ **No manual setup** - No need to install Node.js or manage dependencies  
✅ **Consistent environment** - Works the same on any system  
✅ **Isolated** - Doesn't conflict with other applications  
✅ **Easy cleanup** - Remove everything with one command  
✅ **Production-ready** - Same setup for development and production  

## Prerequisites

### Required

- **Docker Desktop** (includes Docker and Docker Compose)
  - [Windows](https://docs.docker.com/desktop/install/windows-install/)
  - [Mac](https://docs.docker.com/desktop/install/mac-install/)
  - [Linux](https://docs.docker.com/desktop/install/linux-install/)

- **OpenRouter API Key**
  - Sign up at [OpenRouter.ai](https://openrouter.ai/)
  - Navigate to API Keys section
  - Create a new key

### Verify Installation

```bash
# Check Docker version
docker --version
# Expected: Docker version 20.10.x or higher

# Check Docker Compose version
docker-compose --version
# Expected: Docker Compose version 2.x.x or higher
```

## Quick Start

### 1. Navigate to Project Directory

```bash
cd idcardread
```

### 2. Create Environment File

```bash
# Copy the example file
cp .env.docker.example .env

# Edit the file (use your preferred editor)
nano .env
# or
vim .env
# or
code .env
```

### 3. Add Your API Key

Edit `.env` and replace the placeholder:

```env
OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
```

### 4. Start the Application

```bash
docker-compose up -d
```

This command will:
1. Build Docker images for frontend and backend
2. Create a network for service communication
3. Start both containers in detached mode
4. Set up health checks

### 5. Verify It's Running

```bash
# Check container status
docker-compose ps

# Expected output:
# NAME                  STATUS              PORTS
# ai-chat-backend       Up (healthy)        0.0.0.0:3001->3001/tcp
# ai-chat-frontend      Up (healthy)        0.0.0.0:80->80/tcp
```

### 6. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:3001/health
- **API Endpoint**: http://localhost:3001/api/chat

## Docker Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Host                          │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │          ai-chat-network (bridge)                │  │
│  │                                                  │  │
│  │  ┌─────────────────┐      ┌──────────────────┐  │  │
│  │  │   Frontend      │      │    Backend       │  │  │
│  │  │  (nginx:alpine) │─────▶│  (node:18-alpine)│  │  │
│  │  │                 │      │                  │  │  │
│  │  │  Port: 80       │      │  Port: 3001      │  │  │
│  │  │  Health: /health│      │  Health: /health │  │  │
│  │  └─────────────────┘      └──────────────────┘  │  │
│  │         │                         │             │  │
│  └─────────┼─────────────────────────┼─────────────┘  │
│            │                         │                │
│            ▼                         ▼                │
│    localhost:80              localhost:3001           │
└─────────────────────────────────────────────────────────┘
```

### Image Details

#### Backend Image
- **Base**: `node:18-alpine` (lightweight Linux)
- **Size**: ~200MB
- **Contents**: Node.js app + dependencies
- **Exposed Port**: 3001

#### Frontend Image
- **Build Stage**: `node:18-alpine` (builds React app)
- **Serve Stage**: `nginx:alpine` (serves static files)
- **Size**: ~25MB (after multi-stage build)
- **Exposed Port**: 80

## Configuration

### Environment Variables

The `.env` file controls the Docker environment. Here are all available options:

#### Required

```env
# Your OpenRouter API key (REQUIRED)
OPENROUTER_API_KEY=sk-or-v1-xxxxx
```

#### Optional (with defaults)

```env
# Backend Configuration
PORT=3001                           # Backend server port
NODE_ENV=production                 # Node environment
FRONTEND_URL=http://localhost       # CORS allowed origin

# Frontend Configuration
VITE_API_URL=http://localhost:3001/api  # Backend API endpoint
VITE_APP_NAME=AI Chat Assistant         # Application name
VITE_APP_VERSION=1.0.0                  # Application version

# Docker Ports (change if conflicts with existing services)
FRONTEND_PORT=80                    # Frontend external port
BACKEND_PORT=3001                   # Backend external port
```

### Custom Ports

If port 80 is already in use, you can change it:

1. Edit `docker-compose.yml`:
   ```yaml
   frontend:
     ports:
       - "8080:80"  # Changed from 80:80
   ```

2. Access at http://localhost:8080

## Docker Commands

### Basic Operations

```bash
# Start services (detached mode)
docker-compose up -d

# Start services (attached mode - see logs)
docker-compose up

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Restart services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Last 100 lines
docker-compose logs --tail=100

# Since specific time
docker-compose logs --since 2024-01-01T00:00:00
```

### Building and Rebuilding

```bash
# Build images
docker-compose build

# Build specific service
docker-compose build backend

# Rebuild and start (after code changes)
docker-compose up -d --build

# Force rebuild (ignore cache)
docker-compose build --no-cache
```

### Container Management

```bash
# List running containers
docker-compose ps

# View detailed container info
docker inspect ai-chat-backend

# Execute command in container
docker-compose exec backend sh
docker-compose exec frontend sh

# View resource usage
docker stats
```

### Cleanup

```bash
# Stop and remove containers
docker-compose down

# Remove containers, networks, and volumes
docker-compose down -v

# Remove unused images
docker image prune

# Remove all unused Docker resources
docker system prune -a
```

## Troubleshooting

### Container Won't Start

**Problem**: Container exits immediately

```bash
# Check logs for errors
docker-compose logs backend
docker-compose logs frontend
```

**Common causes**:
- Missing API key in `.env`
- Port already in use
- Syntax error in code

**Solutions**:
```bash
# Verify environment file
cat .env

# Check port usage
lsof -i :3001  # macOS/Linux
netstat -ano | findstr :3001  # Windows

# Rebuild with clean cache
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Health Check Failing

**Problem**: Container shows as unhealthy

```bash
# Check health status
docker-compose ps

# View health check logs
docker inspect ai-chat-backend | grep -A 20 Health
```

**Solution**:
```bash
# Wait 30-60 seconds for startup
# Then check logs
docker-compose logs backend
```

### Can't Connect to Application

**Problem**: Browser shows "Can't connect"

**Checks**:
```bash
# 1. Verify containers are running
docker-compose ps

# 2. Test backend health
curl http://localhost:3001/health

# 3. Test frontend
curl http://localhost/health

# 4. Check Docker network
docker network ls
docker network inspect ai-chat-network
```

### Image Build Fails

**Problem**: Build errors during `docker-compose build`

**Solutions**:
```bash
# Clear Docker cache
docker builder prune

# Rebuild without cache
docker-compose build --no-cache

# Check Dockerfile syntax
docker-compose config
```

### Permission Issues (Linux)

**Problem**: Permission denied errors

**Solution**:
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Logout and login again
# Or restart Docker service
sudo systemctl restart docker
```

### Port Conflicts

**Problem**: "Port is already allocated"

**Solution**:
```bash
# Find process using port
lsof -i :80  # macOS/Linux
netstat -ano | findstr :80  # Windows

# Stop conflicting service or change port in docker-compose.yml
```

## Advanced Usage

### Development Mode with Hot Reload

Create `docker-compose.dev.yml`:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    volumes:
      - ./backend:/app
      - /app/node_modules
    command: npm run dev
    environment:
      - NODE_ENV=development

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: npm run dev
    ports:
      - "5173:5173"
```

Run with:
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Accessing Container Shell

```bash
# Backend container
docker-compose exec backend sh

# Frontend container
docker-compose exec frontend sh

# Run as root
docker-compose exec -u root backend sh
```

### Viewing Environment Variables

```bash
# Inside container
docker-compose exec backend env

# From docker-compose
docker-compose config
```

### Database/Redis Integration

Add to `docker-compose.yml`:

```yaml
services:
  # ... existing services ...
  
  redis:
    image: redis:alpine
    container_name: ai-chat-redis
    ports:
      - "6379:6379"
    networks:
      - ai-chat-network
    volumes:
      - redis-data:/data

volumes:
  backend-logs:
  redis-data:  # Add this
```

## Production Deployment

### Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml ai-chat

# List services
docker service ls

# Scale services
docker service scale ai-chat_backend=3
```

### Cloud Platforms

#### AWS ECS

1. Push images to ECR
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin xxxxx.dkr.ecr.us-east-1.amazonaws.com
docker tag ai-chat-backend:latest xxxxx.dkr.ecr.us-east-1.amazonaws.com/ai-chat-backend:latest
docker push xxxxx.dkr.ecr.us-east-1.amazonaws.com/ai-chat-backend:latest
```

2. Create ECS task definition
3. Create ECS service

#### Heroku Container Registry

```bash
heroku container:login
heroku container:push web --app your-app-name
heroku container:release web --app your-app-name
```

### Security Best Practices

1. **Never commit .env file**
2. **Use secrets management** (Docker Swarm secrets, AWS Secrets Manager)
3. **Run as non-root user** (already configured in Dockerfiles)
4. **Scan images for vulnerabilities**
   ```bash
   docker scan ai-chat-backend
   ```
5. **Use specific image versions** (avoid `latest` tag in production)
6. **Enable HTTPS** (use reverse proxy like Traefik or nginx)

### Monitoring

```bash
# Resource usage
docker stats

# Export metrics (Prometheus compatible)
docker-compose exec backend curl http://localhost:3001/metrics

# Logs with timestamps
docker-compose logs -f --timestamps
```

## Performance Optimization

### Multi-stage Build Benefits

The frontend Dockerfile uses multi-stage builds:
- **Build stage**: Compiles React app (discarded)
- **Runtime stage**: Only serves static files
- **Result**: 90% smaller image size

### Image Size Comparison

```bash
# View image sizes
docker images | grep ai-chat

# Expected sizes:
# ai-chat-frontend: ~25MB
# ai-chat-backend:  ~200MB
```

### Caching Strategy

Docker caches layers. Optimize by:
1. Copy `package.json` first
2. Run `npm install`
3. Copy source code last

This ensures npm install only runs when dependencies change.

## Useful Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Best Practices for Writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Docker Security](https://docs.docker.com/engine/security/)

## Support

If you encounter issues:

1. Check this troubleshooting guide
2. Review container logs: `docker-compose logs -f`
3. Verify environment variables: `cat .env`
4. Test backend health: `curl http://localhost:3001/health`
5. Rebuild from scratch: `docker-compose down -v && docker-compose up -d --build`

---

**Made with 🐳 Docker for easy deployment**