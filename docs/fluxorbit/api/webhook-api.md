---
sidebar_position: 1
title: Webhook API
description: API reference for Flux-Orbit webhook endpoints
---

# Webhook API

Complete API reference for Flux-Orbit's webhook endpoints and deployment triggers.

## Base URL

```
http://YOUR_SERVER:9001
```

Default port is 9001, configurable via `WEBHOOK_PORT` environment variable.

## Available Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/webhook` | Trigger a deployment | Webhook signature (optional) |
| GET | `/status` | Get current deployment status and progress | API key (if configured) |
| GET | `/health` | Check application and deployment health | Public |
| GET | `/logs/:id` | Get build logs for specific release | API key (if configured) |

## Authentication

### API Key Authentication

The `/status` and `/logs/:id` endpoints support optional API key authentication via the `API_KEY` environment variable. The `/health` endpoint is always public (no authentication required).

**When API_KEY is set:**
```bash
# Protect API endpoints
docker run -d -e API_KEY=your_secret_key_here ...

# Access with authentication
curl -H "Authorization: Bearer your_secret_key_here" http://localhost:9001/status
curl -H "Authorization: Bearer your_secret_key_here" http://localhost:9001/logs/1
```

**When API_KEY is NOT set:**
```bash
# Endpoints are publicly accessible (default)
curl http://localhost:9001/status  # No authentication required
curl http://localhost:9001/logs/1  # No authentication required
```

**Authentication Methods:**

The API accepts the key in the `Authorization` header using either format:
- `Authorization: Bearer <api_key>`
- `Authorization: Token <api_key>`

**Example Responses:**

**Unauthorized (401):**
```json
{
  "error": "Unauthorized",
  "message": "Valid API key required"
}
```

:::info Security Note
The `API_KEY` is independent from `WEBHOOK_SECRET`:
- `WEBHOOK_SECRET` - Used for webhook signature verification (POST /webhook)
- `API_KEY` - Used for API endpoint authentication (GET /status, GET /logs/:id)

This separation allows you to share webhook secrets with GitHub/GitLab without exposing API access. The GET /health endpoint is always public for monitoring purposes.
:::

## Endpoints

### POST /webhook

Trigger a deployment via webhook.

#### Request

**Headers:**
```http
Content-Type: application/json
X-GitHub-Event: push (optional)
X-Hub-Signature-256: sha256=... (optional, for verification)
```

**Body:**
```json
{
  "ref": "refs/heads/main",
  "repository": {
    "clone_url": "https://github.com/user/repo.git"
  },
  "after": "commit_sha_here",
  "pusher": {
    "name": "username"
  }
}
```

#### Response

**Success (200 OK):**
```json
{
  "status": "success",
  "message": "Deployment queued",
  "delivery_id": "unique-id-here"
}
```

**Error (400 Bad Request):**
```json
{
  "status": "error",
  "message": "Invalid payload"
}
```

**Signature Verification Failed (401 Unauthorized):**
```json
{
  "status": "error",
  "message": "Webhook signature verification failed"
}
```

### GET /status

Get current deployment status.

#### Response

**Idle State (No Deployment Running):**
```json
{
  "status": "idle",
  "current_release": "001-abc123def456789",
  "last_deployment": {
    "commit": "abc123d",
    "commit_full": "abc123def456789",
    "updated_at": "2024-01-01T12:00:00+00:00",
    "build_duration_seconds": 45,
    "build_status": "success"
  },
  "releases": [
    {
      "id": "001-abc123def456789",
      "commit": "abc123def456789",
      "commit_message": "Fix login bug",
      "build_duration_seconds": 45,
      "deployed_at": "2024-01-01T12:00:00+00:00"
    }
  ]
}
```

**Idle State (With Failed Deployment):**
```json
{
  "status": "idle",
  "current_release": "001-abc123def456789",
  "last_deployment": {
    "commit": "abc123d",
    "commit_full": "abc123def456789",
    "updated_at": "2024-01-01T12:00:00+00:00",
    "build_duration_seconds": 45,
    "build_status": "success"
  },
  "last_failed_deployment": {
    "commit": "def456a",
    "commit_full": "def456abc789012",
    "failed_at": "2024-01-01T13:00:00.000Z",
    "reason": "build_failed"
  },
  "failed_commits_count": 1
}
```

**Deployment In Progress:**
```json
{
  "status": "deploying",
  "stage": "building",
  "commit": "def456a",
  "commit_full": "def456abc789012",
  "rollback_commit": "abc123d",
  "started_at": 1704110400,
  "duration_seconds": 120,
  "timeout_seconds": 1800,
  "progress_percent": 6
}
```

#### Deployment Stages

The `stage` field can have these values during deployment:

- `starting` - Deployment initiated
- `git_pull` - Pulling latest code from repository
- `installing_dependencies` - Installing npm/pip/bundle packages
- `stopping_app` - Stopping current application
- `building` - Running build commands
- `starting_app` - Starting new application version
- `health_check` - Verifying application health
- `completed` - Deployment successful

### GET /health

Check application and deployment health.

:::info Public Endpoint
This endpoint is always publicly accessible (no API key required) to support external monitoring and health check services.
:::

#### Response

**Application Healthy:**
```json
{
  "healthy": true,
  "app_status": "running",
  "app_port": 3000,
  "supervisor_status": "RUNNING",
  "deployment_in_progress": false,
  "deployment_stage": "none"
}
```

**Application Not Responding:**
```json
{
  "healthy": false,
  "app_status": "not_responding",
  "app_port": 3000,
  "supervisor_status": "STOPPED",
  "deployment_in_progress": false,
  "deployment_stage": "none"
}
```

**During Deployment:**
```json
{
  "healthy": true,
  "app_status": "running",
  "app_port": 3000,
  "supervisor_status": "RUNNING",
  "deployment_in_progress": true,
  "deployment_stage": "building"
}
```

### GET /logs/:identifier

Get build logs for a specific release. Supports flexible identifier matching.

#### URL Parameters

| Parameter | Description | Examples |
|-----------|-------------|----------|
| `identifier` | Release identifier (multiple formats supported) | `1`, `001`, `001-abc123...`, `abc1234` |

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `tail` | integer | Return only the last N lines (optional) |
| `format` | string | Response format: `text` (default) or `json` |

#### Supported Identifier Formats

- **Full release ID**: `001-40c4e6f944123aa03dcfd1ef604e0143d97187dc`
- **Short release ID**: `001` (just the sequence number with leading zeros)
- **Release number**: `1` (sequence number without leading zeros)
- **Full commit hash**: `40c4e6f944123aa03dcfd1ef604e0143d97187dc`
- **Short commit hash**: `40c4e6f` (first 7 characters)
- **Failed build**: `40c4e6f-FAILED` or just `40c4e6f` (will match either successful or failed build)

:::tip Failed Build Logs
When a build fails, the log is saved as `{commit}-FAILED.log`. You can access it using the commit hash as the identifier. For example, if commit `abc1234` failed to build, use `/logs/abc1234` to view the failure log.
:::

#### Response

**Success (200 OK) - Text Format (default):**
```
=== Build Metadata ===
{
  "commit": "40c4e6f944123aa03dcfd1ef604e0143d97187dc",
  "project_type": "node",
  "serve_type": "static",
  "build_duration": 45,
  "build_timestamp": "2025-12-04T10:30:00+00:00",
  "build_log_file": "/tmp/build_40c4e6f.log"
}

=== Build Log ===
=== Installing Dependencies ===
npm install --production
added 120 packages in 12s

=== Building Application ===
npm run build
> build
> vite build

vite v5.0.0 building for production...
✓ 45 modules transformed.
dist/index.html                  0.45 kB
dist/assets/index-abc123.js     45.67 kB
✓ built in 5.23s
```

**Success (200 OK) - JSON Format:**
```json
{
  "identifier": "1",
  "log_file": "001-40c4e6f944123aa03dcfd1ef604e0143d97187dc.log",
  "line_count": 156,
  "content": "=== Build Metadata ===\n{...}\n\n=== Build Log ===\n...",
  "lines": [
    "=== Build Metadata ===",
    "{",
    "  \"commit\": \"40c4e6f944123aa03dcfd1ef604e0143d97187dc\",",
    "...",
  ]
}
```

**Not Found (404):**
```json
{
  "error": "Not Found",
  "message": "No build log found for identifier: 999",
  "hint": "Use GET /status to see available releases"
}
```

**Unauthorized (401):**
```json
{
  "error": "Unauthorized",
  "message": "Valid API key required"
}
```

#### Examples

```bash
# Get logs for latest release (text format)
curl http://localhost:9001/logs/1

# Get logs by release ID
curl http://localhost:9001/logs/001

# Get logs by commit hash (short)
curl http://localhost:9001/logs/40c4e6f

# Get last 50 lines
curl "http://localhost:9001/logs/1?tail=50"

# Get logs as JSON with metadata
curl "http://localhost:9001/logs/1?format=json"

# With authentication
curl -H "Authorization: Bearer your_api_key" http://localhost:9001/logs/1
```

## Webhook Payloads by Provider

### GitHub

#### Push Event

```json
{
  "ref": "refs/heads/main",
  "before": "9049f128...",
  "after": "0d1a26e6...",
  "repository": {
    "id": 186853002,
    "name": "my-app",
    "full_name": "user/my-app",
    "private": false,
    "owner": {
      "name": "user",
      "email": "user@example.com"
    },
    "clone_url": "https://github.com/user/my-app.git",
    "default_branch": "main"
  },
  "pusher": {
    "name": "user",
    "email": "user@example.com"
  },
  "sender": {
    "login": "user",
    "id": 1234567
  },
  "commits": [
    {
      "id": "0d1a26e6...",
      "message": "Update app.js",
      "timestamp": "2024-01-01T00:00:00Z",
      "author": {
        "name": "User Name",
        "email": "user@example.com"
      }
    }
  ]
}
```

#### Release Event

```json
{
  "action": "published",
  "release": {
    "id": 1234567,
    "tag_name": "v1.0.0",
    "target_commitish": "main",
    "name": "Version 1.0.0",
    "draft": false,
    "prerelease": false,
    "created_at": "2024-01-01T00:00:00Z",
    "published_at": "2024-01-01T00:00:00Z"
  },
  "repository": {
    "clone_url": "https://github.com/user/repo.git"
  }
}
```

### GitLab

#### Push Event

```json
{
  "object_kind": "push",
  "ref": "refs/heads/main",
  "checkout_sha": "da1560886...",
  "before": "95790bf891...",
  "after": "da1560886...",
  "project": {
    "id": 15,
    "name": "my-app",
    "web_url": "https://gitlab.com/user/my-app",
    "git_http_url": "https://gitlab.com/user/my-app.git",
    "git_ssh_url": "git@gitlab.com:user/my-app.git",
    "default_branch": "main"
  },
  "commits": [
    {
      "id": "da1560886...",
      "message": "Update app.js",
      "timestamp": "2024-01-01T00:00:00+00:00",
      "author": {
        "name": "User Name",
        "email": "user@example.com"
      }
    }
  ]
}
```

### Bitbucket

#### Push Event

```json
{
  "push": {
    "changes": [
      {
        "new": {
          "type": "branch",
          "name": "main",
          "target": {
            "hash": "abc123def456"
          }
        },
        "old": {
          "type": "branch",
          "name": "main",
          "target": {
            "hash": "789xyz000111"
          }
        }
      }
    ]
  },
  "repository": {
    "type": "repository",
    "full_name": "user/my-app",
    "name": "my-app",
    "links": {
      "clone": [
        {
          "name": "https",
          "href": "https://bitbucket.org/user/my-app.git"
        }
      ]
    }
  }
}
```

## Webhook Security

### Signature Verification

Flux-Orbit supports signature verification for:

#### GitHub (HMAC-SHA256)

GitHub sends signature in `X-Hub-Signature-256` header:

```javascript
const crypto = require('crypto');

function verifyGitHubSignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload, 'utf8');
  const expected = 'sha256=' + hmac.digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
```

#### GitLab (Token)

GitLab sends token in `X-Gitlab-Token` header:

```javascript
function verifyGitLabToken(token, secret) {
  return token === secret;
}
```

### IP Whitelisting

Recommended IP ranges to whitelist:

**GitHub:**
```
# Get latest from: https://api.github.com/meta
192.30.252.0/22
185.199.108.0/22
140.82.112.0/20
```

**GitLab:**
```
# GitLab.com
35.231.145.151
```

## Manual Trigger Examples

### Using cURL

```bash
# Check deployment status (no auth)
curl http://localhost:9001/status

# Check deployment status (with API key)
curl -H "Authorization: Bearer your_api_key" http://localhost:9001/status

# Check application health (always public)
curl http://localhost:9001/health

# Get build logs for latest release
curl http://localhost:9001/logs/1

# Get build logs with authentication
curl -H "Authorization: Bearer your_api_key" http://localhost:9001/logs/1

# Get last 50 lines of build log
curl "http://localhost:9001/logs/1?tail=50"

# Get build logs as JSON
curl "http://localhost:9001/logs/1?format=json"

# Trigger deployment
curl -X POST http://localhost:9001/webhook \
  -H "Content-Type: application/json" \
  -d '{"ref":"refs/heads/main"}'

# Trigger deployment with webhook signature verification
curl -X POST http://localhost:9001/webhook \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=..." \
  -d '{"ref":"refs/heads/main"}'
```

### Using JavaScript

```javascript
const crypto = require('crypto');
const axios = require('axios');

const baseUrl = 'http://localhost:9001';
const apiKey = 'your_api_key_here';  // Set to null if no auth required

// Create axios instance with optional auth
const apiClient = axios.create({
  baseURL: baseUrl,
  headers: apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}
});

// Check deployment status
async function checkStatus() {
  const response = await apiClient.get('/status');
  console.log('Deployment status:', response.data);
  return response.data;
}

// Check health (always public, no auth needed)
async function checkHealth() {
  const response = await axios.get(`${baseUrl}/health`);
  console.log('Health:', response.data);
  return response.data;
}

// Get build logs for a release
async function getBuildLogs(identifier, options = {}) {
  const params = new URLSearchParams();
  if (options.tail) params.append('tail', options.tail);
  if (options.format) params.append('format', options.format);

  const url = `/logs/${identifier}${params.toString() ? '?' + params.toString() : ''}`;
  const response = await apiClient.get(url);
  console.log('Build logs:', response.data);
  return response.data;
}

// Trigger deployment with authentication
async function triggerDeploy() {
  const secret = 'your_webhook_secret';
  const payload = JSON.stringify({
    ref: 'refs/heads/main',
    repository: {
      clone_url: 'https://github.com/user/repo.git'
    }
  });

  // Calculate signature
  const signature = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  // Send webhook
  const response = await axios.post(`${baseUrl}/webhook`, payload, {
    headers: {
      'Content-Type': 'application/json',
      'X-Hub-Signature-256': signature
    }
  });

  console.log('Deployment triggered:', response.data);
  return response.data;
}

// Monitor deployment progress
async function monitorDeployment() {
  let status = await checkStatus();

  while (status.status === 'deploying') {
    console.log(`Stage: ${status.stage}, Progress: ${status.progress_percent}%`);
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    status = await checkStatus();
  }

  console.log('Deployment completed!');
}

// Usage examples
await checkStatus();
await checkHealth();
await getBuildLogs(1);  // Latest release
await getBuildLogs('001-abc123...');  // By release ID
await getBuildLogs(1, { tail: 50 });  // Last 50 lines
await getBuildLogs(1, { format: 'json' });  // JSON format
await triggerDeploy();
await monitorDeployment();
```

### Using Python

```python
import hashlib
import hmac
import json
import requests
import time

BASE_URL = 'http://localhost:9001'
API_KEY = 'your_api_key_here'  # Set to None if no auth required

# Create session with optional auth headers
session = requests.Session()
if API_KEY:
    session.headers.update({'Authorization': f'Bearer {API_KEY}'})

def check_status():
    """Check deployment status"""
    response = session.get(f'{BASE_URL}/status')
    data = response.json()
    print('Deployment status:', data)
    return data

def check_health():
    """Check application health (always public, no auth)"""
    response = requests.get(f'{BASE_URL}/health')
    data = response.json()
    print('Health:', data)
    return data

def get_build_logs(identifier, tail=None, format='text'):
    """Get build logs for a release"""
    params = {}
    if tail:
        params['tail'] = tail
    if format != 'text':
        params['format'] = format

    url = f'{BASE_URL}/logs/{identifier}'
    response = session.get(url, params=params)

    if format == 'json':
        data = response.json()
        print(f'Build logs (JSON): {len(data.get("lines", []))} lines')
        return data
    else:
        print('Build logs (text):', response.text[:200], '...')
        return response.text

def trigger_deploy():
    """Trigger deployment with authentication"""
    secret = b'your_webhook_secret'
    payload = {
        'ref': 'refs/heads/main',
        'repository': {
            'clone_url': 'https://github.com/user/repo.git'
        }
    }

    # Calculate signature
    payload_bytes = json.dumps(payload).encode('utf-8')
    signature = 'sha256=' + hmac.new(
        secret,
        payload_bytes,
        hashlib.sha256
    ).hexdigest()

    # Send webhook
    response = requests.post(
        f'{BASE_URL}/webhook',
        json=payload,
        headers={
            'X-Hub-Signature-256': signature
        }
    )

    print('Deployment triggered:', response.json())
    return response.json()

def monitor_deployment():
    """Monitor deployment progress"""
    status = check_status()

    while status.get('status') == 'deploying':
        stage = status.get('stage', 'unknown')
        progress = status.get('progress_percent', 0)
        print(f"Stage: {stage}, Progress: {progress}%")

        time.sleep(5)  # Wait 5 seconds
        status = check_status()

    print('Deployment completed!')

# Usage
if __name__ == '__main__':
    check_status()
    check_health()
    get_build_logs(1)  # Latest release
    get_build_logs('001-abc123')  # By release ID
    get_build_logs(1, tail=50)  # Last 50 lines
    get_build_logs(1, format='json')  # JSON format
    trigger_deploy()
    monitor_deployment()
```

## Webhook Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `WEBHOOK_PORT` | 9001 | Port for webhook listener |
| `WEBHOOK_SECRET` | (empty) | Secret for signature verification |
| `WEBHOOK_SIGNATURE_VERIFY` | false | Enable signature verification |
| `WEBHOOK_PATH` | /webhook | Endpoint path |
| `WEBHOOK_TIMEOUT` | 30000 | Request timeout (ms) |

### Example Configuration

```bash
docker run -d \
  -e WEBHOOK_PORT=9001 \
  -e WEBHOOK_SECRET=your_secret_here \
  -e WEBHOOK_SIGNATURE_VERIFY=true \
  -e WEBHOOK_PATH=/deploy \
  -p 9001:9001 \
  runonflux/orbit:latest
```

## Deployment Queue

Flux-Orbit uses a single-slot pending deployment system to prevent conflicts:

- Multiple webhooks within 5 seconds are debounced (configurable via `DEBOUNCE_DELAY`)
- Only the **latest** commit is deployed (intermediate commits are skipped)
- Deployments run sequentially (never concurrent)
- If commits arrive during deployment, only the most recent one deploys next
- Failed deployments don't block new deployments

### Queue Management

```bash
# View queue status
curl http://localhost:9001/status | jq .queue

# Clear pending deployment
docker exec my-app rm -f /tmp/pending_commit

# Configure debounce delay (default: 5 seconds)
docker run -e DEBOUNCE_DELAY=10 ...  # Wait 10 seconds
docker run -e DEBOUNCE_DELAY=0 ...   # No debouncing (immediate)
```

### How It Works

**Example: Rapid commits during deployment**

```
T=0s:   Push commit A → Deploys immediately
T=30s:  Push commit B → Stored as pending
T=60s:  Push commit C → Replaces B (B is skipped)
T=90s:  Push commit D → Replaces C (C is skipped)
T=120s: A finishes → D deploys immediately (only latest)
```

Result: Only 2 deployments (A and D), intermediate commits skipped ✅

## Rate Limiting

Flux-Orbit implements basic rate limiting:

- Max 10 webhook requests per minute per IP
- Configurable via `WEBHOOK_RATE_LIMIT`
- Returns 429 Too Many Requests when exceeded

## Monitoring

### Using Status API

```bash
# Without authentication (if API_KEY not set)
curl http://localhost:9001/status | jq
curl http://localhost:9001/health | jq  # Always public
curl http://localhost:9001/logs/1 | head -50

# With authentication (if API_KEY is set)
API_KEY="your_api_key_here"
curl -H "Authorization: Bearer $API_KEY" http://localhost:9001/status | jq
curl http://localhost:9001/health | jq  # No auth needed for health
curl -H "Authorization: Bearer $API_KEY" http://localhost:9001/logs/1 | head -50

# Monitor deployment progress with authentication
API_KEY="your_api_key_here"
watch -n 2 "curl -s -H 'Authorization: Bearer $API_KEY' http://localhost:9001/status | jq"

# Get build logs for latest release
API_KEY="your_api_key_here"
curl -s -H "Authorization: Bearer $API_KEY" "http://localhost:9001/logs/1?tail=100"

# Get build logs as JSON with metadata
API_KEY="your_api_key_here"
curl -s -H "Authorization: Bearer $API_KEY" "http://localhost:9001/logs/1?format=json" | jq

# Monitor status, health, and recent build logs
API_KEY="your_api_key_here"
while true; do
  echo "=== Status ==="
  curl -s -H "Authorization: Bearer $API_KEY" http://localhost:9001/status | jq
  echo "=== Health ==="
  curl -s http://localhost:9001/health | jq
  echo "=== Latest Build Log (last 20 lines) ==="
  curl -s -H "Authorization: Bearer $API_KEY" "http://localhost:9001/logs/1?tail=20"
  sleep 5
done
```

### Webhook Logs

```bash
# View webhook activity
docker exec my-app tail -f /app/logs/webhook.log

# Count webhook calls
docker exec my-app grep "Webhook received" /app/logs/webhook.log | wc -l

# Failed verifications
docker exec my-app grep "verification failed" /app/logs/webhook.log
```

### Deployment Monitoring

```bash
# Watch deployment progress in real-time (with auth)
API_KEY="your_api_key_here"
while true; do
  STATUS=$(curl -s -H "Authorization: Bearer $API_KEY" http://localhost:9001/status)
  STAGE=$(echo $STATUS | jq -r '.stage // "idle"')
  PROGRESS=$(echo $STATUS | jq -r '.progress_percent // 0')
  echo "$(date): Stage=$STAGE Progress=${PROGRESS}%"
  sleep 2
done

# Alert when deployment completes and show build logs
API_KEY="your_api_key_here"
while true; do
  STATUS=$(curl -s -H "Authorization: Bearer $API_KEY" http://localhost:9001/status | jq -r '.status')
  if [ "$STATUS" != "deploying" ] && [ "$STATUS" != "building" ]; then
    echo "Deployment completed!"

    # Show last 100 lines of build log
    echo "=== Build Log ==="
    curl -s -H "Authorization: Bearer $API_KEY" "http://localhost:9001/logs/1?tail=100"

    # Send notification (Slack, email, etc.)
    break
  fi
  sleep 10
done

# Monitor build progress with live log streaming
API_KEY="your_api_key_here"
LAST_RELEASE=""
while true; do
  STATUS=$(curl -s -H "Authorization: Bearer $API_KEY" http://localhost:9001/status)
  CURRENT_STATUS=$(echo $STATUS | jq -r '.status')
  CURRENT_RELEASE=$(echo $STATUS | jq -r '.current_release // "unknown"')

  if [ "$CURRENT_STATUS" = "building" ]; then
    STAGE=$(echo $STATUS | jq -r '.building_release.stage')
    ELAPSED=$(echo $STATUS | jq -r '.building_release.elapsed_seconds')
    echo "$(date): Building... Stage: $STAGE (${ELAPSED}s elapsed)"
  elif [ "$CURRENT_RELEASE" != "$LAST_RELEASE" ] && [ "$LAST_RELEASE" != "" ]; then
    echo "$(date): New release deployed: $CURRENT_RELEASE"
    echo "=== Build Log ==="
    curl -s -H "Authorization: Bearer $API_KEY" "http://localhost:9001/logs/1?tail=50"
    LAST_RELEASE=$CURRENT_RELEASE
  else
    LAST_RELEASE=$CURRENT_RELEASE
  fi

  sleep 5
done
```

### Metrics

Track these metrics for monitoring:

- Webhook requests per minute
- Successful deployments
- Failed deployments
- Average deployment time
- Queue size
- Deployment stage durations
- Health check success rate

## Troubleshooting

### Common Issues

1. **404 Not Found**: Check `WEBHOOK_PATH` configuration
2. **401 Unauthorized**: Verify webhook secret matches
3. **500 Internal Error**: Check container logs
4. **Connection Refused**: Ensure port 9001 is exposed

### Debug Mode

Enable debug logging:

```bash
-e LOG_LEVEL=debug
-e DEBUG=webhook:*
```

## Next Steps

- [GitHub Webhooks Setup](../ci-cd/github-webhooks)
- [Environment Variables](../configuration/environment-reference)
- [Troubleshooting Guide](../troubleshooting/common-issues)