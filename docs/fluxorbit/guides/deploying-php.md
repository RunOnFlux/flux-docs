---
sidebar_position: 8
title: Deploying PHP Applications
description: Complete guide for deploying PHP applications with Flux-Orbit
---

# Deploying PHP Applications

This comprehensive guide covers everything you need to know about deploying PHP applications with Flux-Orbit, from lightweight Slim APIs to full Laravel applications.

## Overview

Flux-Orbit automatically detects PHP applications by looking for:
- `composer.json` (primary indicator)
- `composer.lock` for dependency resolution
- Framework detection via dependencies in composer.json

## Basic PHP Deployment

### Simple Slim API

```bash
docker run -d \
  --name slim-api \
  -e GIT_REPO_URL=https://github.com/your-username/slim-api \
  -e APP_PORT=8000 \
  -p 8000:8000 \
  runonflux/orbit:latest
```

### What Happens Automatically

1. **Detection**: Finds `composer.json` and identifies as PHP project
2. **Version Selection**:
   - Checks `PHP_VERSION` environment variable
   - Checks `php` or `platform.php` in composer.json
   - Falls back to PHP 8.2
3. **Runtime Installation** (First deployment only, ~90-120s):
   - Installs PHP and common extensions via apt-get
   - Installs Composer package manager
   - Installs extensions: mysql, pgsql, sqlite3, curl, gd, mbstring, xml, zip, bcmath, intl, redis, opcache
   - Future deployments skip this step (~10-15s updates)
4. **Dependencies**: Runs `composer install --no-dev --optimize-autoloader`
5. **Build**: Framework-specific optimization (cache config, routes, assets)
6. **Start**: Executes appropriate server command (artisan serve, php -S, etc.)

## Framework-Specific Guides

### Laravel Framework

Laravel is a full-stack PHP framework. Flux-Orbit automatically detects and optimizes Laravel applications:

```bash
docker run -d \
  --name laravel-app \
  -e GIT_REPO_URL=https://github.com/your-username/laravel-app \
  -e APP_PORT=8000 \
  -e PHP_VERSION=8.2 \
  -e SECRET_KEY_BASE=your-secret-key \
  -p 8000:8000 \
  runonflux/orbit:latest
```

**What Flux-Orbit Does Automatically:**

1. **Environment Setup**: Copies `.env.example` to `.env` if needed
2. **Application Key**: Runs `php artisan key:generate` if APP_KEY not set
3. **Configuration Caching**: Runs `php artisan config:cache` for performance
4. **Route Caching**: Runs `php artisan route:cache` for faster routing
5. **Frontend Assets**: Builds assets if `package.json` has build script
6. **Server Start**: Uses `php artisan serve --host=0.0.0.0 --port=$APP_PORT`

**Laravel Octane Support:**

If Laravel Octane is installed, Flux-Orbit automatically uses it for high-performance serving:

```bash
# Install Octane in your Laravel project
composer require laravel/octane

# Deploy - Flux-Orbit detects Octane automatically
docker run -d \
  --name laravel-octane \
  -e GIT_REPO_URL=https://github.com/your-username/laravel-app \
  -e APP_PORT=8000 \
  -p 8000:8000 \
  runonflux/orbit:latest
```

**Important Environment Variables:**

```bash
docker run -d \
  --name laravel-api \
  -e GIT_REPO_URL=https://github.com/your-username/laravel-api \
  -e APP_PORT=8000 \
  -e PHP_VERSION=8.2 \
  -e SECRET_KEY_BASE=base64:your-generated-key \
  -e DB_CONNECTION=mysql \
  -e DB_HOST=your-db-host \
  -e DB_DATABASE=your_database \
  -e DB_USERNAME=your_user \
  -e DB_PASSWORD=your_password \
  -p 8000:8000 \
  runonflux/orbit:latest
```

### Lumen Framework

Lumen is Laravel's micro-framework for APIs. Flux-Orbit detects Lumen **before** Laravel (important for correct detection):

```bash
docker run -d \
  --name lumen-api \
  -e GIT_REPO_URL=https://github.com/your-username/lumen-api \
  -e APP_PORT=8000 \
  -p 8000:8000 \
  runonflux/orbit:latest
```

**Example `routes/web.php`:**
```php
<?php

/** @var \Laravel\Lumen\Routing\Router $router */

$router->get('/', function () use ($router) {
    return response()->json([
        'message' => 'Lumen API',
        'version' => $router->app->version()
    ]);
});

$router->get('/health', function () {
    return response()->json(['status' => 'healthy']);
});
```

**Server Used**: PHP built-in server with public directory
- Command: `php -S 0.0.0.0:8000 -t public`

### Symfony Framework

Symfony is a flexible PHP framework for web applications:

```bash
docker run -d \
  --name symfony-app \
  -e GIT_REPO_URL=https://github.com/your-username/symfony-app \
  -e APP_PORT=8000 \
  -p 8000:8000 \
  runonflux/orbit:latest
```

**What Flux-Orbit Does:**

1. **Cache Warmup**: Runs `php bin/console cache:warmup --env=prod`
2. **Asset Building**: Builds Symfony Encore assets if `webpack.config.js` exists
3. **Server Start**: Uses Symfony CLI if installed, otherwise PHP built-in server

### Slim Framework

Slim is a micro-framework for APIs and simple web applications:

```bash
docker run -d \
  --name slim-api \
  -e GIT_REPO_URL=https://github.com/your-username/slim-api \
  -e APP_PORT=8000 \
  -p 8000:8000 \
  runonflux/orbit:latest
```

**Example `public/index.php`:**
```php
<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

$app->get('/', function (Request $request, Response $response) {
    $data = ['message' => 'Slim API', 'version' => '1.0.0'];
    $response->getBody()->write(json_encode($data));
    return $response->withHeader('Content-Type', 'application/json');
});

$app->get('/health', function (Request $request, Response $response) {
    $data = ['status' => 'healthy'];
    $response->getBody()->write(json_encode($data));
    return $response->withHeader('Content-Type', 'application/json');
});

$app->run();
```

**Server Used**: PHP built-in server with auto-detected document root (public/, web/, or root)

### CodeIgniter 4

CodeIgniter is a powerful PHP framework with minimal configuration:

```bash
docker run -d \
  --name codeigniter-app \
  -e GIT_REPO_URL=https://github.com/your-username/codeigniter-app \
  -e APP_PORT=8080 \
  -p 8080:8080 \
  runonflux/orbit:latest
```

**What Flux-Orbit Does:**

1. **Environment Setup**: Copies `env` to `.env` if needed
2. **Permissions**: Sets proper permissions for `writable/` directory
3. **Server Start**: Uses `php spark serve --host=0.0.0.0 --port=$APP_PORT`

### CakePHP

CakePHP is a rapid development framework for PHP:

```bash
docker run -d \
  --name cakephp-app \
  -e GIT_REPO_URL=https://github.com/your-username/cakephp-app \
  -e APP_PORT=8765 \
  -p 8765:8765 \
  runonflux/orbit:latest
```

**What Flux-Orbit Does:**

1. **Cache Clearing**: Runs `php bin/cake cache clear_all`
2. **Permissions**: Sets proper permissions for `tmp/` and `logs/` directories
3. **Server Start**: Uses `php bin/cake server -H 0.0.0.0 -p $APP_PORT`

## Version Management

### Specify PHP Version

**Option 1: Environment Variable**
```bash
docker run -d \
  -e GIT_REPO_URL=https://github.com/your-username/php-app \
  -e APP_PORT=8000 \
  -e PHP_VERSION=8.3 \
  -p 8000:8000 \
  runonflux/orbit:latest
```

**Option 2: composer.json**
```json
{
  "require": {
    "php": "^8.2"
  }
}
```

**Or using platform config:**
```json
{
  "config": {
    "platform": {
      "php": "8.2.0"
    }
  }
}
```

**Supported Versions**: PHP 7.4, 8.0, 8.1, 8.2, 8.3

## Extension Management

### Install Additional Extensions

Flux-Orbit installs common extensions by default. For additional extensions:

```bash
docker run -d \
  -e GIT_REPO_URL=https://github.com/your-username/php-app \
  -e APP_PORT=8000 \
  -e PHP_VERSION=8.2 \
  -e PHP_EXTENSIONS="imagick,memcached,xdebug" \
  -p 8000:8000 \
  runonflux/orbit:latest
```

**Default Extensions Included:**
- cli, common, mysql, pgsql, sqlite3
- curl, gd, mbstring, xml, zip
- bcmath, intl, redis, opcache

**Popular Additional Extensions:**
- `imagick` - ImageMagick for image processing
- `memcached` - Memcached client
- `xdebug` - Debugging and profiling
- `mongodb` - MongoDB driver
- `amqp` - RabbitMQ client
- `soap` - SOAP protocol support
- `ldap` - LDAP support

## Performance Optimization

### PHP Configuration

Flux-Orbit automatically configures PHP for production:

**Memory Limit**: Auto-configured to 75% of container memory
- Minimum: 128MB
- Maximum: 2GB
- Override with custom php.ini if needed

**OPcache Settings** (automatically enabled):
```ini
opcache.enable = 1
opcache.enable_cli = 1
opcache.memory_consumption = 128
opcache.interned_strings_buffer = 8
opcache.max_accelerated_files = 10000
opcache.validate_timestamps = 0
```

### Composer Optimization

Dependencies are installed with production optimizations:
```bash
composer install --no-dev --optimize-autoloader
```

### Dependency Caching

Dependencies are cached based on `composer.lock` hash:
- **First deployment**: Installs all dependencies (~30-60s)
- **Subsequent deployments**: Skips installation if composer.lock unchanged
- Force reinstall: Use `FORCE_INSTALL=true` environment variable

## Environment Variables

### PHP-Specific Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PHP_VERSION` | PHP version to install (7.4-8.3) | Auto-detected from composer.json |
| `PHP_EXTENSIONS` | Additional extensions (comma-separated) | - |

### Common Application Variables

```bash
docker run -d \
  --name php-app \
  -e GIT_REPO_URL=https://github.com/your-username/php-app \
  -e APP_PORT=8000 \
  -e PHP_VERSION=8.2 \
  -e PHP_EXTENSIONS="imagick,memcached" \
  -e DATABASE_URL=mysql://user:pass@db:3306/mydb \
  -e REDIS_URL=redis://redis:6379 \
  -e APP_ENV=production \
  -e APP_DEBUG=false \
  -p 8000:8000 \
  runonflux/orbit:latest
```

## Advanced Scenarios

### Monorepo - Deploy Specific Service

```bash
docker run -d \
  --name php-api-service \
  -e GIT_REPO_URL=https://github.com/your-username/monorepo \
  -e PROJECT_PATH=services/api \
  -e APP_PORT=8000 \
  -p 8000:8000 \
  runonflux/orbit:latest
```

### Private Repository

```bash
docker run -d \
  --name private-php-app \
  -e GIT_REPO_URL=https://github.com/your-username/private-app \
  -e GIT_TOKEN=ghp_your_personal_access_token \
  -e APP_PORT=8000 \
  -p 8000:8000 \
  runonflux/orbit:latest
```

### With Deployment Hooks

Create `pre-deploy.sh` in your repository root:

```bash
#!/bin/bash
# Run database migrations before deployment
echo "Running database migrations..."
php artisan migrate --force
```

Create `post-deploy.sh`:

```bash
#!/bin/bash
# Clear and warm up cache after deployment
echo "Warming up application cache..."
curl -s http://localhost:$APP_PORT/health > /dev/null
```

```bash
docker run -d \
  --name laravel-with-hooks \
  -e GIT_REPO_URL=https://github.com/your-username/laravel-app \
  -e APP_PORT=8000 \
  -p 8000:8000 \
  runonflux/orbit:latest
```

### Large Laravel Application

For large Laravel applications with extensive dependencies:

```bash
# On Flux Cloud, increase container RAM:
RAM: 4096 MB  # or higher

Environment Variables:
  GIT_REPO_URL: https://github.com/your-username/large-laravel-app
  APP_PORT: 8000
  PHP_VERSION: 8.2

# PHP memory is auto-configured to 75% of container (3GB in this case)
```

## CI/CD Integration

### Automatic Deployment with Webhooks

```bash
docker run -d \
  --name laravel-api \
  -e GIT_REPO_URL=https://github.com/your-username/laravel-api \
  -e APP_PORT=8000 \
  -e WEBHOOK_SECRET=my-secret-phrase \
  -p 8000:8000 \
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
  --name laravel-api \
  -e GIT_REPO_URL=https://github.com/your-username/laravel-api \
  -e APP_PORT=8000 \
  -e POLLING_INTERVAL=300 \
  -p 8000:8000 \
  runonflux/orbit:latest
```

## Troubleshooting

### Composer Install Fails

**Problem:** "Your requirements could not be resolved to an installable set of packages"

**Solution:** Check PHP version compatibility in composer.json:

```json
{
  "require": {
    "php": "^8.2",
    "laravel/framework": "^11.0"
  }
}
```

Ensure `PHP_VERSION` env matches requirements.

### Missing PHP Extension

**Problem:** "Class 'Redis' not found" or similar extension errors

**Solution:** Add required extension via `PHP_EXTENSIONS`:

```bash
-e PHP_EXTENSIONS="redis,imagick,memcached"
```

### Laravel Key Not Set

**Problem:** "No application encryption key has been specified"

**Solution:** Either:

1. Let Flux-Orbit generate it automatically (happens on first deploy if APP_KEY not set in .env)
2. Set `SECRET_KEY_BASE` environment variable with pre-generated key

### Application Not Accessible

**Problem:** Can't access the application on configured port

**Solution:** Ensure your application binds to `0.0.0.0` (not `localhost` or `127.0.0.1`):

For custom PHP servers, make sure they listen on all interfaces:
```php
// Good: Accessible from outside container
$server->listen('0.0.0.0', $port);

// Bad: Only accessible from inside container
$server->listen('localhost', $port);
```

Laravel, Lumen, Symfony, and other frameworks handled by Flux-Orbit already bind correctly.

### High Memory Usage

**Problem:** PHP process using too much memory

**Solution:** PHP memory is auto-configured, but you can adjust by increasing container RAM:

```yaml
# On Flux Cloud
RAM: 4096 MB  # PHP will use ~3GB (75%)
```

### Slow Composer Install

**Problem:** `composer install` takes too long

**Solution:**

1. Use dependency caching - don't modify `composer.lock` unless adding/updating packages
2. Remove development dependencies:
   ```json
   {
     "require-dev": {
       "phpunit/phpunit": "^10.0"
     }
   }
   ```
   These are excluded with `--no-dev` flag (automatic in production)

## Performance Tips

1. **Use Dependency Caching**: Don't modify `composer.lock` unless necessary - saves 30-60s per deployment
2. **Enable OPcache**: Automatically enabled for 2-3x performance boost
3. **Laravel Optimization**: Use `php artisan config:cache` and `route:cache` (done automatically)
4. **Laravel Octane**: For high-performance Laravel apps, add `laravel/octane` to composer.json
5. **Production Environment**: Set `APP_ENV=production` and `APP_DEBUG=false`
6. **Health Checks**: Implement `/health` endpoint for faster deployment verification
7. **First Deployment**: Takes 90-120s (PHP installation), subsequent deploys are 10-15s

## Deployment Timeline

**First Deployment** (~90-120 seconds):
1. Git clone: 5-10s
2. PHP installation: 60-90s (one-time, persists in container)
3. Composer install: 15-30s
4. Framework build: 5-10s
5. Application start: 2-5s

**Subsequent Deployments** (~10-15 seconds):
1. Git pull: 2-3s
2. PHP check: &lt;1s (already installed)
3. Composer install: &lt;1s (cached if composer.lock unchanged)
4. Framework build: 3-5s
5. Application restart: 2-3s

## Example Repository Structure

```
my-laravel-app/
├── composer.json          # Dependencies and PHP version
├── composer.lock          # Locked dependency versions
├── .env.example          # Environment template
├── artisan               # Laravel CLI
├── pre-deploy.sh         # Optional: Pre-deployment hook
├── post-deploy.sh        # Optional: Post-deployment hook
├── app/
│   ├── Http/
│   │   └── Controllers/
│   └── Models/
├── config/               # Laravel configuration
├── database/
│   └── migrations/
├── public/               # Document root
│   └── index.php
├── resources/
│   └── views/
└── routes/
    ├── web.php
    └── api.php
```

## Next Steps

- [Environment Variables Reference](../configuration/environment-reference)
- [Deployment Hooks Guide](../hooks/deployment-hooks)
- [CI/CD Setup](../ci-cd/github-webhooks)
- [Troubleshooting](../troubleshooting/common-issues)
