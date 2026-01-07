---
sidebar_position: 2
title: Installation
description: How to install and set up Flux-Orbit
---

# Installation

Learn how to install Flux-Orbit and prepare your environment for deploying applications to the Flux Network.

## Prerequisites

Before installing Flux-Orbit, ensure you have the following:

### Required Software

- **Docker Desktop** (Windows/Mac) or **Docker Engine** (Linux)
  - Version 20.10 or higher recommended
  - [Download Docker](https://docs.docker.com/get-docker/)

- **Git** (for managing your application code)
  - [Download Git](https://git-scm.com/downloads)

### System Requirements

- **Memory**: Minimum 2GB RAM (4GB recommended)
- **Storage**: At least 10GB free disk space
- **Network**: Internet connection for pulling images and cloning repositories

## Installing Flux-Orbit

### Method 1: Using Docker Hub (Recommended)

Pull the official Flux-Orbit image from Docker Hub:

```bash
docker pull runonflux/orbit:latest
```

Verify the installation:

```bash
docker images | grep runonflux/orbit
```

### Method 2: Building from Source

Clone the repository and build locally:

```bash
# Clone the repository
git clone https://github.com/runonflux/orbit.git
cd orbit

# Build the Docker image
docker build -t flux-orbit:latest .
```

## Verify Installation

Run a test deployment to verify everything works:

```bash
docker run --rm \
  -e GIT_REPO_URL=https://github.com/timlrx/tailwind-nextjs-starter-blog \
  -e APP_PORT=3000 \
  -p 3000:3000 \
  runonflux/orbit:latest
```

After a few minutes, visit http://localhost:3000 to see the deployed application.

## Docker Compose Setup

For easier management, create a `docker-compose.yml`:

```yaml
version: '3.8'

services:
  flux-orbit:
    image: runonflux/orbit:latest
    ports:
      - "3000:3000"
      - "9001:9001"
    environment:
      - GIT_REPO_URL=https://github.com/your/repository
      - APP_PORT=3000
      - NODE_ENV=production
    volumes:
      - app-data:/app
    restart: unless-stopped

volumes:
  app-data:
```

Start with Docker Compose:

```bash
docker-compose up -d
```

## Flux Network Setup

### Creating a Flux Node

To deploy on the Flux Network:

1. **Set up a Flux Node**
   - Visit [Flux Documentation](https://docs.runonflux.io)
   - Follow the node setup guide

2. **Deploy Flux-Orbit**
   - Use FluxOS marketplace
   - Or deploy manually via Docker

### Flux Deployment Configuration

Example Flux deployment specification:

```json
{
  "name": "my-app",
  "description": "My Application on Flux",
  "image": "runonflux/orbit:latest",
  "port": 3000,
  "environmentParameters": [
    "GIT_REPO_URL=https://github.com/user/repo",
    "APP_PORT=3000",
    "NODE_ENV=production"
  ],
  "resources": {
    "cpu": 1,
    "ram": 2048,
    "storage": 10
  }
}
```

## Updating Flux-Orbit

To update to the latest version:

```bash
# Pull the latest image
docker pull runonflux/orbit:latest

# Stop current container
docker stop my-app

# Remove old container
docker rm my-app

# Start with new image
docker run -d \
  --name my-app \
  -e GIT_REPO_URL=https://github.com/user/repo \
  -e APP_PORT=3000 \
  -p 3000:3000 \
  runonflux/orbit:latest
```

## Uninstalling

To completely remove Flux-Orbit:

```bash
# Stop all Flux-Orbit containers
docker stop $(docker ps -a -q --filter ancestor=runonflux/orbit)

# Remove containers
docker rm $(docker ps -a -q --filter ancestor=runonflux/orbit)

# Remove the image
docker rmi runonflux/orbit:latest

# Remove volumes (optional - this deletes data)
docker volume prune
```

## Troubleshooting Installation

### Docker Not Found

If you get "docker: command not found":
- Ensure Docker is installed and running
- On Linux, you may need to add your user to the docker group:
  ```bash
  sudo usermod -aG docker $USER
  ```
  Then log out and back in

### Permission Denied

If you get permission errors:
- On Linux/Mac: Use `sudo` or fix Docker permissions
- On Windows: Run as Administrator

### Port Already in Use

If port 3000 is already taken:
```bash
# Use a different port
docker run -d \
  -e GIT_REPO_URL=https://github.com/user/repo \
  -e APP_PORT=3000 \
  -p 8080:3000 \  # Map to port 8080 instead
  runonflux/orbit:latest
```

## Next Steps

- [First Deployment](./first-deployment) - Deploy your first application
- [Configuration Guide](../configuration/environment-reference) - Learn about all configuration options
- [Deployment Guides](../guides/deploying-nodejs) - Framework-specific tutorials