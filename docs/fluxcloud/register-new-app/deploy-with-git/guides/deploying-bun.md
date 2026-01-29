---
sidebar_position: 5
title: Deploying Bun Applications
description: Complete guide for deploying Bun applications via Deploy with Git
---

# Deploying Bun Applications

This comprehensive guide covers everything you need to know about deploying Bun applications via Deploy with Git, from simple Elysia APIs to complex applications using Hono, or even Node.js-compatible frameworks running on Bun.

## Overview

Deploy with Git automatically detects Bun applications by looking for:
- `bun.lockb` file (Bun's binary lockfile)
- `bunfig.toml` (Bun configuration file)
- `.bun-version` for version specification (optional)

## Basic Bun Deployment

### Simple Elysia API

```bash
docker run -d \
  --name elysia-api \
  -e GIT_REPO_URL=https://github.com/your-username/elysia-api \
  -e APP_PORT=3000 \
  -p 3000:3000 \
  runonflux/orbit:latest
```

### What Happens Automatically

1. **Detection**: Finds `bun.lockb` or `bunfig.toml` and identifies as Bun project
2. **Version Selection**:
   - Checks `BUN_VERSION` environment variable
   - Checks `.bun-version` file
   - Checks `engines.bun` in package.json
   - Falls back to latest Bun version
3. **Runtime Installation**:
   - Downloads official Bun binary from bun.sh
   - Installs to `/opt/flux-tools/bun`
   - Sets up PATH environment variables
4. **Dependencies**: Runs `bun install`
5. **Build**: Runs `bun run build` if build script exists (optional - Bun runs TypeScript natively!)
6. **Start**: Executes `bun run start` or detected entry point

## Framework-Specific Guides

### Elysia Framework

Elysia is a Bun-native web framework designed for ergonomics and performance. Deploy with Git automatically detects and optimizes Elysia applications:

```bash
docker run -d \
  --name elysia-rest-api \
  -e GIT_REPO_URL=https://github.com/your-username/elysia-api \
  -e APP_PORT=3000 \
  -e BUN_VERSION=1.0.25 \
  -p 3000:3000 \
  runonflux/orbit:latest
```

**Example `index.ts`:**
```typescript
import { Elysia } from 'elysia';

const app = new Elysia();
const port = process.env.APP_PORT || 3000;

app.get('/health', () => ({
    status: 'healthy',
    runtime: 'bun',
    framework: 'elysia'
}));

app.get('/', () => ({
    message: 'Hello from Elysia!',
    runtime: `Bun ${Bun.version}`
}));

app.listen(port, () => {
    console.log(`🦊 Elysia is running on port ${port}`);
});
```

**Key Features:**
- Native TypeScript support (no transpilation needed)
- Type safety with end-to-end type inference
- High performance with Bun's optimizations

### Hono Framework

Hono is an ultra-fast web framework that works great with Bun:

```bash
docker run -d \
  --name hono-api \
  -e GIT_REPO_URL=https://github.com/your-username/hono-api \
  -e APP_PORT=3000 \
  -p 3000:3000 \
  runonflux/orbit:latest
```

**Example `index.ts`:**
```typescript
import { Hono } from 'hono';

const app = new Hono();
const port = Number(process.env.APP_PORT) || 3000;

app.get('/health', (c) => {
    return c.json({ status: 'healthy', runtime: 'bun' });
});

app.get('/', (c) => {
    return c.json({
        message: 'Hello from Hono!',
        runtime: `Bun ${Bun.version}`
    });
});

export default {
    port,
    fetch: app.fetch,
};

console.log(`Hono is running on port ${port}`);
```

### Express on Bun

Bun is compatible with Node.js frameworks like Express:

```bash
docker run -d \
  --name express-bun \
  -e GIT_REPO_URL=https://github.com/your-username/express-app \
  -e APP_PORT=3000 \
  -p 3000:3000 \
  runonflux/orbit:latest
```

**Example:**
```typescript
import express from 'express';

const app = express();
const port = process.env.APP_PORT || 3000;

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', runtime: 'bun' });
});

app.get('/', (req, res) => {
    res.json({ message: 'Express running on Bun!' });
});

app.listen(port, () => {
    console.log(`Express on Bun listening on port ${port}`);
});
```

### Next.js on Bun

Bun can run Next.js applications:

```bash
docker run -d \
  --name nextjs-bun \
  -e GIT_REPO_URL=https://github.com/your-username/nextjs-app \
  -e APP_PORT=3000 \
  -p 3000:3000 \
  runonflux/orbit:latest
```

**Note:** Ensure your `package.json` has a start script:
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start"
  }
}
```

## Version Management

### Specify Bun Version

**Option 1: Environment Variable**
```bash
docker run -d \
  -e GIT_REPO_URL=https://github.com/your-username/bun-app \
  -e APP_PORT=3000 \
  -e BUN_VERSION=1.0.25 \
  -p 3000:3000 \
  runonflux/orbit:latest
```

**Option 2: .bun-version File**
```
1.0.25
```

**Option 3: package.json Engines**
```json
{
  "name": "my-bun-app",
  "engines": {
    "bun": ">=1.0.0"
  }
}
```

## Native TypeScript Execution

One of Bun's killer features is native TypeScript execution - no build step required!

### TypeScript Without Build

```bash
docker run -d \
  --name ts-api \
  -e GIT_REPO_URL=https://github.com/your-username/typescript-api \
  -e APP_PORT=3000 \
  -p 3000:3000 \
  runonflux/orbit:latest
```

Your `index.ts` runs directly without transpilation:
```typescript
interface ApiResponse {
    message: string;
    timestamp: Date;
}

const response: ApiResponse = {
    message: 'TypeScript running natively!',
    timestamp: new Date()
};

console.log(response);
```

### When to Use Build Scripts

Use a build script when you need:
- Asset bundling for frontend applications
- Code minification for production
- Special build optimizations

```json
{
  "scripts": {
    "build": "bun build ./src/index.ts --outdir ./dist --target bun",
    "start": "bun run ./dist/index.js"
  }
}
```

## Environment Variables

### Bun-Specific Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BUN_VERSION` | Bun version to install | Auto-detected or latest |

### Common Application Variables

```bash
docker run -d \
  --name bun-api \
  -e GIT_REPO_URL=https://github.com/your-username/bun-api \
  -e APP_PORT=3000 \
  -e BUN_VERSION=1.0.25 \
  -e DATABASE_URL=postgres://user:pass@db:5432/mydb \
  -e JWT_SECRET=your-secret-key \
  -e LOG_LEVEL=info \
  -p 3000:3000 \
  runonflux/orbit:latest
```

## Advanced Scenarios

### Monorepo - Deploy Specific Package

```bash
docker run -d \
  --name bun-auth-service \
  -e GIT_REPO_URL=https://github.com/your-username/monorepo \
  -e PROJECT_PATH=packages/auth \
  -e APP_PORT=3000 \
  -p 3000:3000 \
  runonflux/orbit:latest
```

### Private Repository

```bash
docker run -d \
  --name private-bun-api \
  -e GIT_REPO_URL=https://github.com/your-username/private-api \
  -e GIT_TOKEN=ghp_your_personal_access_token \
  -e APP_PORT=3000 \
  -p 3000:3000 \
  runonflux/orbit:latest
```

### With Deployment Hooks

Create `pre-deploy.sh` in your repository root:

```bash
#!/bin/bash
# Check Bun runtime before deployment
echo "Checking Bun runtime..."
bun --version

# Run tests
echo "Running tests..."
bun test
```

Create `post-deploy.sh`:

```bash
#!/bin/bash
# Health check after deployment
echo "Performing health check..."
curl -f http://localhost:$APP_PORT/health || exit 1

echo "Deployment successful!"
```

```bash
docker run -d \
  --name bun-api-with-hooks \
  -e GIT_REPO_URL=https://github.com/your-username/bun-api \
  -e APP_PORT=3000 \
  -p 3000:3000 \
  runonflux/orbit:latest
```

## CI/CD Integration

### Automatic Deployment with Webhooks

```bash
docker run -d \
  --name bun-api \
  -e GIT_REPO_URL=https://github.com/your-username/bun-api \
  -e APP_PORT=3000 \
  -e WEBHOOK_SECRET=my-secret-phrase \
  -p 3000:3000 \
  -p 9001:9001 \
  runonflux/orbit:latest
```

**Configure GitHub Webhook:**
- Payload URL: `https://your-app-9001.app.runonflux.io/webhook`
- Content type: `application/json`
- Secret: `my-secret-phrase`
- Events: Just the `push` event

### Polling for Updates

```bash
docker run -d \
  --name bun-api \
  -e GIT_REPO_URL=https://github.com/your-username/bun-api \
  -e APP_PORT=3000 \
  -e POLLING_INTERVAL=300 \
  -p 3000:3000 \
  runonflux/orbit:latest
```

## Troubleshooting

### Bun Not Detected

**Problem:** Application detected as Node.js instead of Bun

**Solution:** Ensure you have `bun.lockb` in your repository:

```bash
# Generate bun.lockb
bun install
git add bun.lockb
git commit -m "Add bun.lockb for Bun detection"
```

### Entry Point Not Found

**Problem:** "No entry point found for Bun application"

**Solution:** Ensure you have either:
1. A `start` script in package.json:
```json
{
  "scripts": {
    "start": "bun run index.ts"
  }
}
```

2. Or a common entry point file: `index.ts`, `index.js`, `src/index.ts`, `main.ts`, `server.ts`, or `app.ts`

### Port Binding Issues

**Problem:** Application not accessible

**Solution:** Ensure your Bun application binds to `0.0.0.0` (not `localhost`):

```typescript
// Good: Accessible from outside container
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});

// Also good (default in most frameworks)
app.listen(port);
```

### TypeScript Type Errors

**Problem:** TypeScript compilation errors even though Bun runs TS natively

**Solution:** Bun runs TypeScript without strict type checking. For development, fix type errors locally:

```bash
# Check types locally before pushing
bun run tsc --noEmit
```

Add to `package.json`:
```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "start": "bun run index.ts"
  }
}
```

### Dependencies Not Installing

**Problem:** `bun install` fails

**Solution:** Check for `bunfig.toml` configuration issues or try clearing Bun cache:

```bash
# In pre-deploy.sh
bun pm cache rm
bun install
```

## Performance Tips

1. **Native TypeScript**: Skip build steps when possible - Bun runs TypeScript natively
2. **Bun.serve API**: For maximum performance, use Bun's native server API instead of Express
3. **Dependency Caching**: Dependencies are cached based on bun.lockb hash
4. **Health Checks**: Implement `/health` endpoint for faster deployment verification
5. **Hot Module Reloading**: Use `bun --hot` in development (not needed in production)

## Bun-Native APIs

Bun provides high-performance native APIs:

### Bun.serve (High Performance)

```typescript
const server = Bun.serve({
    port: process.env.APP_PORT || 3000,
    fetch(req) {
        const url = new URL(req.url);

        if (url.pathname === '/health') {
            return new Response(JSON.stringify({ status: 'healthy' }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response('Hello from Bun.serve!');
    },
});

console.log(`Server running on port ${server.port}`);
```

### File I/O with Bun.file

```typescript
// Fast file reading
const file = Bun.file('data.json');
const data = await file.json();

// Fast file writing
await Bun.write('output.json', JSON.stringify(data));
```

### SQLite with Bun

```typescript
import { Database } from 'bun:sqlite';

const db = new Database('mydb.sqlite');
const query = db.query('SELECT * FROM users WHERE id = ?');
const user = query.get(1);
```

## Example Repository Structure

```
my-bun-api/
├── package.json           # Dependencies and scripts
├── bun.lockb             # Bun lockfile (binary format)
├── .bun-version          # Optional: Pin Bun version
├── bunfig.toml           # Optional: Bun configuration
├── tsconfig.json         # TypeScript configuration
├── index.ts              # Application entry point
├── pre-deploy.sh         # Optional: Pre-deployment hook
├── post-deploy.sh        # Optional: Post-deployment hook
├── src/
│   ├── routes/
│   │   ├── users.ts
│   │   └── auth.ts
│   ├── models/
│   │   └── user.ts
│   └── middleware/
│       └── auth.ts
└── test/
    └── api.test.ts
```

## Next Steps

- [Environment Variables Reference](../configuration/environment-reference)
- [Deployment Hooks Guide](../hooks/deployment-hooks)
- [CI/CD Setup](../ci-cd/github-webhooks)
- [Troubleshooting](../troubleshooting/common-issues)
