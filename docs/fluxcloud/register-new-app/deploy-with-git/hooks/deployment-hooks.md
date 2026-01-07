---
sidebar_position: 3
title: Deployment Hooks
description: Run database migrations and custom scripts during deployment
---

# Deployment Hooks

Deployment hooks allow you to run custom scripts at specific points in your application's deployment lifecycle. This is essential for database migrations, cache warming, notifications, and other automated tasks.

## Overview

Flux-Orbit supports deployment hooks through bash scripts placed in your repository root. These hooks run automatically during deployments and updates. The system automatically makes hook files executable - no `chmod +x` required!

### Available Hooks

| Hook File | When It Runs | Use Cases | Failure Impact |
|-----------|--------------|-----------|----------------|
| `pre-deploy.sh` | After dependencies install, before build | Database migrations, schema updates | Triggers rollback |
| `post-deploy.sh` | After application starts successfully | Cache warming, notifications, cleanup | Logged but non-fatal |

## Quick Start

### 1. Create Hook Scripts

Create bash scripts in your repository root:

**pre-deploy.sh** (for database migrations):
```bash
#!/bin/bash
set -e

echo "Running database migrations..."
npx prisma migrate deploy
```

**post-deploy.sh** (for notifications):
```bash
#!/bin/bash
set -e

echo "Deployment complete! Sending notification..."
curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL \
  -H 'Content-Type: application/json' \
  -d '{"text":"App deployed successfully!"}'
```

### 2. Commit and Deploy

```bash
git add pre-deploy.sh post-deploy.sh
git commit -m "Add deployment hooks"
git push
```

That's it! Your hooks will run automatically on the next deployment.

## Hook Execution Order

### Initial Deployment

```
1. Clone repository
2. Detect project type
3. Install runtime (Node.js/Python/Ruby)
4. Install dependencies
   ↓
5. Run pre-deploy.sh ← Hook runs here
   ↓
6. Build application
7. Start application
8. Health check (60s)
   ↓
9. Run post-deploy.sh ← Hook runs here
```

### CI/CD Updates (Webhooks/Polling)

```
1. Git pull latest code
2. Check if dependencies changed
3. Install/update dependencies if needed
   ↓
4. Run pre-deploy.sh ← Hook runs here
   ↓
5. Build application (if needed)
6. Stop current app
7. Start new version
8. Health check (60s)
   ↓
9. Run post-deploy.sh ← Hook runs here
```

If any step fails (including pre-deploy hook), the deployment rolls back to the previous working version.

## Hook Requirements

### Must Have

- <MDXIcon icon="mdi:check-circle" color="#22c55e" /> **Shebang line**: Must start with `#!/bin/bash`
- <MDXIcon icon="mdi:check-circle" color="#22c55e" /> **Exit codes**: Exit 0 for success, non-zero for failure
- <MDXIcon icon="mdi:check-circle" color="#22c55e" /> **Location**: Repository root (or `PROJECT_PATH` if using monorepos)

### Best Practices

- <MDXIcon icon="mdi:check-circle" color="#22c55e" /> **Use `set -e`**: Exit immediately on any error
- <MDXIcon icon="mdi:check-circle" color="#22c55e" /> **Be idempotent**: Safe to run multiple times
- <MDXIcon icon="mdi:check-circle" color="#22c55e" /> **Add logging**: Echo progress messages
- <MDXIcon icon="mdi:check-circle" color="#22c55e" /> **Handle secrets**: Use environment variables, not hardcoded values
- <MDXIcon icon="mdi:check-circle" color="#22c55e" /> **Test locally**: Run scripts manually before deploying

## Real-World Examples

### <MDXIcon icon="simple-icons:nodedotjs" /> Node.js with Prisma Migrations

```bash
#!/bin/bash
# pre-deploy.sh
set -e

echo "=========================================="
echo "Running Prisma Migrations"
echo "=========================================="

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

echo "Migrations completed successfully"
```

### <MDXIcon icon="simple-icons:django" /> Django with PostgreSQL

```bash
#!/bin/bash
# pre-deploy.sh
set -e

echo "=========================================="
echo "Running Django Migrations"
echo "=========================================="

# Run database migrations
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --noinput

echo "Django setup completed"
```

### <MDXIcon icon="simple-icons:rubyonrails" /> Rails with Redis Cache

```bash
#!/bin/bash
# pre-deploy.sh
set -e

echo "=========================================="
echo "Running Rails Migrations"
echo "=========================================="

# Run migrations
bundle exec rails db:migrate

# Clear cache to avoid stale data
bundle exec rails runner "Rails.cache.clear"

echo "Rails setup completed"
```

### <MDXIcon icon="simple-icons:slack" /> Post-Deploy: Slack Notification

```bash
#!/bin/bash
# post-deploy.sh
set -e

COMMIT_SHA=$(git rev-parse --short HEAD)
DEPLOY_TIME=$(date -u '+%Y-%m-%d %H:%M:%S UTC')

curl -X POST "$SLACK_WEBHOOK_URL" \
  -H 'Content-Type: application/json' \
  -d "{
    \"text\": \"Deployment Successful\",
    \"attachments\": [{
      \"color\": \"good\",
      \"fields\": [
        {\"title\": \"Commit\", \"value\": \"$COMMIT_SHA\", \"short\": true},
        {\"title\": \"Time\", \"value\": \"$DEPLOY_TIME\", \"short\": true}
      ]
    }]
  }"

echo "Notification sent to Slack"
```

### <MDXIcon icon="mdi:fire" /> Post-Deploy: Cache Warming

```bash
#!/bin/bash
# post-deploy.sh
set -e

echo "Warming up application caches..."

# Make requests to key endpoints
curl -s http://localhost:${APP_PORT}/api/popular-items >/dev/null
curl -s http://localhost:${APP_PORT}/api/categories >/dev/null
curl -s http://localhost:${APP_PORT}/api/featured >/dev/null

echo "Cache warming completed"
```

## Environment Variables

### Hook Control

```yaml
SKIP_HOOKS: "true"        # Disable all hooks for this deployment
HOOK_TIMEOUT: "600"       # Hook timeout in seconds (default: 300)
```

### Database Connections

```yaml
# PostgreSQL
DATABASE_URL: "postgresql://user:pass@host:5432/dbname"

# MySQL
DATABASE_URL: "mysql://user:pass@host:3306/dbname"

# MongoDB
MONGODB_URI: "mongodb://user:pass@host:27017/dbname"

# Redis
REDIS_URL: "redis://host:6379"
```

### Notification URLs

```yaml
SLACK_WEBHOOK_URL: "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
DISCORD_WEBHOOK_URL: "https://discord.com/api/webhooks/YOUR/WEBHOOK"
```

## Monorepo Support

If you're using `PROJECT_PATH` to deploy a subfolder, hooks can be placed in two locations:

### Option 1: Subfolder Hooks (Recommended)

```
monorepo/
├── apps/
│   └── frontend/
│       ├── package.json
│       ├── pre-deploy.sh   ← Runs for this app
│       └── post-deploy.sh
└── backend/
```

### Option 2: Root Hooks (Fallback)

```
monorepo/
├── pre-deploy.sh   ← Runs if subfolder hook not found
├── post-deploy.sh
└── apps/
    └── frontend/
        └── package.json
```

Flux-Orbit checks the subfolder first, then falls back to root if not found.

## Error Handling

### Pre-Deploy Hook Failures

If `pre-deploy.sh` exits with a non-zero code:
- <MDXIcon icon="mdi:close-circle" color="#ef4444" /> Deployment stops immediately
- <MDXIcon icon="mdi:refresh" color="#3b82f6" /> Automatic rollback to previous version
- <MDXIcon icon="mdi:file-document" color="#f59e0b" /> Error logged to `/app/logs/hooks.log`
- <MDXIcon icon="mdi:cancel" color="#ef4444" /> Application does not restart

**Example failure:**
```bash
#!/bin/bash
set -e

# This will fail if migrations have conflicts
npx prisma migrate deploy

# If the above fails (exit code != 0):
# - Deployment stops here
# - App rolls back to previous commit
# - Current version keeps running
```

### Post-Deploy Hook Failures

If `post-deploy.sh` exits with a non-zero code:
- <MDXIcon icon="mdi:alert" color="#f59e0b" /> Failure is logged as WARNING
- <MDXIcon icon="mdi:check-circle" color="#22c55e" /> Deployment continues (app keeps running)
- <MDXIcon icon="mdi:file-document" color="#f59e0b" /> Error logged to `/app/logs/hooks.log`
- <MDXIcon icon="mdi:refresh-off" color="#3b82f6" /> No rollback triggered

**Example (non-fatal):**
```bash
#!/bin/bash
set -e

# This might fail (e.g., Slack is down)
curl -X POST "$SLACK_WEBHOOK_URL" -d '{"text":"Deployed"}'

# If the above fails:
# - Warning is logged
# - App continues running
# - Deployment is still successful
```

### Hook Timeout

Hooks have a 5-minute timeout by default:

```bash
# If your hook takes longer than 5 minutes:
HOOK_TIMEOUT=900  # Increase to 15 minutes
```

When a hook times out:
- <MDXIcon icon="mdi:close-circle" color="#ef4444" /> Treated as failure
- <MDXIcon icon="mdi:refresh" color="#3b82f6" /> Pre-deploy timeout triggers rollback
- <MDXIcon icon="mdi:alert" color="#f59e0b" /> Post-deploy timeout is logged but non-fatal

## Troubleshooting

### Hook Not Running

**Problem**: Hook exists but doesn't execute

**Note**: As of recent versions, Flux-Orbit automatically makes hook files executable, so permission issues should be rare.

**Solutions**:
```bash
# 1. Verify shebang (most common issue)
head -1 pre-deploy.sh
# Should output: #!/bin/bash

# 2. Check if file exists in correct location
ls -la pre-deploy.sh
# Should be in repository root (or PROJECT_PATH)

# 3. Check logs for errors
docker logs <container-name> 2>&1 | grep -i hook

# 4. Verify SKIP_HOOKS is not set
docker exec <container-name> env | grep SKIP_HOOKS
# Should be empty or "false"
```

### Hook Fails with "Command Not Found"

**Problem**: Hook can't find commands like `npx`, `python`, `bundle`

**Cause**: PATH not set up or dependencies not installed

**Solutions**:
```bash
#!/bin/bash
set -e

# For Node.js: Use full path or ensure nvm is loaded
# The runtime is already installed and available
npx prisma migrate deploy  # This should work

# For Python: Use python/python3
python manage.py migrate

# For Ruby: Use bundle
bundle exec rails db:migrate
```

### Database Connection Fails

**Problem**: Hook can't connect to database

**Solutions**:

1. **Ensure `DATABASE_URL` is set**:
```yaml
# In Flux app configuration
DATABASE_URL: postgresql://user:pass@host:5432/db
```

2. **Test connection in hook**:
```bash
#!/bin/bash
set -e

if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL not set"
  exit 1
fi

echo "Database URL: ${DATABASE_URL%%:*}://***" # Don't log password
npx prisma migrate deploy
```

3. **Check network access**:
   - Ensure database host is accessible from Flux network
   - Check firewall rules
   - Verify credentials

### Hook Works Locally but Fails in Production

**Problem**: Hook runs fine locally but fails in Flux-Orbit

**Common causes**:

1. **Missing environment variables**:
```bash
# Add debug logging
echo "DATABASE_URL: ${DATABASE_URL:0:20}..." # First 20 chars
echo "NODE_ENV: $NODE_ENV"
```

2. **File paths are different**:
```bash
# Use absolute paths or $WORK_DIR
cd "$WORK_DIR" || exit 1  # Set by Flux-Orbit
npx prisma migrate deploy
```

3. **Dependencies not installed**:
```bash
# Ensure this is in pre-deploy.sh (after dependencies)
# Dependencies are already installed before pre-deploy runs
npx prisma migrate deploy  # Should work
```

### Viewing Hook Logs

```bash
# SSH into container or use docker exec
docker exec YOUR_CONTAINER cat /app/logs/hooks.log

# Or view all logs
docker logs YOUR_CONTAINER

# Look for:
# - "Running hook: pre-deploy.sh"
# - "Hook completed successfully"
# - "Hook failed with exit code X"
```

## Security Best Practices

### 1. Never Hardcode Secrets

<MDXIcon icon="mdi:close-circle" color="#ef4444" /> **Bad**:
```bash
#!/bin/bash
curl -X POST https://api.example.com \
  -H "Authorization: Bearer sk-1234567890abcdef"
```

<MDXIcon icon="mdi:check-circle" color="#22c55e" /> **Good**:
```bash
#!/bin/bash
if [ -z "$API_TOKEN" ]; then
  echo "ERROR: API_TOKEN not set"
  exit 1
fi

curl -X POST https://api.example.com \
  -H "Authorization: Bearer $API_TOKEN"
```

### 2. Validate Environment Variables

```bash
#!/bin/bash
set -e

# Validate required variables
required_vars=("DATABASE_URL" "REDIS_URL" "API_KEY")
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "ERROR: $var is not set"
    exit 1
  fi
done

# Proceed with migrations
npx prisma migrate deploy
```

### 3. Use Secure Connections

```bash
#!/bin/bash
set -e

# Ensure DATABASE_URL uses SSL
if [[ "$DATABASE_URL" != *"sslmode=require"* ]]; then
  export DATABASE_URL="${DATABASE_URL}?sslmode=require"
fi

python manage.py migrate
```

### 4. Limit Hook Permissions

```bash
#!/bin/bash
set -e

# Don't use sudo or run as root
# Flux-Orbit runs as non-root user 'appuser'

# This is fine:
npx prisma migrate deploy

# This would fail (no sudo):
# sudo systemctl restart nginx
```

## Migration Guide

### From Heroku Release Phase

**Heroku (Procfile)**:
```
release: npx prisma migrate deploy
web: npm start
```

**Flux-Orbit (pre-deploy.sh)**:
```bash
#!/bin/bash
set -e
npx prisma migrate deploy
```

### From Render Deploy Hooks

**Render (render.yaml)**:
```yaml
services:
  - type: web
    buildCommand: npm run build
    preDeployCommand: npx prisma migrate deploy
    startCommand: npm start
```

**Flux-Orbit (pre-deploy.sh)**:
```bash
#!/bin/bash
set -e
npx prisma migrate deploy
```

### From Railway Deploy Hooks

**Railway (railway.json)**:
```json
{
  "build": {
    "buildCommand": "npm run build"
  },
  "deploy": {
    "deployCommand": "npx prisma migrate deploy && npm start"
  }
}
```

**Flux-Orbit (pre-deploy.sh + package.json)**:
```bash
#!/bin/bash
# pre-deploy.sh
set -e
npx prisma migrate deploy
```

```json
{
  "scripts": {
    "start": "node index.js"
  }
}
```

## Advanced Examples

### Conditional Migrations

```bash
#!/bin/bash
# pre-deploy.sh
set -e

# Only run migrations in production
if [ "$NODE_ENV" = "production" ]; then
  echo "Running production migrations..."
  npx prisma migrate deploy
else
  echo "Skipping migrations (not production)"
fi
```

### Multi-Database Migrations

```bash
#!/bin/bash
# pre-deploy.sh
set -e

echo "Running migrations for primary database..."
DATABASE_URL="$PRIMARY_DATABASE_URL" npx prisma migrate deploy

echo "Running migrations for analytics database..."
DATABASE_URL="$ANALYTICS_DATABASE_URL" npx prisma migrate deploy

echo "All migrations completed"
```

### Multi-Instance Migration Coordination

```bash
#!/bin/bash
# pre-deploy.sh
set -e

# Run migrations only on first instance in multi-instance deployment
# Use a distributed lock or leader election if needed
if [ "$FLUX_PEER_INDEX" = "0" ]; then
  echo "Running migrations (primary instance)..."
  npx prisma migrate deploy
else
  echo "Skipping migrations (secondary instance $FLUX_PEER_INDEX)"
  # Wait for primary to finish migrations
  sleep 10
fi
```

### Rollback on Migration Failure

```bash
#!/bin/bash
# pre-deploy.sh
set -e

CURRENT_COMMIT=$(git rev-parse HEAD)

echo "Current commit: $CURRENT_COMMIT"
echo "Running migrations..."

if npx prisma migrate deploy; then
  echo "Migrations successful"
else
  echo "ERROR: Migrations failed"
  echo "Deployment will rollback automatically"
  exit 1
fi
```

## Next Steps

- Learn about [CI/CD Integration](../ci-cd/github-webhooks)
- Explore [Environment Variables](../configuration/environment-reference)
- See [Common Issues](../troubleshooting/common-issues)
