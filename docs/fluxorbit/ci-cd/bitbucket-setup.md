---
sidebar_position: 3
title: Bitbucket Setup
description: Auto-deploy from Bitbucket to Flux Network
---

# Bitbucket Setup

Push code to Bitbucket → Auto-deploy to Flux Network. Works with Bitbucket Cloud and Server.

## Quick Setup

### Step 1: Deploy on Flux Cloud

1. Go to [cloud.runonflux.com](https://cloud.runonflux.com)
2. Login with your preferred method
3. Click **Register New App**
4. Use these settings:

```yaml
App Name: my-bitbucket-app
Docker Image: runonflux/orbit:latest
Port: 3000  # Your app's port
Port 2: 9001  # Webhook listener port

Environment Variables:
  GIT_REPO_URL: https://bitbucket.org/YOU/YOUR-REPO
  APP_PORT: 3000
  WEBHOOK_SECRET: choose-a-secret
```

### Step 2: Add Bitbucket Webhook

1. Go to your Bitbucket repository
2. Navigate to **Settings** → **Webhooks** → **Add webhook**
3. Fill in:
   - **Title**: `Flux Orbit Deploy`
   - **URL**: `https://YOUR-APP-9001.app.runonflux.io/webhook`
   - **Triggers**: Choose "Repository push"
4. Click **Save**

### Step 3: Test It

Push some code:
```bash
git add .
git commit -m "Test Bitbucket webhook"
git push
```

Your app updates automatically!

## Private Repositories

For private Bitbucket repos, create an app password:

```yaml
Environment Variables:
  GIT_REPO_URL: https://bitbucket.org/YOU/private-repo
  GIT_USERNAME: your_username
  GIT_TOKEN: your_app_password
  APP_PORT: 3000
```

**How to create an app password:**
1. Bitbucket → Personal Settings → App passwords
2. Click **Create app password**
3. Label: `flux-orbit`
4. Permissions: Repository Read
5. Click **Create**
6. Copy the password to your Flux app

## Bitbucket Server (Self-Hosted)

Same process, just use your server URL:

```yaml
Environment Variables:
  GIT_REPO_URL: https://bitbucket.company.com/projects/PROJ/repos/app
  GIT_USERNAME: your_username
  GIT_TOKEN: your_password_or_token
```

## Deploy Different Branches

Run multiple environments:

**Production:**
```yaml
App Name: app-production
Environment Variables:
  GIT_BRANCH: master
  APP_PORT: 3000
```

**Development:**
```yaml
App Name: app-development
Environment Variables:
  GIT_BRANCH: develop
  APP_PORT: 3001
```

## Check Your Logs

View deployment activity in Flux dashboard, or via SSH:

```bash
# Recent webhook hits
docker exec YOUR-APP tail -20 /app/logs/webhook.log

# Live deployment progress
docker exec YOUR-APP tail -f /app/logs/update.log
```

## Troubleshooting

### Webhook Not Working?

**Quick checks:**
- Port 9001 is exposed in Flux app settings
- Your app URL is accessible from internet
- Webhook secret matches (if using one)

### Test Webhook Manually

```bash
curl -X POST https://YOUR-APP-9001.app.runonflux.io/webhook \
  -H "Content-Type: application/json" \
  -d '{"push":{"changes":[{"new":{"name":"master"}}]}}'
```

## Bitbucket Pipelines Integration

Deploy from Bitbucket Pipelines? Add to `bitbucket-pipelines.yml`:

```yaml
pipelines:
  branches:
    master:
      - step:
          name: Deploy to Flux
          script:
            - |
              curl -X POST $WEBHOOK_URL \
                -H "Content-Type: application/json" \
                -d '{"push":{"changes":[{"new":{"name":"master"}}]}}'
```

Set `WEBHOOK_URL` in repository variables.

## Alternative: Polling Mode

Skip webhooks - let Flux-Orbit check for updates:

```yaml
Environment Variables:
  POLLING_INTERVAL: 300  # Check every 5 minutes
  # No webhook needed!
```

Flux-Orbit will pull the latest code automatically.

## Pro Tips

1. **Use Branch Restrictions** - Limit who can deploy to production
2. **Add Webhook Secret** - Prevents unauthorized deployments
3. **Monitor Webhook History** - Bitbucket shows delivery attempts and responses

## Next Steps

- Deploy from [GitHub](./github-webhooks) or [GitLab](./gitlab-integration)
- Configure [Environment Variables](../configuration/environment-reference)
- Learn about [Deployment Hooks](../hooks/deployment-hooks)

---

**Need help?**
- **Documentation**: [orbit.app.runonflux.io](https://orbit.app.runonflux.io)
- **Community**: [Flux Discord](https://discord.gg/runonflux)
- **Issues**: [GitHub](https://github.com/runonflux/orbit/issues)