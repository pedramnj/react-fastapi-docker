# Setup Guide

## Prerequisites

### Local Development

- Node.js 20+
- Python 3.11+
- Docker and Docker Compose
- Git

### Server Requirements

- Ubuntu 22.04 LTS
- Minimum 2GB RAM
- Docker and Docker Compose
- SSH access

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/pedramnj/react-fastapi-docker.git
cd react-fastapi-docker
```

### 2. Option A: Docker Compose (Recommended)

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

### 3. Option B: Manual Setup

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload
```

## Server Setup

### 1. Initial Server Configuration

```bash
# Update system
apt-get update && apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
systemctl enable docker && systemctl start docker

# Install Docker Compose plugin
apt-get install docker-compose-plugin -y
```

### 2. Configure Firewall

```bash
apt-get install ufw -y
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw allow 8000/tcp # API
ufw --force enable
```

### 3. Create Deploy User

```bash
# Create user
adduser deploy --disabled-password --gecos ""
usermod -aG docker deploy

# Setup SSH
mkdir -p /home/deploy/.ssh
cat >> /home/deploy/.ssh/authorized_keys << 'EOF'
<YOUR_PUBLIC_SSH_KEY>
EOF
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys
```

### 4. Create Application Directory

```bash
mkdir -p /opt/devops
chown deploy:deploy /opt/devops
```

## GitHub Configuration

### 1. Repository Secrets

Navigate to Settings > Secrets and variables > Actions, and add:

| Secret | Value |
|--------|-------|
| `SSH_PRIVATE_KEY` | Contents of your private SSH key |
| `STAGING_HOST` | Server IP address |
| `STAGING_USER` | `deploy` |

### 2. Create Environment

Navigate to Settings > Environments and create `staging`.

### 3. Enable Actions

Ensure GitHub Actions is enabled for the repository.

## Verification

### Local Verification

```bash
# Check frontend
curl http://localhost:3000

# Check backend
curl http://localhost:8000/health

# Check API docs
open http://localhost:8000/docs
```

### Staging Verification

```bash
# Check frontend
curl http://<SERVER_IP>/

# Check backend
curl http://<SERVER_IP>:8000/health
```

## Troubleshooting

### Docker Issues

```bash
# Check running containers
docker ps

# Check logs
docker compose logs -f <service_name>

# Restart services
docker compose restart
```

### Permission Issues

```bash
# Ensure deploy user is in docker group
groups deploy

# Re-login to apply group changes
su - deploy
```

### Network Issues

```bash
# Check firewall status
ufw status

# Check open ports
netstat -tlnp
```
