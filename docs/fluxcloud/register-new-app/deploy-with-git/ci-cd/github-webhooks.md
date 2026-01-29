---
sidebar_position: 1
title: GitHub Webhooks
description: Auto-deploy from GitHub to Flux Network
---

# GitHub Webhooks

Push code to GitHub → Auto-deploy to Flux Network. It's that simple.

## 5-Minute Setup

### Step 1: Deploy Your App on Flux Cloud

1. Go to [cloud.runonflux.com](https://cloud.runonflux.com)
2. Login with your preferred method (Email, Google, Apple ID, Wallet, etc.)
3. Click **Register New App**
4. Fill in these settings:

```yaml
App Name: my-awesome-app
Docker Image: runonflux/orbit:latest
Port: 3000  # Your app's port
Port 2: 9001  # Webhook listener port

Environment Variables:
  GIT_REPO_URL: https://github.com/YOU/YOUR-REPO
  APP_PORT: 3000
  WEBHOOK_SECRET: choose-a-secret-phrase
```

5. Click **Deploy** and complete the payment
6. Your app will be deployed to Flux Network!

:::tip
Choose any secret phrase for `WEBHOOK_SECRET`. You'll use the same one in GitHub.
:::

### Step 2: Add GitHub Webhook

1. Go to your GitHub repository
2. Click **Settings** → **Webhooks** → **Add webhook**
3. Fill in:
   - **Payload URL**: `https://YOUR-APP-9001.app.runonflux.io/webhook`
   - **Content type**: `application/json`
   - **Secret**: Your secret phrase from Step 1
   - **Events**: Just the push event
4. Click **Add webhook**

That's it! GitHub will show a green checkmark ✅ when it's working.

### Step 3: Test It Out

Make any change to your code:

```bash
git add .
git commit -m "Test auto-deploy"
git push
```

Watch your app update automatically! Check the logs in Flux Cloud dashboard to see the deployment.

## What Just Happened?

When you push code to GitHub:
1. GitHub sends a webhook to your Flux app
2. Deploy with Git pulls the new code
3. Installs dependencies if needed
4. Builds your app (if needed)
5. Restarts with the new version
6. If anything fails, it rolls back automatically

All of this happens in about 2 minutes. No manual intervention needed.

## Private Repositories

For private repos, add a GitHub token when registering your app on Flux Cloud:

```yaml
Environment Variables:
  GIT_REPO_URL: https://github.com/YOU/private-repo
  GIT_TOKEN: ghp_your_github_token_here
  APP_PORT: 3000
```

**How to get a token:**
1. GitHub → Settings → Developer Settings → Personal Access Tokens
2. Generate new token (classic)
3. Select scope: `repo` (for private repos)
4. Copy the token to your Flux app environment

## Deploy Different Branches

Want to deploy staging and production separately? Register two apps on Flux Cloud:

**Production App:**
```yaml
App Name: myapp-production
Environment Variables:
  GIT_BRANCH: main
  APP_PORT: 3000
```

**Staging App:**
```yaml
App Name: myapp-staging
Environment Variables:
  GIT_BRANCH: develop
  APP_PORT: 3001
```

Each app gets its own webhook URL. Add both to GitHub webhooks.

## Check Your Logs

See what's happening in the Flux Cloud dashboard logs, or if you have SSH access:

```bash
# See webhook activity
docker exec YOUR-APP tail -20 /app/logs/webhook.log

# See deployment progress
docker exec YOUR-APP tail -f /app/logs/update.log
```

## Troubleshooting

### Webhook Shows Red ❌ in GitHub?

**Check if your app is accessible:**
- Make sure port 9001 is exposed in Flux app settings
- Your app URL should be reachable from the internet
- Test with: `curl https://YOUR-APP-9001.app.runonflux.io/webhook`

### Push Didn't Trigger Deployment?

**Quick checks:**
1. Is the webhook secret correct? (must match exactly)
2. Are you pushing to the right branch? (check GIT_BRANCH setting)
3. Check logs for errors: Look in Flux Cloud dashboard → Your App → Logs

### Need to Deploy Manually?

You can trigger deployment without GitHub:

```bash
# SSH into your Flux node, then:
docker exec YOUR-APP /usr/local/bin/flux-entrypoint.sh update
```

## Pro Tips

### 1. Use Webhook Secrets
Always set `WEBHOOK_SECRET` to prevent unauthorized deployments.

### 2. Branch Protection
Use GitHub's branch protection rules to require PR reviews before deployment.

### 3. Deployment Notifications
Want to know when deployments happen? GitHub webhook page shows recent deliveries with timestamps.

### 4. Faster Builds
Add a `.nvmrc` file to specify Node.js version - saves detection time.

## Alternative: Polling Mode

Don't want to set up webhooks? Use polling instead when registering your app:

```yaml
Environment Variables:
  POLLING_INTERVAL: 300  # Check every 5 minutes
  # No webhook setup needed!
```

Deploy with Git will check for new commits every 5 minutes and deploy automatically.

## Next Steps

- Deploy from [GitLab](./gitlab-integration) or [Bitbucket](./bitbucket-setup)
- Configure [Environment Variables](../configuration/environment-reference)
- Learn about [Deployment Hooks](../hooks/deployment-hooks)

---

**Need help?**
- **Documentation**: [orbit.app.runonflux.io](https://orbit.app.runonflux.io)
- **Community**: [Flux Discord](https://discord.gg/runonflux)
- **Issues**: [GitHub](https://github.com/runonflux/orbit/issues)
