---
sidebar_position: 1
title: Environment Variables Reference
description: Complete reference for all Deploy with Git environment variables
---

# Environment Variables Reference

This page provides a comprehensive reference for all environment variables supported by Deploy with Git. Use these variables to customize your deployment behavior.

## Required Variables

These variables must be set for Deploy with Git to function:

### `GIT_REPO_URL`
- **Type**: String (URL)
- **Required**: Yes
- **Description**: The Git repository URL to deploy
- **Example**: `https://github.com/username/repository`

```bash
-e GIT_REPO_URL=https://github.com/timlrx/tailwind-nextjs-starter-blog
```

### `APP_PORT`
- **Type**: Integer
- **Required**: Yes
- **Description**: The port your application listens on inside the container
- **Example**: `3000`, `5000`, `8080`

```bash
-e APP_PORT=3000
```

## Git & Repository Configuration

### `GIT_BRANCH`
- **Type**: String
- **Default**: `main`
- **Description**: Git branch to deploy
- **Example**: `main`, `master`, `develop`, `production`

```bash
-e GIT_BRANCH=production
```

### `GIT_TOKEN`
- **Type**: String
- **Required**: For private repositories
- **Description**: Personal access token for private repository access
- **Security**: Never commit tokens to version control

```bash
-e GIT_TOKEN=ghp_YourGitHubPersonalAccessToken
```

:::caution Security Note
Store tokens securely using Docker secrets or environment files. Never expose tokens in logs or commit them to repositories.
:::

### `PROJECT_PATH`
- **Type**: String (Path)
- **Default**: Repository root
- **Description**: Subdirectory within the repository to deploy (monorepo support)
- **Example**: `frontend`, `apps/web`, `services/api`

```bash
# Deploy only the frontend folder from a monorepo
-e PROJECT_PATH=frontend
```

### `PROJECT_TYPE`
- **Type**: String
- **Default**: `auto`
- **Options**: `auto`, `node`, `python`, `ruby`, `go`, `bun`, `rust`, `java`, `dotnet`, `php`
- **Description**: Force a specific project type instead of auto-detection

```bash
# Force Node.js even if other files exist
-e PROJECT_TYPE=node

# Force Java even if other files exist
-e PROJECT_TYPE=java

# Force .NET even if other files exist
-e PROJECT_TYPE=dotnet
```

## Runtime Versions

### `NODE_VERSION`
- **Type**: String
- **Default**: Detected from `.nvmrc` or `package.json`, fallback to LTS
- **Description**: Specific Node.js version to install
- **Format**: `18.19.0`, `20.11.0`, `lts/iron`

```bash
-e NODE_VERSION=20.11.0
```

### `PYTHON_VERSION`
- **Type**: String
- **Default**: Detected from `.python-version` or `pyproject.toml`, fallback to 3.11
- **Description**: Specific Python version to install
- **Format**: `3.8`, `3.9`, `3.10`, `3.11`, `3.12`, `3.13`

```bash
-e PYTHON_VERSION=3.11
```

### `RUBY_VERSION`
- **Type**: String
- **Default**: Detected from `.ruby-version` or `Gemfile`, fallback to 3.0
- **Description**: Specific Ruby version to install
- **Format**: `2.7.8`, `3.0.6`, `3.1.4`

```bash
-e RUBY_VERSION=3.1.4
```

### `GO_VERSION`
- **Type**: String
- **Default**: Detected from `.go-version` or `go.mod`, fallback to 1.22.0
- **Description**: Specific Go version to install
- **Format**: `1.21.0`, `1.22.0`, `1.22.5`

```bash
-e GO_VERSION=1.22.0
```

### `CGO_ENABLED`
- **Type**: Integer (`0` or `1`)
- **Default**: `0` (disabled)
- **Description**: Enable or disable CGO for Go builds
- **Use Cases**:
  - `0` (default) - Static binaries, no C dependencies, maximum portability
  - `1` - Enable CGO if your app requires C libraries (SQLite, etc.)

```bash
# Default: Static binary (recommended)
-e CGO_ENABLED=0

# Enable CGO for C dependencies
-e CGO_ENABLED=1
```

### `JAVA_VERSION`
- **Type**: String
- **Default**: Detected from `pom.xml` or `build.gradle`, fallback to 17
- **Description**: Specific Java version to install
- **Format**: `8`, `11`, `17`, `21`
- **Supported Versions**: Java 8, 11, 17, 21

```bash
# Use Java 17 (default)
-e JAVA_VERSION=17

# Use Java 21 for latest features
-e JAVA_VERSION=21

# Use Java 11 for compatibility
-e JAVA_VERSION=11
```

### `DOTNET_VERSION`
- **Type**: String
- **Default**: Detected from `global.json` or `.csproj` TargetFramework, fallback to 8.0
- **Description**: Specific .NET SDK version to install
- **Format**: `6.0`, `7.0`, `8.0`, `9.0`
- **Supported Versions**: .NET 6.0 through 9.0

```bash
# Use .NET 8.0 (default)
-e DOTNET_VERSION=8.0

# Use .NET 9.0 for latest features
-e DOTNET_VERSION=9.0

# Use .NET 6.0 LTS
-e DOTNET_VERSION=6.0
```

### `BUN_VERSION`
- **Type**: String
- **Default**: Detected from `.bun-version` or `package.json`, fallback to latest
- **Description**: Specific Bun version to install
- **Format**: `1.0.25`, `1.0.30`, `latest`

```bash
-e BUN_VERSION=1.0.25
```

### `RUST_VERSION`
- **Type**: String
- **Default**: Detected from `rust-toolchain.toml` or `rust-toolchain`, fallback to `stable`
- **Description**: Specific Rust version or channel to install
- **Format**: `stable`, `nightly`, `beta`, `1.75.0`, `1.76.0`

```bash
# Use stable channel (recommended)
-e RUST_VERSION=stable

# Use nightly for experimental features
-e RUST_VERSION=nightly

# Use specific version
-e RUST_VERSION=1.75.0
```

### `PHP_VERSION`
- **Type**: String
- **Default**: Detected from `composer.json` platform requirement, fallback to 8.2
- **Description**: Specific PHP version to install
- **Format**: `7.4`, `8.0`, `8.1`, `8.2`, `8.3`
- **Supported Versions**: PHP 7.4 through 8.3

```bash
# Use PHP 8.2 (default)
-e PHP_VERSION=8.2

# Use PHP 8.3 for latest features
-e PHP_VERSION=8.3

# Use PHP 8.1 for compatibility
-e PHP_VERSION=8.1
```

### `PHP_EXTENSIONS`
- **Type**: String (comma-separated)
- **Default**: None (common extensions installed by default)
- **Description**: Additional PHP extensions to install beyond the default set
- **Default Extensions**: cli, common, mysql, pgsql, sqlite3, curl, gd, mbstring, xml, zip, bcmath, intl, redis, opcache
- **Format**: Comma-separated list of extension names

```bash
# Install ImageMagick and Memcached extensions
-e PHP_EXTENSIONS="imagick,memcached"

# Install multiple extensions
-e PHP_EXTENSIONS="imagick,memcached,xdebug,mongodb"

# Common additional extensions:
# - imagick: ImageMagick for image processing
# - memcached: Memcached client
# - xdebug: Debugging and profiling
# - mongodb: MongoDB driver
# - amqp: RabbitMQ client
# - soap: SOAP protocol support
# - ldap: LDAP support
```

## Memory & Performance Configuration

### `NODE_OPTIONS`
- **Type**: String
- **Default**: Auto-configured to `--max-old-space-size=<75% of container RAM>`
- **Description**: Node.js runtime options, primarily used for memory limits
- **Auto-Configuration**:
  - Automatically set to 75% of container memory
  - Minimum: 1024MB (1GB)
  - Maximum: 8192MB (8GB)
  - Example: 4GB container → `--max-old-space-size=3072`
- **Use Case**: Override for custom memory requirements or other Node.js flags

```bash
# Auto-configured (recommended):
# Just set Docker memory limit, NODE_OPTIONS auto-configured
--memory="4g"

# Manual override:
-e NODE_OPTIONS="--max-old-space-size=5120"

# Multiple flags:
-e NODE_OPTIONS="--max-old-space-size=4096 --experimental-worker"
```

:::tip Memory Auto-Configuration
For most applications, you don't need to set `NODE_OPTIONS`. Simply allocate adequate memory to the Docker container:
- Small apps (2-4GB container): Auto-configures 1.5-3GB Node.js heap
- Large apps (6-8GB container): Auto-configures 4.5-6GB Node.js heap
- Very large builds (Aave, Uniswap): Use 6-8GB container for auto-config

The system automatically logs the configured memory: `Auto-configured Node.js heap: 3072MB (container: 4096MB)`
:::

### `JAVA_OPTS`
- **Type**: String
- **Default**: Auto-configured JVM options based on container memory
- **Description**: JVM options for Java builds and runtime
- **Auto-Configuration**:
  - Heap memory: 75% of container memory
  - Minimum: 512MB
  - Maximum: 8192MB (8GB)
  - Includes: `-Xms`, `-Xmx`, `-XX:+UseG1GC`, `-XX:+UseContainerSupport`
  - Example: 4GB container → `-Xms3072m -Xmx3072m -XX:+UseG1GC ...`

```bash
# Auto-configured (recommended):
# Just set Docker memory limit
--memory="4g"

# Manual override:
-e JAVA_OPTS="-Xms2g -Xmx4g -XX:+UseG1GC"

# Custom GC settings:
-e JAVA_OPTS="-Xmx4g -XX:+UseZGC -XX:MaxGCPauseMillis=100"
```

:::tip JVM Auto-Configuration
The auto-configured `JAVA_OPTS` includes:
- `UseG1GC` - Low-latency garbage collector
- `MaxGCPauseMillis=200` - Target 200ms max GC pause
- `UseContainerSupport` - Proper container memory detection
- `java.security.egd=file:/dev/./urandom` - Faster startup

Override only if you need specific GC tuning or custom JVM flags.
:::

### `ASPNETCORE_ENVIRONMENT`
- **Type**: String
- **Default**: `Production`
- **Options**: `Development`, `Staging`, `Production`
- **Description**: ASP.NET Core environment setting
- **Effects**:
  - `Development` - Detailed errors, no optimization
  - `Production` - Optimized, minimal errors (recommended)
  - `Staging` - Production-like with extra logging

```bash
# Production (default, recommended)
-e ASPNETCORE_ENVIRONMENT=Production

# Development (for debugging)
-e ASPNETCORE_ENVIRONMENT=Development

# Staging environment
-e ASPNETCORE_ENVIRONMENT=Staging
```

## Build & Deployment Configuration

### `BUILD_COMMAND`
- **Type**: String
- **Default**: Auto-detected based on project type
- **Description**: Override the build command
- **Examples**:
  - Node.js: `npm run build`, `yarn build`, `npm run build:production`
  - Python: `python manage.py collectstatic`, `mkdocs build`
  - Ruby: `bundle exec rake assets:precompile`
  - Java: `mvn clean package`, `gradle build`
  - .NET: `dotnet publish -c Release`

```bash
-e BUILD_COMMAND="npm run build:production && npm run optimize"
```

### `RUN_COMMAND`
- **Type**: String
- **Default**: Auto-detected from package.json, requirements.txt, etc.
- **Description**: Override the command to start your application
- **Examples**:
  - Node.js: `npm start`, `node server.js`, `npm run serve`
  - Python: `python app.py`, `gunicorn app:application`, `python manage.py runserver`
  - Ruby: `bundle exec rails server`, `ruby app.rb`
  - Go: `./app` (binary name)
  - Java: `java -jar app.jar`
  - .NET: `dotnet publish/app.dll`

```bash
-e RUN_COMMAND="npm run start:production"
```

### `DEPLOYMENT_TIMEOUT`
- **Type**: Integer (seconds)
- **Default**: `1800` (30 minutes)
- **Description**: Maximum time allowed for a deployment to complete
- **Range**: 300-7200 (5 minutes to 2 hours)
- **Safety**: If deployment exceeds this time, automatic rollback is triggered

```bash
# Allow longer deployments (1 hour)
-e DEPLOYMENT_TIMEOUT=3600

# Shorter timeout for fast builds (10 minutes)
-e DEPLOYMENT_TIMEOUT=600
```

:::info Deployment Safety
Deploy with Git includes a deployment watchdog that monitors deployment duration. If a deployment gets stuck (network issues, infinite loops, etc.), the system will automatically:
1. Detect the timeout
2. Stop the deployment
3. Rollback to the last working release
4. Restart the application

This prevents deployments from hanging indefinitely and ensures your application remains available.
:::

### `FORCE_INSTALL`
- **Type**: Boolean (`true`/`false`)
- **Default**: `false`
- **Description**: Force dependency reinstall, bypassing cache
- **Use Cases**: Clear corrupted cache, force fresh install, debugging

```bash
# Force fresh dependency installation
-e FORCE_INSTALL=true
```

:::tip Dependency Caching
Deploy with Git automatically caches dependencies based on lock file hashes:
- `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml` (Node.js)
- `requirements.txt`, `poetry.lock` (Python)
- `Gemfile.lock` (Ruby)
- `go.sum` (Go)
- `Cargo.lock` (Rust)
- `pom.xml`, `build.gradle` (Java)
- `packages.lock.json` (.NET)
- `composer.lock` (PHP)

If lock files haven't changed, installation is skipped, saving 30-180 seconds per deployment.
:::

## CI/CD & Webhook Configuration

### `WEBHOOK_SECRET`
- **Type**: String
- **Description**: Secret for validating webhook requests
- **Security**: Use a strong, random string
- **Providers**: GitHub, GitLab, Bitbucket

```bash
-e WEBHOOK_SECRET=your_strong_webhook_secret_here
```

### `API_KEY`
- **Type**: String
- **Default**: Empty (no authentication)
- **Description**: API key for securing `/status` and `/health` endpoints
- **Security**: Use a strong, random string; independent from `WEBHOOK_SECRET`

```bash
# Protect API endpoints with authentication
-e API_KEY=your_secure_api_key_here

# Access protected endpoints
curl -H "Authorization: Bearer your_secure_api_key_here" http://localhost:9001/status
```

:::info API Authentication
When `API_KEY` is set, the `/status` and `/health` endpoints require authentication via the `Authorization: Bearer <token>` header. If `API_KEY` is not set, these endpoints remain publicly accessible (backward compatible).

The `API_KEY` is independent from `WEBHOOK_SECRET`:
- `WEBHOOK_SECRET` - Used for webhook signature verification (GitHub/GitLab/Bitbucket)
- `API_KEY` - Used for API endpoint authentication (/status, /health)

This separation allows you to:
- Share webhook secrets with GitHub without exposing API access
- Rotate API keys independently from webhook configurations
- Use different keys for different security purposes
:::

### `POLLING_INTERVAL`
- **Type**: Integer (seconds)
- **Default**: `0` (disabled)
- **Description**: Interval for polling Git repository for changes
- **Range**: 0 (disabled) or 60-86400 (1 minute to 24 hours)

```bash
# Check for updates every 5 minutes
-e POLLING_INTERVAL=300
```

## Health Check Configuration

Deploy with Git uses a simplified health check system with HTTP-based checks and configurable retries.

### `HEALTH_CHECK_RETRIES`
- **Type**: Integer
- **Default**: `3`
- **Description**: Number of health check attempts before marking deployment as failed
- **Range**: 1-10
- **Use Case**: Increase for slow-starting applications

```bash
# More retries for slow-starting apps
-e HEALTH_CHECK_RETRIES=5
```

### `HEALTH_CHECK_DELAY`
- **Type**: Integer (seconds)
- **Default**: `10`
- **Description**: Delay between health check attempts
- **Range**: 5-60
- **Use Case**: Increase for applications that take longer to start

```bash
# Wait 15 seconds between health checks
-e HEALTH_CHECK_DELAY=15
```

### `SKIP_HEALTH_CHECK`
- **Type**: Boolean (`true`/`false`)
- **Default**: `false`
- **Description**: Skip health checks entirely (for testing only)
- **Warning**: Only use for debugging/testing

```bash
# Skip health checks (testing only)
-e SKIP_HEALTH_CHECK=true
```

:::caution Health Check Behavior
Health checks:
1. **Custom Script**: If `.flux-pod/health-check` exists and is executable, it runs your custom script
2. **HTTP Check**: Otherwise, checks `http://localhost:${APP_PORT}/` for 2xx/3xx response
3. **Retries**: Attempts `HEALTH_CHECK_RETRIES` times with `HEALTH_CHECK_DELAY` seconds between attempts
4. **Failure**: If all retries fail, deployment is rolled back

Always ensure your application responds to HTTP requests or provide a custom health check script.
:::

## Deployment Hooks Configuration

Deployment hooks allow you to run custom scripts at specific points in the deployment lifecycle. See the [Deployment Hooks Guide](../hooks/deployment-hooks) for detailed usage.

### `SKIP_HOOKS`
- **Type**: Boolean (`true`/`false`)
- **Default**: `false`
- **Description**: Disable all deployment hooks for this deployment
- **Use Cases**: Emergency deployments, debugging, skipping migrations

```bash
# Disable hooks for this deployment
-e SKIP_HOOKS=true
```

:::info When to Skip Hooks
Use `SKIP_HOOKS=true` when:
- You need to deploy without running migrations
- Debugging hook failures
- Emergency hotfix that must deploy immediately
- Testing deployment without side effects
:::

### `HOOK_TIMEOUT`
- **Type**: Integer (seconds)
- **Default**: `300` (5 minutes)
- **Description**: Maximum time allowed for a hook to execute
- **Range**: 60-3600 (1 minute to 1 hour)
- **Applies to**: Both pre-deploy.sh and post-deploy.sh

```bash
# Increase timeout for slow migrations (15 minutes)
-e HOOK_TIMEOUT=900

# Short timeout for fast hooks (2 minutes)
-e HOOK_TIMEOUT=120
```

:::caution Hook Timeouts
If a hook exceeds `HOOK_TIMEOUT`:
- Hook is killed automatically
- Pre-deploy timeout triggers deployment rollback
- Post-deploy timeout is logged as warning (non-fatal)
- Check `/app/logs/hooks.log` for timeout messages
:::

### Hook Scripts

Place these scripts in your repository root:

- **`pre-deploy.sh`** - Runs after build, before app starts (e.g., migrations)
- **`post-deploy.sh`** - Runs after app starts successfully (e.g., cache warming, notifications)

```bash
#!/bin/bash
# pre-deploy.sh - Database migrations
set -e
npx prisma migrate deploy
```

See [Deployment Hooks Guide](../hooks/deployment-hooks) for:
- Creating hook scripts
- Real-world examples (Prisma, Django, Rails)
- Error handling and troubleshooting
- Security best practices

## Environment Files

### Using `.env` Files

Instead of passing multiple `-e` flags, use an environment file:

```bash
# Create .env file
cat > flux-orbit.env << EOF
GIT_REPO_URL=https://github.com/username/repo
APP_PORT=3000
GIT_BRANCH=production
NODE_VERSION=20.11.0
BUILD_COMMAND=npm run build:production
WEBHOOK_SECRET=my_secret
HEALTH_CHECK_RETRIES=5
HEALTH_CHECK_DELAY=15
EOF

# Use with Docker
docker run -d \
  --env-file flux-orbit.env \
  -p 3000:3000 \
  -p 9001:9001 \
  runonflux/orbit:latest
```

## Complete Example

Here's a comprehensive example using multiple environment variables:

```bash
docker run -d \
  --name production-app \
  --memory="4g" \
  -e GIT_REPO_URL=https://github.com/company/main-app \
  -e GIT_BRANCH=production \
  -e GIT_TOKEN=ghp_YourToken \
  -e PROJECT_PATH=apps/web \
  -e APP_PORT=3000 \
  -e NODE_VERSION=20.11.0 \
  -e BUILD_COMMAND="npm run build:production" \
  -e RUN_COMMAND="npm run start:production" \
  -e DATABASE_URL=postgresql://user:pass@db:5432/prod \
  -e WEBHOOK_SECRET=webhook_secret_123 \
  -e API_KEY=api_key_456 \
  -e POLLING_INTERVAL=300 \
  -e HEALTH_CHECK_RETRIES=5 \
  -e HEALTH_CHECK_DELAY=10 \
  -e HOOK_TIMEOUT=600 \
  -e DEPLOYMENT_TIMEOUT=1800 \
  -p 3000:3000 \
  -p 9001:9001 \
  runonflux/orbit:latest
```

## Best Practices

1. **Security First**
   - Never commit secrets to version control
   - Use Docker secrets or environment files for sensitive data
   - Rotate tokens and API keys regularly
   - Set strong `WEBHOOK_SECRET` and `API_KEY` values

2. **Performance Optimization**
   - Let `NODE_OPTIONS` and `JAVA_OPTS` auto-configure based on container memory
   - Set appropriate Docker memory limits (--memory flag)
   - Use production build commands
   - Enable dependency caching (default behavior)

3. **Reliability**
   - Configure appropriate `HEALTH_CHECK_RETRIES` and `HEALTH_CHECK_DELAY` for your app
   - Set `DEPLOYMENT_TIMEOUT` based on build complexity
   - Use `HOOK_TIMEOUT` that accommodates your migrations
   - Test deployments with `SKIP_HOOKS=true` first if unsure

4. **Version Control**
   - Pin runtime versions for consistency (`NODE_VERSION`, `JAVA_VERSION`, etc.)
   - Document environment variables in your repository README
   - Use environment files for complex configurations
   - Test version upgrades in staging first

## Troubleshooting

If environment variables aren't working as expected:

1. **Check variable names** - They are case-sensitive
2. **Verify quotes** - Use quotes for values with spaces
3. **Check logs** - `docker logs container-name`
4. **Review build logs** - `/app/logs/setup.log` inside container
5. **Validate configuration** - Check `/status` endpoint for active config


## Next Steps

- Learn about [CI/CD Integration](../ci-cd/github-webhooks)
- Explore [Deployment Hooks Guide](../hooks/deployment-hooks)
- Read about [Troubleshooting](../troubleshooting/common-issues)
