---
sidebar_position: 1
title: Quick Start
description: Deploy to Flux Network in 5 minutes
---

# 5-Minute Quick Start

Deploy your first app to Flux Network! No Docker knowledge needed. Just follow these simple steps.

## Step 1: Get a Flux Account

First, you need a Flux Cloud account:
1. Visit [cloud.runonflux.com](https://cloud.runonflux.com)
2. Login with your preferred method:
   - Email
   - Google
   - Apple ID
   - Wallet
   - And more options
3. You're ready to deploy!

## Step 2: Deploy Your First App

### Option A: Deploy Our Demo App

Let's start with a working Next.js blog to see the magic:

**In Flux Cloud → Register New App:**

```yaml
App Name: my-first-app
Docker Image: runonflux/orbit:latest
Port 1: 3000
Port 2: 9001  # For webhooks (optional)

Environment Variables:
  GIT_REPO_URL: https://github.com/timlrx/tailwind-nextjs-starter-blog
  APP_PORT: 3000
  POLLING_INTERVAL: 300  # Auto-update every 5 minutes (optional)
```

Click **Deploy** → Pay the deployment cost → Wait 2 minutes → Your app is live!

**Pro tip:** With `POLLING_INTERVAL: 300`, your app will automatically check for updates every 5 minutes. No webhook setup needed!

**Your app will be available at:** `my-first-app.app.runonflux.io`

### Option B: Deploy Your Own Code

Have a GitHub repo? Deploy it:

```yaml
App Name: your-app-name
Docker Image: runonflux/orbit:latest
Port: 3000  # Change to match your app

Environment Variables:
  GIT_REPO_URL: https://github.com/YOU/YOUR-REPO
  APP_PORT: 3000  # Must match the port above
  POLLING_INTERVAL: 300  # Auto-update every 5 minutes (optional)
```

That's it! Flux-Orbit will:
- <MDXIcon icon="mdi:check-circle" color="#22c55e" /> Detect your framework (<MDXIcon icon="simple-icons:react" />React, <MDXIcon icon="simple-icons:vuedotjs" />Vue, <MDXIcon icon="simple-icons:django" />Django, <MDXIcon icon="simple-icons:rubyonrails" />Rails, etc.)
- <MDXIcon icon="mdi:check-circle" color="#22c55e" /> Install the right runtime (<MDXIcon icon="simple-icons:nodedotjs" />Node.js, <MDXIcon icon="simple-icons:python" />Python, <MDXIcon icon="simple-icons:ruby" />Ruby)
- <MDXIcon icon="mdi:check-circle" color="#22c55e" /> Install dependencies
- <MDXIcon icon="mdi:check-circle" color="#22c55e" /> Build your app
- <MDXIcon icon="mdi:check-circle" color="#22c55e" /> Start it running

## Step 3: Watch It Deploy

After clicking deploy and completing payment, you can watch the magic happen in the Flux Cloud dashboard logs:

```
[SETUP] Cloning your repository...
[SETUP] Detected Node.js project!
[SETUP] Installing dependencies...
[BUILD] Building your application...
[START] Your app is running on port 3000!
```

## Common App Examples

### <MDXIcon icon="simple-icons:react" /> React/Next.js App
```yaml
GIT_REPO_URL: https://github.com/you/react-app
APP_PORT: 3000
```

### <MDXIcon icon="simple-icons:python" /> Python/Django App
```yaml
GIT_REPO_URL: https://github.com/you/django-app
APP_PORT: 8000
```

### <MDXIcon icon="simple-icons:ruby" /> Ruby on Rails App
```yaml
GIT_REPO_URL: https://github.com/you/rails-app
APP_PORT: 3000
```

### <MDXIcon icon="simple-icons:vuedotjs" /> Vue.js App
```yaml
GIT_REPO_URL: https://github.com/you/vue-app
APP_PORT: 8080
```

## Private Repository?

Add your GitHub token:

```yaml
Environment Variables:
  GIT_REPO_URL: https://github.com/you/private-repo
  GIT_TOKEN: ghp_your_github_token_here
  APP_PORT: 3000
```

**How to get a token:**
1. GitHub → Settings → Developer Settings
2. Personal Access Tokens → Generate Token
3. Give it `repo` permission
4. Copy to Flux app settings

## Enable Auto-Deploy (Optional)

Want your app to update when you push code?

### Option 1: Easy Mode (Polling)
Add this environment variable:
```yaml
POLLING_INTERVAL: 300  # Check every 5 minutes
```

### Option 2: Instant Updates (Webhooks)
1. Add webhook secret:
   ```yaml
   WEBHOOK_SECRET: choose-any-secret
   ```
2. In GitHub → Settings → Webhooks → Add:
   - URL: `https://your-app-9001.app.runonflux.io/webhook`
   - Secret: Same as above

Now every `git push` auto-deploys!

## Troubleshooting

### "Build Failed"
Your app might need a specific build command:
```yaml
BUILD_COMMAND: npm run build:production
```

### "App Won't Start"
Your app might use a different start command:
```yaml
RUN_COMMAND: npm run start:prod
```

### "Wrong Node/Python Version"
Specify the version you need:
```yaml
NODE_VERSION: 18.17.0  # For Node.js
PYTHON_VERSION: 3.11   # For Python
RUBY_VERSION: 3.0      # For Ruby
```

### Deploy from Monorepo?
Deploy a specific folder:
```yaml
PROJECT_PATH: apps/frontend
```

## Check Your App

Once deployed, you can:
- **Visit your app**: `your-app-name.app.runonflux.io`
- **View logs**: Check Flux Cloud dashboard
- **Monitor health**: Flux shows uptime stats

## Quick Commands Cheat Sheet

### View Logs (if you have SSH access)
```bash
docker logs your-app-name
```

### Restart App
```bash
docker restart your-app-name
```

### Update Manually
```bash
docker exec your-app-name /usr/local/bin/flux-entrypoint.sh update
```

## Real Examples That Work

### <MDXIcon icon="simple-icons:nextdotjs" /> Deploy a Blog
```yaml
GIT_REPO_URL: https://github.com/timlrx/tailwind-nextjs-starter-blog
APP_PORT: 3000
```

### <MDXIcon icon="mdi:view-dashboard" /> Deploy a Dashboard
```yaml
GIT_REPO_URL: https://github.com/shadcn-ui/ui
APP_PORT: 3000
PROJECT_PATH: apps/www
```

### <MDXIcon icon="simple-icons:fastapi" /> Deploy an API
```yaml
GIT_REPO_URL: https://github.com/tiangolo/fastapi-realworld-example-app
APP_PORT: 8000
```

## What's Next?

You did it! Your app is live on the decentralized web. Here's what to explore:

- <MDXIcon icon="mdi:rocket-launch" color="#22c55e" /> **[Set up auto-deploy](../ci-cd/github-webhooks)** - Push code, auto-deploy
- <MDXIcon icon="mdi:cog" color="#22c55e" /> **[Configure environment](../configuration/environment-reference)** - Environment variables and settings
- <MDXIcon icon="mdi:hook" color="#22c55e" /> **[Deployment hooks](../hooks/deployment-hooks)** - Run migrations and scripts

## Need Help?

- <MDXIcon icon="mdi:book-open-variant" /> **Documentation**: [orbit.app.runonflux.io](https://orbit.app.runonflux.io)
- <MDXIcon icon="mdi:tools" /> **Something broken?** Check [Troubleshooting](../troubleshooting/common-issues)
- <MDXIcon icon="simple-icons:discord" /> **Ask the community:** [Flux Discord](https://discord.gg/runonflux)
- <MDXIcon icon="simple-icons:github" /> **Report bugs:** [GitHub Issues](https://github.com/runonflux/orbit/issues)

---

**Congratulations!** You've just deployed to the decentralized web. No Docker knowledge required. That's the Flux-Orbit magic!

**Remember:** Your code deserves better than a 47-tab Docker tutorial. That's why we built this.