# Deployment Guide

## Deployment Overview

This project uses GitHub Actions for automated deployment. Each push to the `main` branch triggers the CI/CD pipeline.

## Automated Deployment

### Pipeline Trigger

Deployment is triggered by:
1. Push to `main` branch with changes in `frontend/` or `backend/`
2. Manual workflow dispatch via GitHub Actions

### Pipeline Flow

1. **Lint Check**: Code quality verification
2. **Unit Tests**: Automated test execution
3. **Docker Build**: Multi-arch image creation (amd64 + arm64)
4. **Push to Registry**: Images pushed to ghcr.io
5. **Deploy**: SSH to server and update containers

### Monitoring Deployment

1. Go to repository Actions tab
2. Click on the running workflow
3. Monitor each job's progress
4. Check logs for any failures

## Manual Deployment

### SSH to Server

```bash
ssh deploy@37.27.25.159
cd /opt/devops
```

### Pull Latest Images

```bash
# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Pull images
docker compose -f docker-compose.staging.yml pull
```

### Deploy Services

```bash
# Deploy all services
docker compose -f docker-compose.staging.yml up -d

# Deploy specific service
docker compose -f docker-compose.staging.yml up -d frontend
docker compose -f docker-compose.staging.yml up -d backend
```

### Verify Deployment

```bash
# Check container status
docker ps

# Check health endpoints
curl http://localhost/
curl http://localhost:8000/health

# Check logs
docker compose -f docker-compose.staging.yml logs -f
```

## Rollback Procedures

### Rollback to Previous Version

```bash
# List available image tags
docker images ghcr.io/pedramnj/devops-frontend
docker images ghcr.io/pedramnj/devops-backend

# Deploy specific version
export IMAGE_TAG=<previous_sha>
docker compose -f docker-compose.staging.yml up -d
```

### Emergency Rollback

```bash
# Stop all services
docker compose -f docker-compose.staging.yml down

# Pull specific version
export IMAGE_TAG=<known_good_sha>
docker compose -f docker-compose.staging.yml pull
docker compose -f docker-compose.staging.yml up -d
```

## Zero-Downtime Deployment

The current setup provides near-zero-downtime deployment:

1. New image is pulled
2. Container is recreated with new image
3. Health check verifies service is running

For true zero-downtime:
- Implement blue-green deployment
- Add load balancer with health checks
- Use container orchestration (Kubernetes)

## Environment Management

### Staging Environment

- Server: 37.27.25.159
- Frontend: http://37.27.25.159
- Backend: http://37.27.25.159:8000

### Environment Variables

Update environment variables in `docker-compose.staging.yml`:

```yaml
environment:
  - DEBUG=false
  - CORS_ORIGINS=http://your-domain.com
```

## Maintenance Tasks

### Clean Up Old Images

```bash
# Remove unused images
docker image prune -f

# Remove all unused data
docker system prune -f
```

### Check Disk Space

```bash
# Check disk usage
df -h

# Check Docker disk usage
docker system df
```

### View Service Logs

```bash
# All services
docker compose -f docker-compose.staging.yml logs -f

# Specific service
docker compose -f docker-compose.staging.yml logs -f frontend
docker compose -f docker-compose.staging.yml logs -f backend

# Last N lines
docker compose -f docker-compose.staging.yml logs --tail=100 backend
```

## Troubleshooting

### Container Won't Start

1. Check logs: `docker compose logs <service>`
2. Check image exists: `docker images`
3. Check port conflicts: `netstat -tlnp`

### Health Check Failing

1. Verify endpoints manually: `curl localhost:8000/health`
2. Check container logs
3. Verify environment variables

### Deployment Stuck

1. Check GitHub Actions logs
2. Verify SSH connectivity
3. Check server resources (disk, memory)

### Network Issues

```bash
# Restart Docker network
docker compose -f docker-compose.staging.yml down
docker compose -f docker-compose.staging.yml up -d

# Recreate network
docker network prune
```
