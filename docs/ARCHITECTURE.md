# Architecture Documentation

## System Overview

This project implements a microservices architecture with two main services:

1. **Frontend Service**: React SPA served via Nginx
2. **Backend Service**: FastAPI REST API

Both services are containerized using Docker and deployed to a staging environment via GitHub Actions.

## Component Details

### Frontend Service

**Technology Stack:**
- React 19 with TypeScript
- Vite for build tooling
- Nginx for production serving

**Docker Configuration:**
- Multi-stage build (Node builder -> Nginx production)
- Health check via wget
- Gzip compression enabled
- SPA routing with try_files

**Responsibilities:**
- User interface rendering
- API calls to backend
- Client-side routing

### Backend Service

**Technology Stack:**
- FastAPI (Python web framework)
- Uvicorn (ASGI server)
- Pydantic (data validation)

**Docker Configuration:**
- Multi-stage build (pip install -> slim runtime)
- Non-root user for security
- Health check via Python urllib

**Responsibilities:**
- REST API endpoints
- Business logic
- Data validation

## Network Architecture

```
Internet
    |
    v
[Firewall: UFW]
    |
    +---> Port 80 --> Frontend (Nginx)
    |                      |
    |                      +---> /api/* --> Backend (proxy)
    |
    +---> Port 8000 --> Backend (Uvicorn)
```

### Service Communication

- Frontend proxies API requests to backend via Nginx
- Backend accepts requests on port 8000
- CORS configured to allow frontend origin

## CI/CD Architecture

```
GitHub Repository
       |
       v
GitHub Actions (Workflow)
       |
       +---> Lint Job
       |         |
       |         v
       +---> Test Job
       |         |
       |         v
       +---> Build & Push Job
       |         |
       |         v
       +---> Deploy Job
                 |
                 v
           SSH to Server
                 |
                 v
         Docker Compose Pull
                 |
                 v
         Docker Compose Up
```

## Security Considerations

### Container Security
- Non-root users in production containers
- Multi-stage builds to minimize image size
- No sensitive data in images

### Network Security
- UFW firewall with minimal open ports
- SSH key-based authentication only
- No root SSH access for deployment

### CI/CD Security
- Secrets stored in GitHub Secrets
- SSH key rotation recommended
- Separate staging environment

## Scalability Considerations

Current architecture supports:
- Horizontal scaling via container replication
- Load balancing (can be added with nginx upstream)
- Independent service scaling

Future improvements:
- Add container orchestration (Kubernetes/Swarm)
- Implement service mesh
- Add database replication
