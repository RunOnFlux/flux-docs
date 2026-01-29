---
sidebar_position: 3
title: First Deployment
description: Step-by-step guide for your first Git deployment
---

# First Deployment

This guide walks you through deploying your first application via Deploy with Git, from start to finish.

## Overview

We'll deploy a real application and learn how Deploy with Git:
- Clones your repository
- Detects the project type
- Installs dependencies
- Builds and starts your application
- Monitors for updates

## Choose Your Application

### Option 1: Use Our Example (Recommended for First Time)

We'll use a Next.js blog that demonstrates Deploy with Git its capabilities:

```bash
docker run -d \
  --name my-first-app \
  -e GIT_REPO_URL=https://github.com/timlrx/tailwind-nextjs-starter-blog \
  -e APP_PORT=3000 \
  -p 3000:3000 \
  -p 9001:9001 \
  runonflux/orbit:latest
```

### Option 2: Deploy Your Own Repository

If you have a Node.js, Python, or Ruby application on GitHub:

```bash
docker run -d \
  --name my-first-app \
  -e GIT_REPO_URL=https://github.com/YOUR_USERNAME/YOUR_REPO \
  -e APP_PORT=YOUR_APP_PORT \
  -p YOUR_APP_PORT:YOUR_APP_PORT \
  -p 9001:9001 \
  runonflux/orbit:latest
```

## Monitor the Deployment

### 1. Watch the Logs

See what Deploy with Git is doing in real-time:

```bash
docker logs -f my-first-app
```

You'll see output like:
```
[SETUP] Starting Git deployment...
[SETUP] Cloning repository: https://github.com/timlrx/tailwind-nextjs-starter-blog
[SETUP] Repository cloned successfully
[SETUP] Detected Node.js project (found package.json)
[SETUP] Installing Node.js v20.11.0...
[SETUP] Running npm install...
[SETUP] Dependencies installed successfully
[SETUP] Running build command: npm run build
[SETUP] Build completed successfully
[SETUP] Starting application with command: npm start
[APP] ▲ Next.js 14.0.0
[APP] - Local: http://localhost:3000
```

### 2. Check Container Status

Verify your container is running:

```bash
docker ps --filter name=my-first-app
```

### 3. Access Your Application

Once deployment completes (usually 2-5 minutes), access:
- **Your App**: http://localhost:3000
- **Supervisor Dashboard**: http://localhost:9001

## Understanding the Process

### What Just Happened?

1. **Container Started**: Docker created an isolated environment
2. **Repository Cloned**: Git pulled your code into `/app/src`
3. **Runtime Detected**: Deploy with Git identified it as a Node.js project
4. **Dependencies Installed**: npm/yarn/pnpm installed packages
5. **Build Executed**: Production build created
6. **Application Started**: Supervisor manages the running process

### File Locations Inside Container

```
/app/
├── src/                 # Your application code
├── logs/
│   ├── app.log         # Application output
│   ├── setup.log       # Deployment logs
│   └── webhook.log     # CI/CD logs
├── config.json         # Persistent configuration
└── .env_setup          # Runtime environment
```

## Verify Deployment Success

### Check Application Health

```bash
# Test if application responds
curl http://localhost:3000

# Check application logs
docker exec my-first-app tail -f /app/logs/app.log

# View setup logs
docker exec my-first-app cat /app/logs/setup.log
```

### Access Supervisor Dashboard

Visit http://localhost:9001 with credentials:
- Username: `admin`
- Password: `admin`

You'll see:
- Running processes
- CPU/Memory usage
- Process uptime
- Restart capabilities

## Making Changes

### Test Auto-Deployment

If you forked the example repository:

1. Make a change in GitHub
2. Commit and push
3. Trigger deployment:
   ```bash
   # Manual trigger via webhook
   curl -X POST http://localhost:9001/webhook \
     -H "Content-Type: application/json" \
     -d '{"ref":"refs/heads/main"}'
   ```

### Watch the Update

```bash
docker logs -f my-first-app
```

You'll see:
- Git pull latest changes
- Rebuild if needed
- Graceful restart
- Automatic rollback on failure

## Common Customizations

### Use Environment Variables

```bash
docker run -d \
  --name my-app \
  -e GIT_REPO_URL=https://github.com/user/repo \
  -e APP_PORT=3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgresql://localhost/mydb \
  -e API_KEY=your_secret_key \
  -p 3000:3000 \
  runonflux/orbit:latest
```

### Deploy from a Specific Branch

```bash
docker run -d \
  -e GIT_REPO_URL=https://github.com/user/repo \
  -e GIT_BRANCH=develop \
  -e APP_PORT=3000 \
  -p 3000:3000 \
  runonflux/orbit:latest
```

### Deploy a Monorepo Subfolder

```bash
docker run -d \
  -e GIT_REPO_URL=https://github.com/user/monorepo \
  -e PROJECT_PATH=apps/frontend \
  -e APP_PORT=3000 \
  -p 3000:3000 \
  runonflux/orbit:latest
```

## Troubleshooting Your First Deployment

### Application Not Starting

Check the logs:
```bash
docker logs my-first-app --tail 100
```

Common issues:
- Wrong `APP_PORT` specified
- Missing dependencies
- Build failures

### Port Already in Use

```bash
# Find what's using port 3000
netstat -ano | grep :3000

# Use a different port
docker run -d \
  -e GIT_REPO_URL=https://github.com/user/repo \
  -e APP_PORT=3000 \
  -p 8080:3000 \  # Map to 8080 instead
  runonflux/orbit:latest
```

### Slow First Deployment

First deployment takes longer because:
- Installing runtime (Node.js/Python/Ruby)
- Installing all dependencies
- Building the application

Subsequent updates are much faster!

## Clean Up

When you're done testing:

```bash
# Stop the container
docker stop my-first-app

# Remove the container
docker rm my-first-app

# Keep the image for future use
# Or remove it to save space:
docker rmi runonflux/orbit:latest
```

## What's Next?

Congratulations! You've successfully deployed your first application via Deploy with Git.

### Learn More:
- [Environment Variables](../configuration/environment-reference) - Configure your deployment
- [CI/CD Setup](../ci-cd/github-webhooks) - Automate deployments
- [Deployment Guides](../guides/deploying-nodejs) - Framework-specific guides
- [Troubleshooting](../troubleshooting/common-issues) - Solve common problems

### Advanced Topics:
- Private repository deployment
- Custom build commands
- Health checks and monitoring
- Multi-environment deployment
