---
sidebar_position: 10
title: PR Preview Deployments
description: Automatic preview builds for pull requests on static sites
---

# PR Preview Deployments

Flux-Orbit supports automatic preview deployments for pull requests on static sites. This feature allows you to review changes in a live environment before merging to production.

## Overview

PR (Pull Request) previews create isolated build environments for each pull request, allowing team members and stakeholders to test changes without affecting the main deployment.

### Key Features

- <MDXIcon icon="mdi:webhook" /> **Automatic builds** triggered via webhook or polling
- <MDXIcon icon="mdi:web" /> **Isolated previews** - each PR gets its own URL
- <MDXIcon icon="mdi:file-document" /> **Build logs** - view detailed logs for debugging
- <MDXIcon icon="mdi:delete-sweep" /> **Automatic cleanup** - old previews are automatically removed
- <MDXIcon icon="simple-icons:github" /> **GitHub Actions integration** - seamless CI/CD workflow
- <MDXIcon icon="mdi:sync" /> **Polling support** - works without webhooks

## Requirements

:::warning Static Sites Only
PR preview deployments are **only supported for static sites**. Dynamic applications (Node.js servers, Python apps, etc.) are not supported.
:::

### Supported Static Site Generators

- <MDXIcon icon="simple-icons:react" /> React (Create React App, Vite)
- <MDXIcon icon="simple-icons:vuedotjs" /> Vue (Vue CLI, Vite)
- <MDXIcon icon="simple-icons:nextdotjs" /> Next.js (static export)
- <MDXIcon icon="simple-icons:nuxtdotjs" /> Nuxt (static generation)
- <MDXIcon icon="simple-icons:docusaurus" /> Docusaurus
- <MDXIcon icon="simple-icons:markdown" /> VitePress
- <MDXIcon icon="simple-icons:jekyll" /> Jekyll
- <MDXIcon icon="simple-icons:hugo" /> Hugo
- <MDXIcon icon="simple-icons:gatsby" /> Gatsby
- <MDXIcon icon="simple-icons:svelte" /> Svelte/SvelteKit (adapter-static)
- <MDXIcon icon="simple-icons:angular" /> Angular

### Project Requirements

Your project must:
1. <MDXIcon icon="mdi:check" color="#22c55e" /> Have `serve_type: "static"` in config.json (automatically detected)
2. <MDXIcon icon="mdi:check" color="#22c55e" /> Output build files to one of these directories:
   - `dist/`
   - `build/`
   - `out/`
   - `public/`
   - `.output/`
   - `_site/`

## Setup

### 1. Enable PR Previews

Add these environment variables to your Flux application:

```yaml
Environment Variables:
  PR_PREVIEW_ENABLED: "true"
  PR_PREVIEW_MAX_AGE: "86400"       # 24 hours (optional)
  PR_PREVIEW_MAX_COUNT: "10"        # Max concurrent previews (optional)
```

### 2. Choose a Trigger Method

#### Option A: GitHub Webhook (Recommended)

Configure your GitHub repository to send PR events to your webhook endpoint:

1. Go to your repository → Settings → Webhooks → Add webhook
2. Configure:
   - **Payload URL**: `https://your-app_9001.app.runonflux.io/webhook`
   - **Content type**: `application/json`
   - **Secret**: Your `API_KEY` value (optional but recommended)
   - **Events**: Select "Pull requests"

PR events (`opened`, `synchronize`, `closed`) are automatically detected and handled.

#### Option B: GitHub Actions

Create `.github/workflows/pr-preview.yml`:

```yaml
name: PR Preview

on:
  pull_request:
    types: [opened, synchronize, reopened, closed]

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Preview Build
        if: github.event.action != 'closed'
        run: |
          curl -X POST ${{ secrets.FLUX_WEBHOOK_URL }}/webhook \
            -H "Content-Type: application/json" \
            -H "X-GitHub-Event: pull_request" \
            -H "X-API-Key: ${{ secrets.FLUX_API_KEY }}" \
            -d '{
              "action": "${{ github.event.action }}",
              "pull_request": {
                "number": ${{ github.event.pull_request.number }},
                "head": {
                  "sha": "${{ github.event.pull_request.head.sha }}",
                  "ref": "${{ github.event.pull_request.head.ref }}"
                },
                "base": {
                  "ref": "${{ github.event.pull_request.base.ref }}"
                },
                "title": "${{ github.event.pull_request.title }}",
                "user": {
                  "login": "${{ github.event.pull_request.user.login }}"
                }
              }
            }'

      - name: Delete Preview on PR Close
        if: github.event.action == 'closed'
        run: |
          curl -X POST ${{ secrets.FLUX_WEBHOOK_URL }}/webhook \
            -H "Content-Type: application/json" \
            -H "X-GitHub-Event: pull_request" \
            -H "X-API-Key: ${{ secrets.FLUX_API_KEY }}" \
            -d '{
              "action": "closed",
              "pull_request": {
                "number": ${{ github.event.pull_request.number }},
                "head": {
                  "sha": "${{ github.event.pull_request.head.sha }}",
                  "ref": "${{ github.event.pull_request.head.ref }}"
                },
                "base": {
                  "ref": "${{ github.event.pull_request.base.ref }}"
                }
              }
            }'

      - name: Comment Preview URL
        if: github.event.action != 'closed'
        uses: actions/github-script@v7
        with:
          script: |
            const prNumber = context.payload.pull_request.number;
            const previewUrl = `https://your-app_3000.app.runonflux.io/flux-pr-${prNumber}/`;

            github.rest.issues.createComment({
              issue_number: prNumber,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `**Preview deployment started!**\n\nOnce built, view your changes at: ${previewUrl}`
            });
```

#### Option C: Polling (No Webhook Required)

If you can't configure webhooks, enable polling to automatically detect PRs:

```yaml
Environment Variables:
  PR_PREVIEW_ENABLED: "true"
  POLLING_INTERVAL: "300"          # Check every 5 minutes
  GIT_TOKEN: "ghp_xxx"             # Required for GitHub API access
```

With polling enabled, Flux-Orbit will automatically:
- Detect new PRs and build previews
- Detect PR updates (new commits) and rebuild previews
- Detect closed PRs and delete previews

:::info GitHub Only
PR polling currently only works with GitHub repositories.
:::

### 3. Add Secrets to GitHub (for GitHub Actions)

In your GitHub repository:
1. Go to Settings → Secrets and variables → Actions
2. Add secrets:
   - `FLUX_WEBHOOK_URL`: `https://your-app_9001.app.runonflux.io`
   - `FLUX_API_KEY`: Your API key (same as `API_KEY` env var)

## Usage

### Accessing Previews

Each PR preview is accessible at:
```
https://your-app_3000.app.runonflux.io/flux-pr-<number>/
```

Example: PR #42 → `https://your-app_3000.app.runonflux.io/flux-pr-42/`

### Listing Active Previews

Get all active previews:

```bash
curl -H "X-API-Key: YOUR_KEY" https://your-app_9001.app.runonflux.io/previews
```

Response:
```json
{
  "enabled": true,
  "previews": [
    {
      "pr_number": 123,
      "commit": "abc123def",
      "branch": "feature/new-ui",
      "status": "ready",
      "updated_at": "2025-01-15T10:30:00Z"
    },
    {
      "pr_number": 124,
      "commit": "def456abc",
      "status": "building",
      "updated_at": "2025-01-15T10:35:00Z"
    }
  ],
  "count": 2
}
```

### Getting Preview Details

Get metadata for a specific preview:

```bash
curl -H "X-API-Key: YOUR_KEY" https://your-app_9001.app.runonflux.io/previews/123
```

Response:
```json
{
  "pr_number": 123,
  "commit": "abc123def",
  "branch": "feature/new-ui",
  "title": "Add new UI",
  "author": "username",
  "status": "ready",
  "created_at": "2025-01-15T10:00:00Z",
  "updated_at": "2025-01-15T10:30:00Z",
  "build_duration": 120
}
```

### Deleting Previews

#### Automatic Cleanup
Previews are automatically deleted when:
- Age exceeds `PR_PREVIEW_MAX_AGE` seconds
- Total preview count exceeds `PR_PREVIEW_MAX_COUNT`
- PR is closed (via webhook or polling)

#### Manual Deletion
Delete a specific preview:

```bash
curl -X DELETE -H "X-API-Key: YOUR_KEY" https://your-app_9001.app.runonflux.io/previews/123
```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PR_PREVIEW_ENABLED` | `false` | Enable PR preview feature |
| `PR_PREVIEW_MAX_AGE` | `86400` | Max age in seconds (24 hours) |
| `PR_PREVIEW_MAX_COUNT` | `10` | Maximum concurrent previews |
| `PR_PREVIEW_CLEANUP_INTERVAL` | `3600` | Cleanup check interval (1 hour) |

### Build Configuration

PR previews use the same build configuration as your main deployment:

- **Build command**: From `BUILD_COMMAND` env var or auto-detected
- **Package manager**: Auto-detected (npm, yarn, pnpm)
- **Node version**: From `.nvmrc` or `package.json` engines

During PR preview builds, Flux-Orbit automatically sets the `BASE_URL` environment variable to `/flux-pr-{number}/`. You can use this in your build configuration.

```json
{
  "scripts": {
    "build": "vite build --base=${BASE_URL:-/}"
  }
}
```

## Best Practices

### 1. Base URL Configuration

Flux-Orbit automatically sets `BASE_URL` during PR preview builds (e.g., `/flux-pr-42/`). Configure your framework to use it:

#### Vite (React, Vue, Svelte)

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_URL || '/'
})
```

**Vue (Vue CLI):**
```js
// vue.config.js
module.exports = {
  publicPath: process.env.BASE_URL || '/'
}
```

#### Create React App

```json
// package.json
{
  "homepage": "."
}
```

Or use the `PUBLIC_URL` environment variable (CRA reads this automatically):
```bash
# In your build script
PUBLIC_URL=${BASE_URL:-/} npm run build
```

#### Next.js (Static Export)

```js
// next.config.js
module.exports = {
  output: 'export',
  basePath: process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : '',
  assetPrefix: process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : '',
  images: {
    unoptimized: true // Required for static export
  }
}
```

**Nuxt (Static Generation):**
```js
// nuxt.config.js
export default {
  target: 'static',
  router: {
    base: process.env.BASE_URL || '/'
  }
}
```

#### Nuxt (Static Generation)

```js
// nuxt.config.js
export default {
  app: {
    baseURL: process.env.BASE_URL || '/'
  }
}
```

#### Docusaurus

```js
// docusaurus.config.js
module.exports = {
  baseUrl: process.env.BASE_URL || '/',
  trailingSlash: false
}
```

#### VitePress

```js
// .vitepress/config.js
export default {
  base: process.env.BASE_URL || '/'
}
```

#### Gatsby

```js
// gatsby-config.js
module.exports = {
  pathPrefix: process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : '',
  flags: {
    DEV_SSR: true
  }
}
```

Build with path prefix:
```bash
gatsby build --prefix-paths
```

#### SvelteKit (adapter-static)

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter(),
    paths: {
      base: process.env.BASE_URL ? process.env.BASE_URL.replace(/\/$/, '') : ''
    }
  }
}
```

#### Angular

```json
// angular.json (in architect.build.options)
{
  "baseHref": "/"
}
```

Or build with base href:
```bash
ng build --base-href ${BASE_URL:-/}
```

#### Hugo

```toml
# config.toml
baseURL = "/"
```

Or build with base URL:
```bash
hugo --baseURL ${BASE_URL:-/}
```

#### Jekyll

```yaml
# _config.yml
baseurl: ""
```

Or build with base URL:
```bash
jekyll build --baseurl ${BASE_URL:-/}
```

:::tip Fallback Injection
If your app doesn't configure `BASE_URL`, Flux-Orbit automatically injects a `<base>` tag into HTML files as a fallback. This works for most static sites, but configuring `BASE_URL` in your build is recommended for best results.
:::

### 2. Resource Limits

- Keep `PR_PREVIEW_MAX_COUNT` reasonable (5-15 previews)
- Set `PR_PREVIEW_MAX_AGE` to clean up stale previews (24-72 hours)
- Builds run sequentially - limit concurrent PR creation

### 3. Security

- Preview builds use the same Node.js environment as production
- Environment variables are shared with main deployment
- No additional authentication on preview URLs

### 4. GitHub Integration

- Comment preview URLs automatically on PRs
- Delete previews when PRs are closed
- Link to build logs for debugging

## Troubleshooting

### Preview Build Failed

1. Check build logs:
   ```bash
   curl -H "X-API-Key: YOUR_KEY" https://your-app_9001.app.runonflux.io/previews/123
   ```

2. Common issues:
   - Missing dependencies in `package.json`
   - Build command fails
   - Incorrect base URL configuration
   - Build output directory not found

### Preview Not Accessible

1. Verify the preview was built successfully (status: "ready")
2. Check if the preview still exists (not cleaned up)
3. Ensure correct base URL in your app configuration
4. Check that your app serves static files correctly

### Build Takes Too Long

- Default timeout: 30 minutes (configurable via `BUILD_TIMEOUT`)
- Optimize dependencies (use lockfiles)
- Consider reducing build complexity for previews
- Check for network issues during `npm install`

### Preview Path Issues

If assets don't load correctly:
1. Ensure your app uses relative paths or configured base URL
2. Check browser console for 404 errors
3. Verify build output includes all necessary files
4. Test locally with same base path

### Polling Not Detecting PRs

1. Verify `GIT_TOKEN` is set and has repo read access
2. Check webhook logs for API errors
3. Ensure `POLLING_INTERVAL` is > 0
4. Confirm the repo URL is a GitHub repository

## API Reference

### GET /previews

List all active previews.

**Headers:**
- `X-API-Key: YOUR_KEY` (required if API_KEY is configured)

**Response:**
```json
{
  "enabled": true,
  "previews": [
    {
      "pr_number": 123,
      "commit": "abc123",
      "status": "ready",
      "updated_at": "2025-01-15T10:30:00Z"
    }
  ],
  "count": 1
}
```

### GET /previews/:number

Get metadata for a specific preview.

**Headers:**
- `X-API-Key: YOUR_KEY` (required if API_KEY is configured)

**Response:**
```json
{
  "pr_number": 123,
  "commit": "abc123def",
  "branch": "feature/new-ui",
  "title": "Add new UI",
  "author": "username",
  "status": "ready",
  "created_at": "2025-01-15T10:00:00Z",
  "updated_at": "2025-01-15T10:30:00Z",
  "build_duration": 120
}
```

### DELETE /previews/:number

Delete a preview.

**Headers:**
- `X-API-Key: YOUR_KEY` (required)

**Response:**
```json
{
  "status": "deleted",
  "pr_number": 123,
  "message": "Preview deleted successfully"
}
```

### POST /webhook (PR Events)

The webhook endpoint automatically handles GitHub PR events when the `X-GitHub-Event: pull_request` header is present.

**Supported Actions:**
- `opened` / `reopened` - Build new preview
- `synchronize` - Rebuild preview with new commit
- `closed` - Delete preview

## Examples

### Complete GitHub Actions Workflow

```yaml
name: PR Preview with Notifications

on:
  pull_request:
    types: [opened, synchronize, reopened, closed]

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - name: Build Preview
        if: github.event.action != 'closed'
        id: preview
        run: |
          curl -s -X POST ${{ secrets.FLUX_WEBHOOK_URL }}/webhook \
            -H "Content-Type: application/json" \
            -H "X-GitHub-Event: pull_request" \
            -H "X-API-Key: ${{ secrets.FLUX_API_KEY }}" \
            -d '{
              "action": "${{ github.event.action }}",
              "pull_request": {
                "number": ${{ github.event.pull_request.number }},
                "head": {
                  "sha": "${{ github.event.pull_request.head.sha }}",
                  "ref": "${{ github.event.pull_request.head.ref }}"
                },
                "base": {
                  "ref": "${{ github.event.pull_request.base.ref }}"
                },
                "title": "${{ github.event.pull_request.title }}",
                "user": {
                  "login": "${{ github.event.pull_request.user.login }}"
                }
              }
            }'

      - name: Wait for Build
        if: github.event.action != 'closed'
        run: |
          for i in {1..60}; do
            RESPONSE=$(curl -s -H "X-API-Key: ${{ secrets.FLUX_API_KEY }}" \
              ${{ secrets.FLUX_WEBHOOK_URL }}/previews/${{ github.event.pull_request.number }})
            STATUS=$(echo "$RESPONSE" | jq -r '.status')
            if [ "$STATUS" = "ready" ]; then
              echo "Build complete!"
              exit 0
            elif [ "$STATUS" = "failed" ]; then
              echo "Build failed!"
              exit 1
            fi
            echo "Waiting for build... ($i/60)"
            sleep 10
          done
          echo "Build timeout"
          exit 1

      - name: Comment Success
        if: github.event.action != 'closed' && success()
        uses: actions/github-script@v7
        with:
          script: |
            const prNumber = context.payload.pull_request.number;
            const previewUrl = `https://your-app_3000.app.runonflux.io/flux-pr-${prNumber}/`;

            github.rest.issues.createComment({
              issue_number: prNumber,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `**Preview deployment successful!**\n\nPreview: ${previewUrl}`
            });

      - name: Comment Failure
        if: github.event.action != 'closed' && failure()
        uses: actions/github-script@v7
        with:
          script: |
            const prNumber = context.payload.pull_request.number;

            github.rest.issues.createComment({
              issue_number: prNumber,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `**Preview deployment failed!**\n\nCheck the workflow logs for details.`
            });

      - name: Cleanup on Close
        if: github.event.action == 'closed'
        run: |
          curl -X POST ${{ secrets.FLUX_WEBHOOK_URL }}/webhook \
            -H "Content-Type: application/json" \
            -H "X-GitHub-Event: pull_request" \
            -H "X-API-Key: ${{ secrets.FLUX_API_KEY }}" \
            -d '{
              "action": "closed",
              "pull_request": {
                "number": ${{ github.event.pull_request.number }},
                "head": {
                  "sha": "${{ github.event.pull_request.head.sha }}",
                  "ref": "${{ github.event.pull_request.head.ref }}"
                },
                "base": {
                  "ref": "${{ github.event.pull_request.base.ref }}"
                }
              }
            }'
```

## Limitations

- Static sites only - no support for dynamic applications
- Previews share the same domain (subpath routing)
- No custom domain support for previews
- Build runs sequentially (no parallel builds)
- Limited to projects with standard build output directories
- All previews use the same Node.js version as main deployment
- PR polling only works with GitHub repositories

## See Also

- [CI/CD Setup](../ci-cd/github-webhooks)
- [Deployment Hooks](../hooks/deployment-hooks)
- [Environment Variables](../configuration/environment-reference)
