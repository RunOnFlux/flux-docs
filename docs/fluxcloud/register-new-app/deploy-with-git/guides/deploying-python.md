---
sidebar_position: 2
title: Deploying Python Applications
description: Complete guide for deploying Python applications with Flux-Orbit
---

# Deploying Python Applications

This guide covers everything you need to know about deploying Python applications with Flux-Orbit, from simple Flask apps to complex Django projects.

## Overview

Flux-Orbit automatically detects Python applications by looking for:
- `requirements.txt` file
- `pyproject.toml` file
- `Pipfile` for Pipenv projects
- `setup.py` for packages

## Basic Python Deployment

### Simple Flask Application

```bash
docker run -d \
  --name flask-app \
  -e GIT_REPO_URL=https://github.com/pallets/flask \
  -e APP_PORT=5000 \
  -p 5000:5000 \
  runonflux/orbit:latest
```

### What Happens Automatically

1. **Detection**: Finds `requirements.txt` and identifies as Python project
2. **Version Selection**:
   - Checks `PYTHON_VERSION` environment variable
   - Checks `.python-version` file
   - Checks `pyproject.toml` for version
   - Falls back to Python 3.11
3. **Installation**: Runs `pip install -r requirements.txt`
4. **Start**: Uses command from `Procfile` or guesses based on framework

## Framework-Specific Guides

### Django Applications

Django requires specific configuration for production:

```bash
docker run -d \
  --name django-app \
  -e GIT_REPO_URL=https://github.com/your-username/django-app \
  -e APP_PORT=8000 \
  -e PYTHON_VERSION=3.11 \
  -e DATABASE_URL=postgresql://user:pass@host/dbname \
  -e SECRET_KEY=your-secret-key-here \
  -e DJANGO_SETTINGS_MODULE=myapp.settings.production \
  -e PRE_BUILD_COMMAND="python manage.py migrate" \
  -e RUN_COMMAND="gunicorn myapp.wsgi:application --bind 0.0.0.0:8000" \
  -p 8000:8000 \
  runonflux/orbit:latest
```

**Django Static Files:**
```bash
# Collect static files during build
-e BUILD_COMMAND="python manage.py collectstatic --noinput"
```

### FastAPI Applications

```bash
docker run -d \
  --name fastapi-app \
  -e GIT_REPO_URL=https://github.com/your-username/fastapi-app \
  -e APP_PORT=8000 \
  -e RUN_COMMAND="uvicorn main:app --host 0.0.0.0 --port 8000" \
  -p 8000:8000 \
  runonflux/orbit:latest
```

**With Auto-reload (Development):**
```bash
-e RUN_COMMAND="uvicorn main:app --host 0.0.0.0 --port 8000 --reload"
```

### Flask Applications

```bash
docker run -d \
  --name flask-app \
  -e GIT_REPO_URL=https://github.com/your-username/flask-app \
  -e APP_PORT=5000 \
  -e FLASK_APP=app.py \
  -e FLASK_ENV=production \
  -e RUN_COMMAND="gunicorn app:app --bind 0.0.0.0:5000" \
  -p 5000:5000 \
  runonflux/orbit:latest
```

### Streamlit Applications

```bash
docker run -d \
  --name streamlit-app \
  -e GIT_REPO_URL=https://github.com/your-username/streamlit-app \
  -e APP_PORT=8501 \
  -e RUN_COMMAND="streamlit run app.py --server.port 8501 --server.address 0.0.0.0" \
  -p 8501:8501 \
  runonflux/orbit:latest
```

## Python Version Management

### Specify Python Version

```bash
# Using specific version
-e PYTHON_VERSION=3.11

# Using major.minor version
-e PYTHON_VERSION=3.10

# Using major version (gets latest minor)
-e PYTHON_VERSION=3
```

### Version Detection Priority

1. `PYTHON_VERSION` environment variable
2. `.python-version` file in repository
3. `python` field in `pyproject.toml`
4. Default to Python 3.11

### Example .python-version

```
3.11.6
```

### Example pyproject.toml

```toml
[tool.poetry]
name = "my-app"
version = "0.1.0"
description = ""
authors = ["Your Name <you@example.com>"]
python = "^3.11"
```

## Dependency Management

### Using requirements.txt

Standard pip requirements:
```bash
# requirements.txt is detected automatically
-e INSTALL_COMMAND="pip install -r requirements.txt"
```

### Using Pipenv

```bash
# If Pipfile exists
-e INSTALL_COMMAND="pipenv install --deploy --system"
```

### Using Poetry

```bash
# If pyproject.toml exists
-e INSTALL_COMMAND="poetry install --no-dev"
```

### Using Conda

```bash
# If environment.yml exists
-e INSTALL_COMMAND="conda env create -f environment.yml"
-e RUN_COMMAND="conda activate myenv && python app.py"
```

## Environment Variables

### Common Python Variables

```bash
docker run -d \
  -e GIT_REPO_URL=https://github.com/your-username/python-app \
  -e APP_PORT=8000 \
  -e PYTHON_VERSION=3.11 \
  -e PYTHONPATH=/app/src \
  -e PYTHONUNBUFFERED=1 \
  -e DATABASE_URL=postgresql://localhost/mydb \
  -e REDIS_URL=redis://localhost:6379 \
  -e SECRET_KEY=your-secret-key \
  -p 8000:8000 \
  runonflux/orbit:latest
```

### Using .env Files

Create a `.env` file in your repository:
```env
DEBUG=False
DATABASE_URL=postgresql://localhost/mydb
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
```

Load with python-dotenv:
```python
from dotenv import load_dotenv
load_dotenv()
```

## Database Migrations

### Django Migrations

```bash
# Run migrations before starting
-e PRE_BUILD_COMMAND="python manage.py migrate"

# Create superuser (interactive not supported, use fixtures)
-e POST_BUILD_COMMAND="python manage.py loaddata initial_data.json"
```

### Alembic Migrations (SQLAlchemy)

```bash
-e PRE_BUILD_COMMAND="alembic upgrade head"
```

### Database Initialization

```bash
# Initialize database on first run
-e PRE_BUILD_COMMAND="python init_db.py"
```

## Web Servers

### Gunicorn (Recommended for Production)

```bash
# Basic Gunicorn
-e RUN_COMMAND="gunicorn app:app --bind 0.0.0.0:8000"

# With workers
-e RUN_COMMAND="gunicorn app:app --bind 0.0.0.0:8000 --workers 4"

# With specific worker class
-e RUN_COMMAND="gunicorn app:app --bind 0.0.0.0:8000 --worker-class gevent"
```

### Uvicorn (For ASGI apps)

```bash
# FastAPI, Starlette
-e RUN_COMMAND="uvicorn app:app --host 0.0.0.0 --port 8000"

# With workers
-e RUN_COMMAND="uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4"
```

### Waitress (Pure Python)

```bash
-e RUN_COMMAND="waitress-serve --port=8000 app:application"
```

## Debugging Deployments

### Enable Debug Logging

```bash
docker run -d \
  --name debug-python-app \
  -e GIT_REPO_URL=https://github.com/your-username/app \
  -e APP_PORT=8000 \
  -e LOG_LEVEL=debug \
  -e PYTHONUNBUFFERED=1 \
  -e DEBUG=True \
  -p 8000:8000 \
  runonflux/orbit:latest
```

### Access Container for Debugging

```bash
# Execute commands in running container
docker exec -it debug-python-app /bin/bash

# Check Python version
docker exec debug-python-app python --version

# List installed packages
docker exec debug-python-app pip list

# Run Python shell
docker exec debug-python-app python
```

### Common Issues and Solutions

#### 1. Module Not Found

**Problem**: `ModuleNotFoundError: No module named 'xxx'`

**Solution**:
```bash
# Ensure all dependencies are in requirements.txt
# Or use explicit install command
-e INSTALL_COMMAND="pip install -r requirements.txt && pip install additional-package"
```

#### 2. Port Binding Error

**Problem**: `OSError: [Errno 98] Address already in use`

**Solution**:
```bash
# Ensure APP_PORT matches your application's actual port
-e APP_PORT=8000
-e RUN_COMMAND="python app.py --port 8000"
```

#### 3. Database Connection Failed

**Problem**: `OperationalError: could not connect to database`

**Solution**:
```bash
# Use host.docker.internal for local databases
-e DATABASE_URL=postgresql://user:pass@host.docker.internal:5432/db
```

## Performance Optimization

### Production Best Practices

```bash
docker run -d \
  --name production-python-app \
  -e GIT_REPO_URL=https://github.com/your-username/app \
  -e APP_PORT=8000 \
  -e PYTHON_VERSION=3.11 \
  -e PYTHONUNBUFFERED=1 \
  -e INSTALL_COMMAND="pip install --no-cache-dir -r requirements.txt" \
  -e RUN_COMMAND="gunicorn app:app --bind 0.0.0.0:8000 --workers 4 --worker-class gevent" \
  --memory="2g" \
  --cpus="1" \
  -p 8000:8000 \
  runonflux/orbit:latest
```

### Caching Strategies

1. **Dependency Caching**: pip cache is preserved between builds
2. **Precompiled Wheels**: Use binary wheels when available
3. **Multi-stage Builds**: Separate build and runtime dependencies

## Monitoring

### Health Checks

```bash
# Configure health endpoint
-e HEALTH_CHECK_PATH=/health
-e HEALTH_CHECK_INTERVAL=30
```

Implement in your app:
```python
@app.route('/health')
def health():
    return {'status': 'healthy'}, 200
```

### Logs

```bash
# View application logs
docker logs -f container-name

# View specific log file
docker exec container-name tail -f /app/logs/app.log
```

## Example Deployments

### Complete Django E-commerce

```bash
docker run -d \
  --name django-shop \
  -e GIT_REPO_URL=https://github.com/django-oscar/django-oscar \
  -e APP_PORT=8000 \
  -e PYTHON_VERSION=3.11 \
  -e DATABASE_URL=postgresql://user:pass@db:5432/shop \
  -e REDIS_URL=redis://redis:6379 \
  -e SECRET_KEY=your-secret-key \
  -e PRE_BUILD_COMMAND="python manage.py migrate" \
  -e BUILD_COMMAND="python manage.py collectstatic --noinput" \
  -e RUN_COMMAND="gunicorn oscar.wsgi:application --bind 0.0.0.0:8000" \
  -p 8000:8000 \
  runonflux/orbit:latest
```

### FastAPI Microservice

```bash
docker run -d \
  --name fastapi-service \
  -e GIT_REPO_URL=https://github.com/tiangolo/fastapi \
  -e APP_PORT=8000 \
  -e PYTHON_VERSION=3.11 \
  -e RUN_COMMAND="uvicorn main:app --host 0.0.0.0 --port 8000 --workers 2" \
  -p 8000:8000 \
  runonflux/orbit:latest
```

## Next Steps

- Learn about [Ruby Deployment](./deploying-ruby)
- Configure [CI/CD with GitHub](../ci-cd/github-webhooks)
- Explore [Troubleshooting Guide](../troubleshooting/common-issues)
- Read [API Reference](../api/webhook-api)