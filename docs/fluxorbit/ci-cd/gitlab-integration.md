---
sidebar_position: 2
title: GitLab Integration
description: Auto-deploy from GitLab to Flux Network
---

# GitLab Integration

Push code to GitLab → Auto-deploy to Flux Network. Works with GitLab.com and self-hosted GitLab.

## Quick Setup

### Step 1: Deploy on Flux Cloud

1. Go to [cloud.runonflux.com](https://cloud.runonflux.com)
2. Login with your preferred method
3. Click **Register New App**
4. Use these settings:

```yaml
App Name: my-gitlab-app
Docker Image: runonflux/orbit:latest
Port: 3000  # Your app's port
Port 2: 9001  # Webhook listener port

Environment Variables:
  GIT_REPO_URL: https://gitlab.com/YOU/YOUR-PROJECT
  APP_PORT: 3000
  WEBHOOK_SECRET: choose-a-secret-token
```

### Step 2: Add GitLab Webhook

1. Go to your GitLab project
2. Navigate to **Settings** → **Webhooks**
3. Fill in:
   - **URL**: `https://YOUR-APP-9001.app.runonflux.io/webhook`
   - **Secret Token**: Your secret from Step 1
   - **Trigger**: Push events
   - **SSL Verification**: Enable (if using HTTPS)
4. Click **Add webhook**

### Step 3: Test It

Click **Test** → **Push events** in GitLab webhook settings.

Or push some code:
```bash
git add .
git commit -m "Test GitLab webhook"
git push
```

Your app will update automatically!

## Private Repositories

For private GitLab repos, create and add an access token:

```yaml
Environment Variables:
  GIT_REPO_URL: https://gitlab.com/YOU/private-project
  GIT_TOKEN: glpat-your_gitlab_token
  GIT_USERNAME: your_username  # Optional
  APP_PORT: 3000
```

**How to create a token:**
1. GitLab → Settings → Access Tokens
2. Name: `flux-orbit-deploy`
3. Scope: `read_repository`
4. Click **Create personal access token**
5. Copy the token to your Flux app

## Self-Hosted GitLab

Works the same way! Just use your GitLab server URL:

```yaml
Environment Variables:
  GIT_REPO_URL: https://gitlab.company.com/team/project
  GIT_TOKEN: your_token
  WEBHOOK_SECRET: your_secret
```

## Deploy Different Branches

Run multiple environments:

**Production:**
```yaml
App Name: app-production
Environment Variables:
  GIT_BRANCH: main
  APP_PORT: 3000
```

**Staging:**
```yaml
App Name: app-staging
Environment Variables:
  GIT_BRANCH: develop
  APP_PORT: 3001
```

## Check Deployment Status

View logs in Flux dashboard, or if you have SSH access:

```bash
# Recent webhook activity
docker exec YOUR-APP tail -20 /app/logs/webhook.log

# Live deployment progress
docker exec YOUR-APP tail -f /app/logs/update.log
```

## Troubleshooting

### Webhook Shows Error?

**Common fixes:**
- Ensure port 9001 is exposed in Flux app settings
- Check the secret token matches exactly
- Verify your app URL is accessible from internet

### GitLab CI/CD Integration

Want to deploy from GitLab CI instead? Add to `.gitlab-ci.yml`:

```yaml
deploy:
  stage: deploy
  script:
    - |
      curl -X POST $WEBHOOK_URL \
        -H "X-Gitlab-Token: $WEBHOOK_SECRET" \
        -d '{"ref":"refs/heads/main"}'
  only:
    - main
```

Set `WEBHOOK_URL` and `WEBHOOK_SECRET` in GitLab CI variables.

## Alternative: Polling Mode

Skip webhooks entirely - let Flux-Orbit check for updates:

```yaml
Environment Variables:
  POLLING_INTERVAL: 300  # Check every 5 minutes
  # No webhook needed!
```

## Pro Tips

1. **Use Protected Branches** - Deploy only from protected branches for safety
2. **Tag Deployments** - Deploy specific versions using Git tags
3. **Monitor Deliveries** - GitLab shows webhook delivery history with details

## Next Steps

- Deploy from [GitHub](./github-webhooks) or [Bitbucket](./bitbucket-setup)
- Learn about [Deployment Hooks](../hooks/deployment-hooks)
- Set up [Environment Variables](../configuration/environment-reference)

---

**Need help?**
- **Documentation**: [orbit.app.runonflux.io](https://orbit.app.runonflux.io)
- **Community**: [Flux Discord](https://discord.gg/runonflux)
- **Issues**: [GitHub](https://github.com/runonflux/orbit/issues)