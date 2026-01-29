---
sidebar_position: 1
title: Common Issues
description: Solutions to common problems when using Deploy with Git
---

# Common Issues

This guide covers the most common issues users encounter via Deploy with Git and how to solve them.

## Application Won't Start

### Symptoms
- Container starts but application doesn't run
- Supervisor shows application as "FATAL" or "BACKOFF"
- Can't access application on expected port

### Check the Logs

```bash
# View all logs
docker logs my-app

# View application-specific logs
docker exec my-app tail -100 /app/logs/app.log

# View setup logs
docker exec my-app cat /app/logs/setup.log
```

### Common Causes and Solutions

#### Wrong PORT Configuration

**Problem**: Application listening on different port than configured

**Solution**:
```bash
# Ensure APP_PORT matches your application's actual port
docker run -d \
  -e APP_PORT=3000 \  # Must match what your app uses
  -p 3000:3000 \
  runonflux/orbit:latest
```

#### Missing Start Script

**Problem**: No start script in package.json or incorrect command

**Solution**:
```bash
# Specify the start command explicitly
-e RUN_COMMAND="node server.js"
# or
-e RUN_COMMAND="npm run start:production"
```

#### Missing Dependencies

**Problem**: Dependencies not installed correctly

**Solution**:
```bash
# Force reinstall
docker exec my-app bash -c "cd /app/src && npm ci"

# Or restart container with clean install
-e INSTALL_COMMAND="npm ci --production"
```

## Build Failures

### Symptoms
- Build command fails
- "Build failed" in logs
- Application uses old code

### Common Solutions

#### Insufficient Memory

**Problem**: Build process runs out of memory

**Symptoms**:
```
FATAL ERROR: Ineffective mark-compacts near heap limit
Allocation failed - JavaScript heap out of memory
```

**Solution**:

Since v0.2.1, Flux-Orbit **automatically configures** Node.js memory based on container RAM:

```bash
# Automatic configuration (recommended)
# Just increase Docker memory, NODE_OPTIONS auto-configured
docker run -d \
  --memory="6g" \  # Auto-configures 4.5GB Node.js heap
  -e GIT_REPO_URL=https://github.com/your/repo \
  runonflux/orbit:latest
```

The system will log: `Auto-configured Node.js heap: 4608MB (container: 6144MB)`

**Manual override** (if needed):
```bash
# Explicitly set Node.js memory limit
docker run -d \
  --memory="4g" \
  -e NODE_OPTIONS="--max-old-space-size=3584" \
  -e GIT_REPO_URL=https://github.com/your/repo \
  runonflux/orbit:latest
```

**Memory Guidelines**:
- **Small apps** (simple React/Vue): 2-3GB container
- **Medium apps** (Next.js, dashboards): 3-4GB container
- **Large apps** (DeFi, Web3, Aave, Uniswap): 6-8GB container
- **Very large** (complex monorepos): 8-10GB container

**On Flux Cloud**: Increase RAM allocation in app settings, memory auto-configures.

#### Missing Build Tools

**Problem**: Native dependencies need compilation

**Solution**:
```bash
# The image includes build-essential, but some packages need more
docker exec my-app apt-get update && apt-get install -y python3-dev
```

#### Custom Build Command

**Problem**: Non-standard build process

**Solution**:
```bash
-e BUILD_COMMAND="npm run build:custom && npm run post-build"
```

## Git Clone/Pull Failures

### Symptoms
- "Failed to clone repository"
- "Authentication failed"
- "Repository not found"

### Private Repository Issues

**Problem**: Can't access private repository

**Solution**:
```bash
# Use personal access token
docker run -d \
  -e GIT_REPO_URL=https://github.com/user/private-repo \
  -e GIT_TOKEN=ghp_YourGitHubToken \
  runonflux/orbit:latest
```

### Invalid Repository URL

**Problem**: Typo or wrong URL format

**Solution**:
```bash
# Ensure URL is correct and accessible
-e GIT_REPO_URL=https://github.com/username/repository

# Not: github.com/username/repository (missing https://)
# Not: https://github.com/username/repository.git (optional .git)
```

### Network Issues

**Problem**: Can't reach GitHub/GitLab

**Solution**:
```bash
# Check DNS resolution
docker exec my-app nslookup github.com

# Check network connectivity
docker exec my-app ping -c 3 github.com
```

## Port Conflicts

### Symptoms
- "Port already in use"
- Can't access application
- Multiple containers conflicting

### Solutions

#### Change Host Port

```bash
# Map to different port
docker run -d \
  -e APP_PORT=3000 \      # Internal port (don't change)
  -p 8080:3000 \          # External port 8080 -> Internal 3000
  runonflux/orbit:latest
```

#### Find What's Using the Port

```bash
# On Linux/Mac
lsof -i :3000

# On Windows
netstat -ano | findstr :3000

# Kill the process if needed
kill -9 <PID>
```

## Webhook Not Working

### Symptoms
- GitHub webhook shows red X
- Push doesn't trigger deployment
- No webhook logs

### Check Webhook Listener

```bash
# Verify webhook listener is running
docker logs my-app | grep "Webhook listener"

# Check if port is open
netstat -an | grep 9001

# Test webhook manually
curl -X POST http://localhost:9001/webhook \
  -H "Content-Type: application/json" \
  -d '{"ref":"refs/heads/main"}'
```

### Common Fixes

1. **Expose webhook port**:
   ```bash
   -p 9001:9001  # Don't forget this!
   ```

2. **Check webhook secret**:
   ```bash
   -e WEBHOOK_SECRET=same_as_github_config
   ```

3. **Verify URL is accessible**:
   - Use public IP, not localhost
   - Check firewall rules
   - Verify port forwarding

## Container Keeps Restarting

### Symptoms
- Container restarts every few seconds
- Status shows "Restarting"
- Logs show crash loop

### Check Exit Codes

```bash
docker ps -a
# Look at STATUS column for exit code

docker logs my-app --tail 50
# Check for error messages
```

### Common Causes

#### Application Crashes Immediately

**Solution**: Fix application errors or specify correct start command:
```bash
-e RUN_COMMAND="node server.js"
```

#### Health Check Failing

**Solution**: Disable or fix health checks:
```bash
-e HEALTH_CHECK_INTERVAL=0  # Disable
# Or fix the health endpoint in your app
```

#### Out of Memory

**Solution**: Increase memory limit:
```bash
docker run -d --memory="2g" runonflux/orbit:latest
```

## Slow Performance

### Symptoms
- Application responds slowly
- High CPU/memory usage
- Timeouts

### Optimize Resources

```bash
# Allocate more resources
docker run -d \
  --cpus="2" \
  --memory="4g" \
  -e WEB_CONCURRENCY=4 \
  -e NODE_OPTIONS="--max-old-space-size=3072" \
  runonflux/orbit:latest
```

### Check Resource Usage

```bash
# Monitor container resources
docker stats my-app

# Check processes inside container
docker exec my-app ps aux

# Check disk usage
docker exec my-app df -h
```

## Deployment Not Updating

### Symptoms
- Push to GitHub doesn't deploy new code
- Application shows old version
- Git pull seems to work but code doesn't update

### Force Update

```bash
# Manually trigger update
docker exec my-app /usr/local/bin/flux-entrypoint.sh update

# Or restart container
docker restart my-app
```

### Clear Cache

```bash
# Remove node_modules and reinstall
docker exec my-app rm -rf /app/src/node_modules
docker exec my-app bash -c "cd /app/src && npm ci"
```

## Database Connection Issues

### Symptoms
- "Connection refused" errors
- "Host not found"
- Timeout connecting to database

### Solutions

#### Use Host Network (Linux)

```bash
docker run -d \
  --network="host" \
  -e DATABASE_URL=postgresql://localhost:5432/mydb \
  runonflux/orbit:latest
```

#### Use host.docker.internal (Mac/Windows)

```bash
-e DATABASE_URL=postgresql://host.docker.internal:5432/mydb
```

#### Use Docker Network

```bash
# Create network
docker network create my-network

# Run database
docker run -d --name postgres --network my-network postgres

# Run Flux-Orbit
docker run -d \
  --network my-network \
  -e DATABASE_URL=postgresql://postgres:5432/mydb \
  runonflux/orbit:latest
```

## Getting Help

If you're still stuck:

1. **Check logs thoroughly**:
   ```bash
   docker logs my-app > full-logs.txt
   docker exec my-app cat /app/logs/setup.log
   docker exec my-app cat /app/logs/app.log
   ```

2. **Get container details**:
   ```bash
   docker inspect my-app
   docker exec my-app env
   ```

3. **Ask for help**:
   - [GitHub Issues](https://github.com/runonflux/orbit/issues)
   - [Flux Discord](https://discord.gg/runonflux)
   - Include logs and configuration

## Manual Rollback

If automatic rollback fails or you need to rollback to a specific older version, use the `flux-rollback` CLI tool.

### Rollback to Previous Release

```bash
# Enter the container
docker exec -it my-app bash

# Rollback to the previous working version
flux-rollback
```

The tool will:
1. Show you the current release
2. Ask for confirmation
3. Switch to the previous release
4. Restart the application

### Rollback to Specific Release

```bash
# List all available releases
docker exec -it my-app flux-rollback --list

# Example output:
# Available releases:
#   005-a1b2c3d (current)
#   004-x9y8z7w ← previous
#   003-m4n5o6p
#   002-j1k2l3m
#   001-g7h8i9j

# Rollback to a specific release
docker exec -it my-app flux-rollback 003-m4n5o6p
```

### Force Rollback (Skip Confirmation)

```bash
# Rollback without confirmation prompt
docker exec -it my-app flux-rollback --force
```

### When to Use Manual Rollback

- Automatic rollback failed
- Need to rollback multiple versions (not just previous)
- Testing different release versions
- Recovery from edge cases

:::tip Release History
Deploy with Git keeps the last 3 releases by default. Older releases are automatically cleaned up to save disk space. You can only rollback to releases that still exist in `/app/production/releases/`.
:::

:::caution Important Notes
- Manual rollback does NOT trigger deployment hooks
- Health checks are performed after rollback
- If rollback fails health checks, you may need to rollback again or investigate logs
- The rollback updates `/app/production/current` symlink and restarts the app
:::

## Debug Mode

Enable debug mode for more information:

```bash
docker run -d \
  -e LOG_LEVEL=debug \
  -e DEBUG=* \
  --name debug-app \
  runonflux/orbit:latest
```

Then check the detailed logs:
```bash
docker logs debug-app 2>&1 | tee debug.log
```
