---
sidebar_position: 3
title: Deploying Ruby Applications
description: Complete guide for deploying Ruby applications via Deploy with Git
---

# Deploying Ruby Applications

This comprehensive guide covers everything you need to know about deploying Ruby applications via Deploy with Git, from simple Sinatra apps to full Rails applications.

## Overview

Deploy with Git automatically detects Ruby applications by looking for:
- `Gemfile` (primary indicator)
- `Gemfile.lock` for dependency resolution
- `.ruby-version` for version specification (optional)
- `config.ru` for Rack applications

## Basic Ruby Deployment

### Simple Sinatra API

```bash
docker run -d \
  --name sinatra-api \
  -e GIT_REPO_URL=https://github.com/your-username/sinatra-api \
  -e APP_PORT=4567 \
  -p 4567:4567 \
  runonflux/orbit:latest
```

### What Happens Automatically

1. **Detection**: Finds `Gemfile` and identifies as Ruby project
2. **Version Selection**:
   - Checks `RUBY_VERSION` environment variable
   - Checks `.ruby-version` file
   - Checks `ruby` directive in Gemfile (e.g., `ruby '3.2.0'`)
   - Falls back to Ruby 3.0.0
3. **Runtime Installation**:
   - Downloads and installs Ruby via rbenv
   - Installs to `/opt/flux-tools/rbenv`
   - Configures PATH and gem environment
4. **Dependencies**: Runs `bundle install --deployment --without development test`
5. **Build**: Precompiles assets if Rails app detected
6. **Start**: Executes appropriate server command (rails, rackup, ruby, etc.)

## Framework-Specific Guides

### Ruby on Rails

Rails is a full-stack web framework for Ruby. Deploy with Git automatically detects and optimizes Rails applications:

```bash
docker run -d \
  --name rails-app \
  -e GIT_REPO_URL=https://github.com/your-username/rails-app \
  -e APP_PORT=3000 \
  -e RUBY_VERSION=3.2.0 \
  -e RAILS_ENV=production \
  -p 3000:3000 \
  runonflux/orbit:latest
```

**Example `config/puma.rb` (recommended):**
```ruby
# Puma configuration for production
workers ENV.fetch("WEB_CONCURRENCY") { 2 }
threads_count = ENV.fetch("RAILS_MAX_THREADS") { 5 }
threads threads_count, threads_count

preload_app!

port ENV.fetch("PORT") { 3000 }
environment ENV.fetch("RAILS_ENV") { "production" }

on_worker_boot do
  ActiveRecord::Base.establish_connection if defined?(ActiveRecord)
end

# Bind to 0.0.0.0 for container networking
bind "tcp://0.0.0.0:#{ENV.fetch('PORT') { 3000 }}"
```

**Important Rails Configuration:**

1. **Asset Precompilation**: Automatically runs `rails assets:precompile`
2. **Database Migrations**: Use deployment hooks (see below)
3. **Secret Key**: Set `SECRET_KEY_BASE` environment variable

### Sinatra Framework

Sinatra is a lightweight DSL for creating web applications:

```bash
docker run -d \
  --name sinatra-api \
  -e GIT_REPO_URL=https://github.com/your-username/sinatra-api \
  -e APP_PORT=4567 \
  -p 4567:4567 \
  runonflux/orbit:latest
```

**Example `app.rb`:**
```ruby
require 'sinatra'
require 'json'

set :bind, '0.0.0.0'
set :port, ENV['APP_PORT'] || 4567

get '/health' do
  content_type :json
  { status: 'healthy' }.to_json
end

get '/' do
  'Hello from Sinatra on Flux!'
end
```

**Example `config.ru`:**
```ruby
require './app'
run Sinatra::Application
```

### Hanami Framework

Hanami is a modern web framework for Ruby:

```bash
docker run -d \
  --name hanami-app \
  -e GIT_REPO_URL=https://github.com/your-username/hanami-app \
  -e APP_PORT=2300 \
  -p 2300:2300 \
  runonflux/orbit:latest
```

### Rack Applications

For custom Rack applications with `config.ru`:

```bash
docker run -d \
  --name rack-app \
  -e GIT_REPO_URL=https://github.com/your-username/rack-app \
  -e APP_PORT=9292 \
  -p 9292:9292 \
  runonflux/orbit:latest
```

## Version Management

### Specify Ruby Version

**Option 1: Environment Variable**
```bash
docker run -d \
  -e GIT_REPO_URL=https://github.com/your-username/ruby-app \
  -e APP_PORT=3000 \
  -e RUBY_VERSION=3.2.0 \
  -p 3000:3000 \
  runonflux/orbit:latest
```

**Option 2: .ruby-version File**
```
3.2.0
```

**Option 3: Gemfile**
```ruby
source 'https://rubygems.org'

ruby '3.2.0'

gem 'rails', '~> 7.0'
gem 'puma', '~> 6.0'
```

## Build Configuration

### Asset Precompilation (Rails)

Rails assets are automatically precompiled in production mode:

```bash
docker run -d \
  -e GIT_REPO_URL=https://github.com/your-username/rails-app \
  -e APP_PORT=3000 \
  -e RAILS_ENV=production \
  -e SECRET_KEY_BASE=your-secret-key \
  -p 3000:3000 \
  runonflux/orbit:latest
```

### Custom Build Command

Override the default build command if needed:

```bash
docker run -d \
  -e GIT_REPO_URL=https://github.com/your-username/ruby-app \
  -e APP_PORT=3000 \
  -e BUILD_COMMAND="bundle exec rake custom:build" \
  -p 3000:3000 \
  runonflux/orbit:latest
```

### Custom Run Command

Override the default run command:

```bash
docker run -d \
  -e GIT_REPO_URL=https://github.com/your-username/rails-app \
  -e APP_PORT=3000 \
  -e RUN_COMMAND="bundle exec puma -C config/puma.rb" \
  -p 3000:3000 \
  runonflux/orbit:latest
```

## Environment Variables

### Ruby-Specific Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `RUBY_VERSION` | Ruby version to install | Auto-detected from Gemfile |
| `RAILS_ENV` | Rails environment | `production` |
| `RACK_ENV` | Rack environment | `production` |
| `BUNDLE_WITHOUT` | Bundle groups to exclude | `development test` |

### Rails Application Variables

```bash
docker run -d \
  --name rails-app \
  -e GIT_REPO_URL=https://github.com/your-username/rails-app \
  -e APP_PORT=3000 \
  -e RUBY_VERSION=3.2.0 \
  -e RAILS_ENV=production \
  -e SECRET_KEY_BASE=your-very-long-secret-key \
  -e DATABASE_URL=postgresql://user:pass@db:5432/mydb \
  -e REDIS_URL=redis://redis:6379/0 \
  -e RAILS_LOG_TO_STDOUT=true \
  -e RAILS_SERVE_STATIC_FILES=true \
  -p 3000:3000 \
  runonflux/orbit:latest
```

## Advanced Scenarios

### Monorepo - Deploy Specific Service

```bash
docker run -d \
  --name rails-admin \
  -e GIT_REPO_URL=https://github.com/your-username/monorepo \
  -e PROJECT_PATH=apps/admin \
  -e APP_PORT=3000 \
  -p 3000:3000 \
  runonflux/orbit:latest
```

### Private Repository

```bash
docker run -d \
  --name private-rails-app \
  -e GIT_REPO_URL=https://github.com/your-username/private-app \
  -e GIT_TOKEN=ghp_your_personal_access_token \
  -e APP_PORT=3000 \
  -p 3000:3000 \
  runonflux/orbit:latest
```

### With Database Migrations

Create `pre-deploy.sh` in your repository root:

```bash
#!/bin/bash
# Run database migrations before deployment
echo "Running database migrations..."
bundle exec rails db:migrate RAILS_ENV=production
```

Create `post-deploy.sh`:

```bash
#!/bin/bash
# Clear cache after deployment
echo "Clearing Rails cache..."
bundle exec rails cache:clear RAILS_ENV=production
```

```bash
docker run -d \
  --name rails-app-with-migrations \
  -e GIT_REPO_URL=https://github.com/your-username/rails-app \
  -e APP_PORT=3000 \
  -e DATABASE_URL=postgresql://user:pass@db:5432/mydb \
  -p 3000:3000 \
  runonflux/orbit:latest
```

Learn more: [Deployment Hooks Guide](../hooks/deployment-hooks)

## CI/CD Integration

### Automatic Deployment with Webhooks

```bash
docker run -d \
  --name rails-app \
  -e GIT_REPO_URL=https://github.com/your-username/rails-app \
  -e APP_PORT=3000 \
  -e API_KEY=your-secret-api-key \
  -p 3000:3000 \
  -p 9001:9001 \
  runonflux/orbit:latest
```

**Configure GitHub Webhook:**
- Payload URL: `https://your-app-9001.app.runonflux.io/webhook`
- Content type: `application/json`
- Secret: Not needed (use X-API-Key header instead)
- Events: Just the `push` event

**Add API Key Header:**
Use `X-API-Key: your-secret-api-key` in your webhook configuration.

### Polling for Updates

```bash
docker run -d \
  --name rails-app \
  -e GIT_REPO_URL=https://github.com/your-username/rails-app \
  -e APP_PORT=3000 \
  -e POLLING_INTERVAL=300 \
  -p 3000:3000 \
  runonflux/orbit:latest
```

## Troubleshooting

### Asset Compilation Fails

**Problem:** "Asset precompilation failed"

**Solution:** Ensure Node.js is available for JavaScript runtime (automatically installed if detected):

```bash
# Gemfile
gem 'mini_racer'  # Or 'therubyracer'
```

Or explicitly set Node.js version:

```bash
-e NODE_VERSION=20
```

### Bundle Install Fails

**Problem:** Native extension build errors

**Solution:** Deploy with Git includes build-essential and common libraries. For additional dependencies, use deployment hooks:

```bash
#!/bin/bash
# pre-deploy.sh
apt-get update && apt-get install -y libspecial-dev
```

### Server Not Binding to Port

**Problem:** Application not accessible

**Solution:** Ensure your server binds to `0.0.0.0` (not `localhost`):

```ruby
# Puma config
bind "tcp://0.0.0.0:#{ENV.fetch('PORT') { 3000 }}"

# Sinatra
set :bind, '0.0.0.0'

# Rackup
# Use 'rackup -o 0.0.0.0 -p $PORT'
```

### Database Connection Issues

**Problem:** Can't connect to database

**Solution:** Use DATABASE_URL environment variable:

```bash
-e DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

And in `config/database.yml`:

```yaml
production:
  url: <%= ENV['DATABASE_URL'] %>
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
```

### Secret Key Base Missing

**Problem:** Rails requires SECRET_KEY_BASE in production

**Solution:** Generate and set secret key:

```bash
# Generate a secret key locally
rails secret

# Use it in deployment
-e SECRET_KEY_BASE=the-generated-secret-key
```

### Memory Issues During Asset Compilation

**Problem:** Out of memory during `rails assets:precompile`

**Solution:** Increase Node.js heap size:

```bash
-e NODE_OPTIONS="--max-old-space-size=2048"
```

## Performance Tips

1. **Use Puma**: Configure workers and threads appropriately
   ```ruby
   workers ENV.fetch("WEB_CONCURRENCY") { 2 }
   threads_count = ENV.fetch("RAILS_MAX_THREADS") { 5 }
   threads threads_count, threads_count
   ```

2. **Preload App**: Enable `preload_app!` in Puma config for faster worker spawning

3. **Database Connection Pooling**: Match pool size to thread count
   ```yaml
   pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
   ```

4. **Dependency Caching**: Dependencies are cached based on Gemfile.lock hash - no reinstall if unchanged

5. **Asset Pipeline**: Use Sprockets or Webpacker efficiently, enable CDN for assets in production

6. **Health Checks**: Implement `/health` endpoint for faster deployment verification
   ```ruby
   # config/routes.rb
   get '/health', to: proc { [200, {}, ['OK']] }
   ```

## Example Repository Structure

```
my-rails-app/
├── Gemfile                # Ruby dependencies
├── Gemfile.lock           # Locked dependency versions
├── .ruby-version          # Optional: Pin Ruby version
├── config.ru              # Rack configuration
├── pre-deploy.sh          # Optional: Run migrations
├── post-deploy.sh         # Optional: Cache warming
├── app/
│   ├── controllers/
│   ├── models/
│   └── views/
├── config/
│   ├── database.yml
│   ├── routes.rb
│   └── puma.rb
├── db/
│   └── migrate/
└── public/
    └── assets/            # Compiled assets
```

## Common Rails Gems for Production

```ruby
# Gemfile
source 'https://rubygems.org'

ruby '3.2.0'

# Core
gem 'rails', '~> 7.0'
gem 'puma', '~> 6.0'          # Application server
gem 'bootsnap', require: false # Faster boot times

# Database
gem 'pg', '~> 1.5'            # PostgreSQL
# gem 'mysql2', '~> 0.5'      # MySQL alternative

# Performance
gem 'redis', '~> 5.0'         # Caching/sessions
gem 'rack-timeout'            # Request timeouts

# Assets
gem 'sprockets-rails'         # Asset pipeline
# gem 'webpacker', '~> 5.0'   # Alternative: Webpack

# Production
gem 'rack-attack'             # Rate limiting
gem 'rack-cors'               # CORS for APIs

group :development, :test do
  gem 'rspec-rails'
  gem 'factory_bot_rails'
end
```

## Next Steps

- [Environment Variables Reference](../configuration/environment-reference)
- [Deployment Hooks Guide](../hooks/deployment-hooks)
- [CI/CD Setup](../ci-cd/github-webhooks)
- [Troubleshooting](../troubleshooting/common-issues)
