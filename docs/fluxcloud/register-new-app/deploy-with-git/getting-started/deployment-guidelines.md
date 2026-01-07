---
sidebar_position: 4
title: Deployment Guidelines
description: What types of apps can be deployed on Flux-Orbit
---

# Deployment Guidelines

This guide helps you understand what types of applications are suitable for deployment on Flux-Orbit and the architectural requirements.

## Core Principle: Stateless Applications

Flux-Orbit is designed for **stateless applications** that run in containers on the Flux Network. Your application code and dependencies are containerized, but **persistent data must be stored externally**.

### <MDXIcon icon="mdi:check-circle" size={20} color="#22c55e" /> What Can Be Deployed

#### Web Applications
- **Frontend apps**: <MDXIcon icon="simple-icons:react" /> React, <MDXIcon icon="simple-icons:vuedotjs" /> Vue, <MDXIcon icon="simple-icons:angular" /> Angular, <MDXIcon icon="simple-icons:svelte" /> Svelte, <MDXIcon icon="simple-icons:nextdotjs" /> Next.js, <MDXIcon icon="simple-icons:nuxtdotjs" /> Nuxt
- **Static sites**: HTML/CSS/JS, documentation sites, landing pages
- **Server-rendered apps**: Next.js SSR, Nuxt SSR, SvelteKit

#### Backend APIs
- **REST APIs**: <MDXIcon icon="simple-icons:express" /> Express, <MDXIcon icon="simple-icons:fastapi" /> FastAPI, <MDXIcon icon="simple-icons:django" /> Django REST, <MDXIcon icon="simple-icons:rubyonrails" /> Rails API, <MDXIcon icon="simple-icons:laravel" /> Laravel, <MDXIcon icon="simple-icons:go" /> Gin, <MDXIcon icon="simple-icons:rust" /> Actix-web
- **GraphQL APIs**: Apollo Server, Hasura client apps
- **Microservices**: Stateless services that process requests and return responses

#### Real-time Applications
- **WebSocket servers**: Chat applications, live updates, notifications
- **SSE (Server-Sent Events)**: Real-time data streaming

### <MDXIcon icon="mdi:close-circle" size={20} color="#ef4444" /> What Should NOT Be Deployed

Applications that store critical data locally:
- <MDXIcon icon="mdi:close" color="#ef4444" /> **Databases** (PostgreSQL, MySQL, MongoDB) - Use Flux Clustered DBs or hosted database services instead
- <MDXIcon icon="mdi:close" color="#ef4444" /> **File storage systems** - Use Flux Storage or similar instead
- <MDXIcon icon="mdi:close" color="#ef4444" /> **Session stores** - Use Redis, database sessions, or JWT tokens instead
- <MDXIcon icon="mdi:close" color="#ef4444" /> **Stateful applications with local file writes** - Uploads will be lost on redeploy

## Data Storage: Use External Services

Since containers are ephemeral and can be redeployed at any time, **all persistent data must be stored externally**.

### Database Storage

Use Flux Database services:

```yaml
Environment Variables:
  # PostgreSQL
  DATABASE_URL: postgresql://user:pass@your-db-host.com:5432/dbname

  # MySQL
  DATABASE_URL: mysql://user:pass@your-db-host.com:3306/dbname

  # MongoDB
  MONGODB_URI: mongodb://user:pass@your-db-host.com:27017/dbname
```

Popular database hosting options:
- <MDXIcon icon="simple-icons:postgresql" /> **PostgreSQL**: Flux PostgreSQL Cluster, Supabase, Neon, Railway
- <MDXIcon icon="simple-icons:mysql" /> **MySQL**: Flux Shared DB, PlanetScale, Railway, AWS RDS
- <MDXIcon icon="simple-icons:mongodb" /> **MongoDB**: Flux MongoDB Cluster, MongoDB Atlas
- <MDXIcon icon="simple-icons:redis" /> **Redis**: Upstash, Redis Cloud
### Session Management
For stateful user sessions:
**Option 1: External Session Store (Recommended)**
```yaml
Environment Variables:
  # Redis for sessions
  REDIS_URL: redis://your-redis-host.com:6379
  SESSION_STORE: redis
```
**Option 2: JWT Tokens (Stateless)**
```javascript
// No server-side storage needed
// Sessions encoded in signed tokens
```

**Option 3: Database Sessions**
```yaml
Environment Variables:
  # Store sessions in your database
  DATABASE_URL: postgresql://...
  SESSION_STORE: database
```
## Architecture Patterns

### <MDXIcon icon="mdi:check-circle" size={18} color="#22c55e" /> Good: Stateless API with External Database

<ArchitectureDiagram
  type="good"
  title="Flux-Orbit (Your API) - Stateless"
  items={[
    { label: 'Express.js App', icon: 'simple-icons:express', status: 'good' },
    { label: 'Stateless Design', icon: 'mdi:check-circle', status: 'good' },
  ]}
  externalService={{
    name: 'PostgreSQL',
    icon: 'simple-icons:postgresql'
  }}
  description={[
    'Express.js API',
    'Connects to PostgreSQL on Supabase',
    'Uses Redis on Upstash for caching',
    'Uploads files to Cloudflare R2'
  ]}
/>

### <MDXIcon icon="mdi:close-circle" size={18} color="#ef4444" /> Bad: Application with Local Storage

<ArchitectureDiagram
  type="bad"
  title="Flux-Orbit - Your App"
  items={[
    { label: 'SQLite DB', icon: 'simple-icons:sqlite', status: 'bad', note: 'Data lost on redeploy!' },
    { label: 'Local files', icon: 'mdi:folder', status: 'bad', note: 'Uploads lost!' }
  ]}
/>

## Common Use Cases

### E-commerce Application

```yaml
# Your Flux-Orbit app
GIT_REPO_URL: https://github.com/you/ecommerce-app
APP_PORT: 3000

# External services
DATABASE_URL: postgresql://shop_db@neon.tech/shop
REDIS_URL: redis://cache@upstash.io:6379
S3_BUCKET: product-images
STRIPE_API_KEY: sk_live_...
```
**What's deployed:** Node.js/Python/Ruby app (stateless)
**What's external:** Database, cache, file storage, payments
### SaaS Dashboard
```yaml
# Your Flux-Orbit app
GIT_REPO_URL: https://github.com/you/saas-dashboard
APP_PORT: 8000

# External services
DATABASE_URL: postgresql://users@supabase.co/prod
REDIS_URL: redis://sessions@upstash.io:6379
SMTP_HOST: smtp.sendgrid.net
```
**What's deployed:** Python FastAPI backend (stateless)
**What's external:** User database, session cache, email service
### Real-time Chat Application
```yaml
# Your Flux-Orbit app
GIT_REPO_URL: https://github.com/you/chat-app
APP_PORT: 3000

# External services
DATABASE_URL: postgresql://chat@neon.tech/messages
REDIS_URL: redis://pubsub@upstash.io:6379
```
**What's deployed:** WebSocket server (stateless)
**What's external:** Message history, pub/sub for real-time events
## Quick Checklist
Before deploying, verify:
- [ ] Application doesn't write files to local disk (or writes are temporary/cacheable)
- [ ] Database connection uses `DATABASE_URL` environment variable
- [ ] File uploads go to S3/R2/external storage
- [ ] Sessions use Redis, database, or JWT tokens (not local memory)
- [ ] Application can handle being restarted at any time
- [ ] No hardcoded localhost connections (use environment variables)

## Migration Tips

If your app currently uses local storage:

### SQLite → PostgreSQL/MySQL
```bash
# Export SQLite data
sqlite3 mydb.db .dump > dump.sql
# Import to PostgreSQL (adjust syntax)
psql $DATABASE_URL < dump.sql
# Update app to use DATABASE_URL
```

### Local Files → S3/R2
```javascript
// Before: Local storage
fs.writeFile('./uploads/image.jpg', data);
// After: S3 storage
await s3.upload({
  Bucket: process.env.S3_BUCKET,
  Key: 'image.jpg',
  Body: data
});
```

### Memory Sessions → Redis
```javascript
// Before: In-memory sessions
const session = require('express-session');
app.use(session({ store: new MemoryStore() }));
// After: Redis sessions
const RedisStore = require('connect-redis').default;
app.use(session({
  store: new RedisStore({ url: process.env.REDIS_URL })
}));
```

## Next Steps

- **[Quick Start](../getting-started/quick-start)** - Deploy your first app
- **[Deployment Hooks](../hooks/deployment-hooks)** - Run database migrations
- **[Environment Reference](../configuration/environment-reference)** - Configure external services
- **[Troubleshooting](../troubleshooting/common-issues)** - Common issues and solutions