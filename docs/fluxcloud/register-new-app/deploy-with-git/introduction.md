---
sidebar_position: 1
title: Introduction
description: Deploy Any Web App in Minutes, Not Hours
---

# Deploy with Git: Your Code. Our Magic. Zero Docker Headaches.

**Deploy with Git** is the easiest way to deploy React, Next.js, Vue, Django, Rails, Laravel, Gin APIs, Elysia apps, Actix APIs, Rocket apps, Spring Boot services, ASP.NET Core apps, and any Node.js, Python, Ruby, Go, Bun, Rust, Java, .NET Core, or PHP application on Flux Network. No Docker expertise required. No complex configuration. Just point us to your GitHub repo and hit launch.

## The Problem We Solve

### Before Deploy with Git

- **"I need to learn Docker just to deploy my app"** - Writing Dockerfiles is confusing
- **"Setting up CI/CD is too complicated"** - Configuring webhooks is tedious
- **"I broke production and don't know how to fix it"** - No automatic recovery
- **"Different setup for each framework"** - Copy-paste errors everywhere

### After Deploy with Git

- **Deploy in 3 clicks** - Paste GitHub URL, set port, hit launch
- **Automatic updates from Git** - Push to GitHub → Auto-deploy
- **Sleep soundly** - Bad deploy? Automatic rollback
- **One solution for everything** - Same simple process every time

## How Simple Is It?

### Deploy a Next.js Blog in 30 Seconds:

```bash
docker run -d \
  -e GIT_REPO_URL=https://github.com/timlrx/tailwind-nextjs-starter-blog \
  -e APP_PORT=3000 \
  -p 3000:3000 \
  runonflux/orbit:latest
```

**That's it!** Your app is live at `your-app.app.runonflux.io`

## The Magic Explained Simply

When you give us your repo, here's what happens:

1. **We Detect Your Framework** - Next.js? Django? Rails? Laravel? Gin? Elysia? Actix? Rocket? Spring Boot? ASP.NET Core? We know.
2. **Install the Right Tools** - Node, Python, Ruby, Go, Bun, Rust, Java, .NET, PHP - whatever you need
3. **Build Your App** - We know the commands for popular frameworks
4. **Deploy on Flux** - Running on 3+ nodes for high availability
5. **Keep It Updated** - Push to Git, we auto-deploy
6. **Protect You** - If deploy fails, we rollback automatically

## Real-World Examples

### Sarah the Solo Developer
*"I just want to deploy my side project"*

Sarah built a React app. Before Deploy with Git: 47 browser tabs trying to figure out Docker. With Deploy with Git: Deployed in 2 minutes, shipping features same day.

### TechCorp Startup
*"We need reliable deployments without a DevOps team"*

3 developers, 5 microservices (Node + Python + Go APIs). Before: Manual SSH deployments, Friday disasters. With Deploy with Git: Git push auto-deploys, saved $120k/year on DevOps hire.

### Marcus the Bootcamp Grad
*"I learned to code, but not Docker"*

Built a Django portfolio. Before: Paying $20/month for managed hosting. With Deploy with Git: Deployed to decentralized Flux, looks like a senior dev in interviews.

## Key Features That Make Your Life Easier

### Smart Auto-Detection
**You don't need to know Docker. We figure it out.**

- Detects Node.js version from `.nvmrc` or `package.json`
- Finds Python version from `runtime.txt` or `pyproject.toml`
- Reads Ruby version from `.ruby-version` or `Gemfile`
- Detects Go version from `go.mod` or `.go-version`
- Detects Bun version from `.bun-version` or `package.json`
- Detects Rust version from `rust-toolchain.toml` or `Cargo.toml`
- Detects Java version from `pom.xml` or `build.gradle`
- Detects .NET version from `global.json` or `.csproj` TargetFramework
- Detects PHP version from `composer.json` or defaults to 8.2
- Knows how to build Next.js, Vite, Django, Rails, Laravel, Gin, Elysia, Actix, Rocket, Spring Boot, ASP.NET Core, and more

### Perfect for Modern Frameworks

**Frontend Frameworks:**
- React, Vue, Svelte, Angular
- Next.js, Nuxt, SvelteKit, Remix
- Vite, Webpack, Create React App
- Static sites with HTML/CSS/JS

**Backend Frameworks:**
- Express, Fastify, NestJS (Node.js)
- Elysia, Hono (Bun)
- Django, Flask, FastAPI (Python)
- Rails, Sinatra (Ruby)
- Gin, Echo, Fiber (Go)
- Actix-web, Rocket, Axum, Warp (Rust)
- Spring Boot, Quarkus, Micronaut (Java)
- ASP.NET Core, Blazor, Minimal APIs (C#/.NET)
- Laravel, Symfony, Slim (PHP)

### Zero-Effort CI/CD

- **Option 1: Webhooks** - Push code → Auto-deploy instantly
- **Option 2: Polling** - Check for updates every 5 minutes
- **Option 3: Both** - Webhooks + polling backup

### Bulletproof Error Recovery

- **Automatic Rollback** - New code breaks? Revert to last working version
- **Unlimited Restarts** - We keep trying until it works
- **Smart Health Checks** - Know when something's wrong

### Production Features

- **Multi-Instance** - Runs on 3+ Flux nodes for 99.9% uptime
- **Private Repos** - Support for GitHub/GitLab tokens
- **Monorepo Support** - Deploy specific folders with PROJECT_PATH
- **Deployment Hooks** - Run database migrations automatically with pre-deploy.sh
- **Environment Variables** - Secure secret management
- **Automatic Rollback** - Failed deployments rollback to last working version

## Quick Start Examples

### Deploy a React App
```yaml
App Name: my-react-app
Docker Image: runonflux/:latest
Git Repo: https://github.com/you/react-app
Port: 3000
```

### Deploy a Python API
```yaml
App Name: my-api
Docker Image: runonflux/:latest
Git Repo: https://github.com/you/fastapi-app
Port: 8000
```

### Deploy a Bun Elysia API
```yaml
App Name: my-bun-api
Docker Image: runonflux/:latest
Git Repo: https://github.com/you/elysia-app
Port: 3000
```

### Deploy a Spring Boot API
```yaml
App Name: my-spring-api
Docker Image: runonflux/:latest
Git Repo: https://github.com/you/spring-boot-app
Port: 8080
```

### Deploy an ASP.NET Core App
```yaml
App Name: my-dotnet-app
Docker Image: runonflux/:latest
Git Repo: https://github.com/you/aspnet-app
Port: 5000
```

### Deploy from Private Repo
```yaml
Git Repo: https://github.com/you/private-app
Git Token: ghp_your_token_here
Port: 3000
```

## Pricing & Value

- **Pay only Flux Network rates** - No additional fees
- **Typical costs:** Small app ~$3-10/month
- **Compare to Heroku:** Same app = $25-500/month
- **Enterprise features at indie hacker prices**

## What Developers Are Saying

> *"I deployed my first decentralized app in under 5 minutes. I still don't know Docker and that's fine."*
> — Alex, Frontend Developer

> *"We migrated 8 microservices from AWS in one afternoon. Deploy with Git just works."*
> — Jordan, CTO at GrowthStack

> *"The automatic rollback saved us twice last week. Worth it for that alone."*
> — Taylor, DevOps Engineer

## Ready to Deploy?

<div className="row">
  <div className="col col--4">
    <div className="card">
      <div className="card__header">
        <h3>Quick Start</h3>
      </div>
      <div className="card__body">
        <p>Deploy in 5 minutes</p>
      </div>
      <div className="card__footer">
        <a className="button button--primary button--block" href="./getting-started/quick-start">Start Now</a>
      </div>
    </div>
  </div>
  <div className="col col--4">
    <div className="card">
      <div className="card__header">
        <h3>Guides</h3>
      </div>
      <div className="card__body">
        <p>Framework tutorials</p>
      </div>
      <div className="card__footer">
        <a className="button button--primary button--block" href="./guides/deploying-nodejs">View Guides</a>
      </div>
    </div>
  </div>
  <div className="col col--4">
    <div className="card">
      <div className="card__header">
        <h3>CI/CD</h3>
      </div>
      <div className="card__body">
        <p>Auto-deployment setup</p>
      </div>
      <div className="card__footer">
        <a className="button button--primary button--block" href="./ci-cd/github-webhooks">Setup CI/CD</a>
      </div>
    </div>
  </div>
</div>

## Get Help

- **GitHub**: [Report issues](https://github.com/runonflux/orbit/issues)
- **Discord**: [Join Flux community](https://discord.gg/runonflux)
- **Docker Hub**: [runonflux/orbit](https://hub.docker.com/r/runonflux/orbit)

---

**Deploy with Git** - Because your code deserves better than a 47-tab Docker tutorial.

*Built with ❤️ for developers who just want to ship.*
