---
sidebar_position: 1
title: Deploying Node.js Applications
description: Complete guide for deploying Node.js applications with Flux-Orbit
---

# Deploying Node.js Applications

This comprehensive guide covers everything you need to know about deploying Node.js applications with Flux-Orbit, from simple Express servers to complex Next.js applications.

## Overview

Flux-Orbit automatically detects Node.js applications by looking for:
- `package.json` file
- `package-lock.json` or `yarn.lock` or `pnpm-lock.yaml`
- `.nvmrc` for version specification

## Basic Node.js Deployment

### Simple Express Application

```bash
docker run -d \
  --name express-app \
  -e GIT_REPO_URL=https://github.com/expressjs/express \
  -e APP_PORT=3000 \
  -p 3000:3000 \
  runonflux/orbit:latest
```

### What Happens Automatically

1. **Detection**: Finds `package.json` and identifies as Node.js project
2. **Version Selection**:
   - Checks `.nvmrc` file
   - Checks `engines.node` in package.json
   - Falls back to LTS version
3. **Package Manager Detection**:
   - `pnpm-lock.yaml` → Uses pnpm
   - `yarn.lock` → Uses yarn
   - `package-lock.json` → Uses npm
4. **Installation**: Runs appropriate install command
5. **Build**: Checks for build script in package.json
6. **Start**: Uses start script or main file

## Framework-Specific Guides

### Next.js Applications

Next.js requires building before running. Flux-Orbit handles this automatically:

```bash
docker run -d \
  --name nextjs-app \
  -e GIT_REPO_URL=https://github.com/vercel/next.js/tree/canary/examples/blog \
  -e APP_PORT=3000 \
  -p 3000:3000 \
  runonflux/orbit:latest
```

**Optimization for Next.js:**

```bash
docker run -d \
  --name nextjs-app-optimized \
  -e GIT_REPO_URL=https://github.com/your-username/nextjs-app \
  -e APP_PORT=3000 \
  -e NODE_VERSION=20.11.0 \
  -e BUILD_COMMAND="npm run build" \
  -e RUN_COMMAND="npm run start" \
  -e NODE_ENV=production \
  -p 3000:3000 \
  runonflux/orbit:latest
```

### Nuxt.js Applications

```bash
docker run -d \
  --name nuxt-app \
  -e GIT_REPO_URL=https://github.com/your-username/nuxt-app \
  -e APP_PORT=3000 \
  -e BUILD_COMMAND="npm run build" \
  -e RUN_COMMAND="npm run start" \
  -p 3000:3000 \
  runonflux/orbit:latest
```

### Express/Fastify APIs

```bash
docker run -d \
  --name api-server \
  -e GIT_REPO_URL=https://github.com/your-username/express-api \
  -e APP_PORT=5000 \
  -e NODE_ENV=production \
  -e RUN_COMMAND="node server.js" \
  -p 5000:5000 \
  runonflux/orbit:latest
```

### NestJS Applications

```bash
docker run -d \
  --name nestjs-app \
  -e GIT_REPO_URL=https://github.com/your-username/nestjs-app \
  -e APP_PORT=3000 \
  -e BUILD_COMMAND="npm run build" \
  -e RUN_COMMAND="npm run start:prod" \
  -p 3000:3000 \
  runonflux/orbit:latest
```

### React/Vue/Angular SPAs

For single-page applications that need to be built and served:

```bash
docker run -d \
  --name react-app \
  -e GIT_REPO_URL=https://github.com/your-username/react-app \
  -e APP_PORT=3000 \
  -e BUILD_COMMAND="npm run build" \
  -e RUN_COMMAND="npx serve -s build -l 3000" \
  -p 3000:3000 \
  runonflux/orbit:latest
```

## Package Manager Configuration

### NPM (Default)

```bash
# Use npm ci for faster, reliable installs
-e INSTALL_COMMAND="npm ci"

# Production-only dependencies
-e INSTALL_COMMAND="npm ci --production"

# With legacy peer deps (for compatibility)
-e INSTALL_COMMAND="npm ci --legacy-peer-deps"
```

### Yarn

```bash
# Yarn with frozen lockfile
-e INSTALL_COMMAND="yarn install --frozen-lockfile"

# Yarn 2+ (Berry)
-e INSTALL_COMMAND="yarn install --immutable"

# Production only
-e INSTALL_COMMAND="yarn install --production --frozen-lockfile"
```

### PNPM

```bash
# PNPM with frozen lockfile
-e INSTALL_COMMAND="pnpm install --frozen-lockfile"

# Production only
-e INSTALL_COMMAND="pnpm install --prod --frozen-lockfile"
```

## Node.js Version Management

### Specify Node Version

```bash
# Using specific version
-e NODE_VERSION=20.11.0

# Using LTS codename
-e NODE_VERSION=lts/iron

# Using major version
-e NODE_VERSION=18
```

### Version Detection Priority

1. `NODE_VERSION` environment variable
2. `.nvmrc` file in repository
3. `engines.node` in package.json
4. Latest LTS version

### Example .nvmrc

```
20.11.0
```

### Example package.json engines

```json
{
  "engines": {
    "node": ">=18.0.0 <21.0.0",
    "npm": ">=9.0.0"
  }
}
```

## Environment Variables

### Common Node.js Variables

```bash
docker run -d \
  -e GIT_REPO_URL=https://github.com/your-username/node-app \
  -e APP_PORT=3000 \
  -e NODE_ENV=production \
  -e NODE_OPTIONS="--max-old-space-size=2048" \
  -e NPM_CONFIG_LOGLEVEL=warn \
  -e DATABASE_URL=postgres://user:pass@host:5432/db \
  -e REDIS_URL=redis://redis-host:6379 \
  -e API_KEY=your_api_key_here \
  -p 3000:3000 \
  runonflux/orbit:latest
```

### Using .env Files

Create a `.env` file:
```env
NODE_ENV=production
DATABASE_URL=postgres://localhost/mydb
REDIS_URL=redis://localhost:6379
API_KEY=secret_key_123
JWT_SECRET=jwt_secret_456
```

Your application will automatically load these with packages like `dotenv`.

## Build Optimization

### Production Builds

```bash
# Next.js production build
-e BUILD_COMMAND="npm run build"
-e NODE_ENV=production

# Custom webpack build
-e BUILD_COMMAND="webpack --mode production"

# TypeScript compilation
-e BUILD_COMMAND="tsc && npm run build"
```

### Multi-stage Builds

```bash
# Build and optimize in sequence
-e BUILD_COMMAND="npm run clean && npm run build && npm run optimize"

# With testing
-e BUILD_COMMAND="npm test && npm run build"
```

### Build Caching

Flux-Orbit preserves `node_modules` between builds for faster deployments:
- First deployment: Full installation
- Subsequent updates: Only changed dependencies

## Memory Management

### Configure Heap Size

```bash
# Set max memory to 2GB
-e NODE_OPTIONS="--max-old-space-size=2048"

# Or use dedicated variable
-e MAX_OLD_SPACE_SIZE=2048
```

### Memory-Intensive Applications

```bash
docker run -d \
  --name memory-app \
  --memory="4g" \
  --memory-swap="4g" \
  -e GIT_REPO_URL=https://github.com/your-username/app \
  -e APP_PORT=3000 \
  -e MAX_OLD_SPACE_SIZE=3072 \
  -p 3000:3000 \
  runonflux/orbit:latest
```

## Process Management

### Clustering with PM2

If your app includes PM2:

```bash
-e RUN_COMMAND="pm2-runtime start ecosystem.config.js"
```

Example `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'app',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
```

### Native Cluster Module

```bash
-e WEB_CONCURRENCY=4  # Number of workers
-e RUN_COMMAND="node cluster.js"
```

## Database Migrations

### Run Migrations on Deploy

```bash
# Sequelize migrations
-e PRE_BUILD_COMMAND="npx sequelize-cli db:migrate"

# Prisma migrations
-e PRE_BUILD_COMMAND="npx prisma migrate deploy"

# TypeORM migrations
-e PRE_BUILD_COMMAND="npm run typeorm migration:run"

# Knex migrations
-e PRE_BUILD_COMMAND="npx knex migrate:latest"
```

### Safe Migration Pattern

```bash
docker run -d \
  --name app-with-migrations \
  -e GIT_REPO_URL=https://github.com/your-username/app \
  -e APP_PORT=3000 \
  -e DATABASE_URL=postgres://user:pass@db:5432/myapp \
  -e PRE_BUILD_COMMAND="npm run db:backup && npm run db:migrate" \
  -e POST_BUILD_COMMAND="npm run db:seed" \
  -p 3000:3000 \
  runonflux/orbit:latest
```

## Private NPM Packages

### Using NPM Token

```bash
# Set NPM token for private packages
-e NPM_TOKEN=your_npm_token_here

# Or configure registry
-e NPM_CONFIG_REGISTRY=https://npm.company.com/
-e NPM_CONFIG_ALWAYS_AUTH=true
```

### .npmrc Configuration

Create `.npmrc` in your repository:
```
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
@company:registry=https://npm.company.com/
always-auth=true
```

## Debugging Deployments

### Enable Debug Logging

```bash
docker run -d \
  --name debug-app \
  -e GIT_REPO_URL=https://github.com/your-username/app \
  -e APP_PORT=3000 \
  -e LOG_LEVEL=debug \
  -e DEBUG=* \
  -e NODE_ENV=development \
  -p 3000:3000 \
  runonflux/orbit:latest
```

### Access Container for Debugging

```bash
# Execute commands in running container
docker exec -it debug-app /bin/bash

# Check Node version
docker exec debug-app node --version

# View installed packages
docker exec debug-app npm list

# Check running processes
docker exec debug-app ps aux
```

### Common Issues and Solutions

#### 1. Module Not Found

**Problem**: `Error: Cannot find module 'express'`

**Solution**:
```bash
-e INSTALL_COMMAND="npm ci"  # Use ci for clean install
```

#### 2. Build Failures

**Problem**: Build script fails

**Solution**:
```bash
# Skip build if not needed
-e BUILD_COMMAND="echo 'No build required'"

# Or use custom build
-e BUILD_COMMAND="npm run build:docker"
```

#### 3. Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use`

**Solution**:
```bash
# Ensure APP_PORT matches your app's actual port
-e APP_PORT=3001  # If your app uses 3001
```

#### 4. Memory Errors

**Problem**: `FATAL ERROR: Reached heap limit`

**Solution**:
```bash
-e NODE_OPTIONS="--max-old-space-size=4096"
```

## Performance Optimization

### Production Best Practices

```bash
docker run -d \
  --name production-node-app \
  -e GIT_REPO_URL=https://github.com/your-username/app \
  -e APP_PORT=3000 \
  -e NODE_ENV=production \
  -e INSTALL_COMMAND="npm ci --production" \
  -e BUILD_COMMAND="npm run build:prod" \
  -e RUN_COMMAND="node dist/server.js" \
  -e NODE_OPTIONS="--max-old-space-size=2048" \
  -e WEB_CONCURRENCY=4 \
  --memory="4g" \
  --cpus="2" \
  -p 3000:3000 \
  runonflux/orbit:latest
```

### Caching Strategies

1. **Dependency Caching**: Node modules are preserved between deployments
2. **Build Artifacts**: Build outputs are retained unless code changes
3. **Static Assets**: Consider CDN for static files

## Monitoring

### Health Checks

```bash
# Configure health endpoint
-e HEALTH_CHECK_PATH=/api/health
-e HEALTH_CHECK_INTERVAL=30
```

Implement in your app:
```javascript
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});
```

### Logs

```bash
# View application logs
docker logs -f container-name

# View specific log file
docker exec container-name tail -f /app/logs/app.log

# Check error logs
docker exec container-name tail -f /app/logs/error.log
```

## Example Deployments

### Complete Next.js E-commerce

```bash
docker run -d \
  --name ecommerce \
  -e GIT_REPO_URL=https://github.com/vercel/commerce \
  -e APP_PORT=3000 \
  -e NODE_VERSION=20.11.0 \
  -e DATABASE_URL=postgres://user:pass@db:5432/commerce \
  -e STRIPE_SECRET_KEY=sk_test_... \
  -e NEXT_PUBLIC_STRIPE_KEY=pk_test_... \
  -e PRE_BUILD_COMMAND="npx prisma migrate deploy" \
  -e BUILD_COMMAND="npm run build" \
  -e RUN_COMMAND="npm run start" \
  -p 3000:3000 \
  runonflux/orbit:latest
```

### Microservice API

```bash
docker run -d \
  --name user-service \
  -e GIT_REPO_URL=https://github.com/company/user-service \
  -e APP_PORT=4000 \
  -e NODE_ENV=production \
  -e SERVICE_NAME=user-service \
  -e KAFKA_BROKERS=kafka1:9092,kafka2:9092 \
  -e REDIS_URL=redis://redis:6379 \
  -e RUN_COMMAND="node --enable-source-maps dist/main.js" \
  -p 4000:4000 \
  runonflux/orbit:latest
```

## Next Steps

- Learn about [Python Deployment](./deploying-python)
- Configure [CI/CD with GitHub](../ci-cd/github-webhooks)
- Explore [Troubleshooting Guide](../troubleshooting/common-issues)
- Read [API Reference](../api/webhook-api)