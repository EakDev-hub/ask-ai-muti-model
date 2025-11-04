# 🐳 Docker Quick Reference - AI Chat Assistant

## 🚀 Getting Started

```bash
# 1. Setup environment
cp .env.docker.example .env
# Edit .env and add your OPENROUTER_API_KEY

# 2. Start application
docker-compose up -d

# 3. Open browser
# http://localhost
```

## 📋 Essential Commands

### Start & Stop
```bash
# Start (detached mode)
docker-compose up -d

# Start (see logs)
docker-compose up

# Stop
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Restart
docker-compose restart
```

### Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Last 100 lines
docker-compose logs --tail=100
```

### Build & Rebuild
```bash
# Rebuild after code changes
docker-compose up -d --build

# Force rebuild (no cache)
docker-compose build --no-cache
docker-compose up -d
```

### Status & Info
```bash
# Check status
docker-compose ps

# View resource usage
docker stats

# List images
docker images | grep ai-chat
```

### Development Mode
```bash
# Start with hot-reload
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Stop dev environment
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down
```

## 🔧 Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Restart from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Check health
```bash
# Container status
docker-compose ps

# Test backend
curl http://localhost:3001/health

# Test frontend
curl http://localhost/health
```

### Access container shell
```bash
# Backend
docker-compose exec backend sh

# Frontend
docker-compose exec frontend sh
```

## 🧹 Cleanup

```bash
# Remove containers only
docker-compose down

# Remove containers + volumes
docker-compose down -v

# Clean everything
docker-compose down -v
docker system prune -a
```

## 📊 Production

```bash
# Build production images
docker-compose build

# Tag for registry
docker tag ai-chat-backend:latest your-registry/ai-chat-backend:v1.0
docker tag ai-chat-frontend:latest your-registry/ai-chat-frontend:v1.0

# Push to registry
docker push your-registry/ai-chat-backend:v1.0
docker push your-registry/ai-chat-frontend:v1.0
```

## 🔗 URLs

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/health
- **Dev Frontend**: http://localhost:5173 (dev mode only)

## 📱 Ports

| Service | Port | Protocol |
|---------|------|----------|
| Frontend | 80 | HTTP |
| Backend | 3001 | HTTP |
| Dev Frontend | 5173 | HTTP (dev only) |

## 🎯 Common Tasks

### Update API Key
```bash
# Edit .env file
nano .env  # or vim, code, etc.

# Restart backend only
docker-compose restart backend
```

### View Environment Variables
```bash
# Inside container
docker-compose exec backend env

# From compose file
docker-compose config
```

### Export Logs
```bash
# All logs to file
docker-compose logs > logs.txt

# Specific service
docker-compose logs backend > backend-logs.txt
```

### Check Image Sizes
```bash
docker images | grep ai-chat
# Frontend: ~25MB
# Backend: ~200MB
```

## ⚡ Performance Tips

- Use `docker-compose up -d` for faster startup
- Use `--build` only when code changes
- Use `docker system prune` regularly to free space
- Monitor with `docker stats` for resource usage

## 🆘 Emergency Commands

```bash
# Kill all containers
docker kill $(docker ps -q)

# Remove all containers
docker rm $(docker ps -a -q)

# Remove all images
docker rmi $(docker images -q)

# Nuclear option (clean everything)
docker system prune -a --volumes
```

---

For detailed documentation, see [DOCKER_SETUP.md](DOCKER_SETUP.md)