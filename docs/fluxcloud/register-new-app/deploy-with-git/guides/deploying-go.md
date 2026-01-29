---
sidebar_position: 4
title: Deploying Go Applications
description: Complete guide for deploying Go applications via Deploy with Git
---

# Deploying Go Applications

This comprehensive guide covers everything you need to know about deploying Go applications via Deploy with Git, from simple HTTP servers to complex microservices using Gin, Echo, or Fiber.

## Overview

Deploy with Git automatically detects Go applications by looking for:
- `go.mod` file
- `go.sum` for dependency verification
- `.go-version` for version specification (optional)

## Basic Go Deployment

### Simple Gin API

```bash
docker run -d \
  --name gin-api \
  -e GIT_REPO_URL=https://github.com/your-username/gin-api \
  -e APP_PORT=8080 \
  -p 8080:8080 \
  runonflux/orbit:latest
```

### What Happens Automatically

1. **Detection**: Finds `go.mod` and identifies as Go project
2. **Version Selection**:
   - Checks `GO_VERSION` environment variable
   - Checks `.go-version` file
   - Checks `go` directive in go.mod (e.g., `go 1.22`)
   - Falls back to Go 1.22.0
3. **Runtime Installation**:
   - Downloads official Go binary from golang.org
   - Extracts to `/opt/flux-tools/go`
   - Sets GOROOT and GOPATH environment variables
4. **Dependencies**: Runs `go mod download` and `go mod verify`
5. **Build**: Compiles optimized static binary with `-ldflags=-w -s`
6. **Start**: Executes compiled binary

## Framework-Specific Guides

### Gin Framework

Gin is a high-performance HTTP web framework for Go. Deploy with Git automatically detects and optimizes Gin applications:

```bash
docker run -d \
  --name gin-rest-api \
  -e GIT_REPO_URL=https://github.com/your-username/gin-api \
  -e APP_PORT=8080 \
  -e GO_VERSION=1.22.0 \
  -p 8080:8080 \
  runonflux/orbit:latest
```

**Example `main.go`:**
```go
package main

import (
    "os"
    "github.com/gin-gonic/gin"
)

func main() {
    router := gin.Default()
    router.GET("/health", func(c *gin.Context) {
        c.JSON(200, gin.H{"status": "healthy"})
    })

    port := os.Getenv("APP_PORT")
    if port == "" {
        port = "8080"
    }
    router.Run("0.0.0.0:" + port)
}
```

### Echo Framework

Echo is a high-performance, minimalist Go web framework:

```bash
docker run -d \
  --name echo-api \
  -e GIT_REPO_URL=https://github.com/your-username/echo-api \
  -e APP_PORT=8080 \
  -p 8080:8080 \
  runonflux/orbit:latest
```

**Example `main.go`:**
```go
package main

import (
    "fmt"
    "os"
    "github.com/labstack/echo/v4"
    "github.com/labstack/echo/v4/middleware"
)

func main() {
    e := echo.New()
    e.Use(middleware.Logger())
    e.Use(middleware.Recover())

    e.GET("/health", func(c echo.Context) error {
        return c.JSON(200, map[string]string{"status": "healthy"})
    })

    port := os.Getenv("APP_PORT")
    if port == "" {
        port = "8080"
    }
    e.Start(fmt.Sprintf("0.0.0.0:%s", port))
}
```

### Fiber Framework

Fiber is an Express-inspired web framework for Go:

```bash
docker run -d \
  --name fiber-api \
  -e GIT_REPO_URL=https://github.com/your-username/fiber-api \
  -e APP_PORT=3000 \
  -p 3000:3000 \
  runonflux/orbit:latest
```

### Standard Library (net/http)

For applications using only Go's standard library:

```bash
docker run -d \
  --name stdlib-server \
  -e GIT_REPO_URL=https://github.com/your-username/http-server \
  -e APP_PORT=8080 \
  -p 8080:8080 \
  runonflux/orbit:latest
```

## Version Management

### Specify Go Version

**Option 1: Environment Variable**
```bash
docker run -d \
  -e GIT_REPO_URL=https://github.com/your-username/go-app \
  -e APP_PORT=8080 \
  -e GO_VERSION=1.21.5 \
  -p 8080:8080 \
  runonflux/orbit:latest
```

**Option 2: .go-version File**
```
1.22.0
```

**Option 3: go.mod Directive**
```go
module github.com/your-username/app

go 1.22

require (
    github.com/gin-gonic/gin v1.9.1
)
```

## Build Optimization

### CGO Configuration

By default, Deploy with Git builds static binaries with `CGO_ENABLED=0` for maximum portability:

```bash
# Default: Static binary (CGO disabled)
docker run -d \
  -e GIT_REPO_URL=https://github.com/your-username/go-app \
  -e APP_PORT=8080 \
  -p 8080:8080 \
  runonflux/orbit:latest
```

**Enable CGO if needed:**
```bash
docker run -d \
  -e GIT_REPO_URL=https://github.com/your-username/go-app \
  -e APP_PORT=8080 \
  -e CGO_ENABLED=1 \
  -p 8080:8080 \
  runonflux/orbit:latest
```

### Custom Build Command

Override the default build command if needed:

```bash
docker run -d \
  -e GIT_REPO_URL=https://github.com/your-username/go-app \
  -e APP_PORT=8080 \
  -e BUILD_COMMAND="go build -tags production -o myapp ." \
  -p 8080:8080 \
  runonflux/orbit:latest
```

## Environment Variables

### Go-Specific Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GO_VERSION` | Go version to install | Auto-detected from go.mod |
| `CGO_ENABLED` | Enable/disable CGO | `0` (disabled) |
| `GOOS` | Target operating system | `linux` |
| `GOARCH` | Target architecture | `amd64` |

### Common Application Variables

```bash
docker run -d \
  --name go-api \
  -e GIT_REPO_URL=https://github.com/your-username/go-api \
  -e APP_PORT=8080 \
  -e GO_VERSION=1.22.0 \
  -e CGO_ENABLED=0 \
  -e DATABASE_URL=postgres://user:pass@db:5432/mydb \
  -e JWT_SECRET=your-secret-key \
  -e LOG_LEVEL=info \
  -p 8080:8080 \
  runonflux/orbit:latest
```

## Advanced Scenarios

### Monorepo - Deploy Specific Service

```bash
docker run -d \
  --name go-auth-service \
  -e GIT_REPO_URL=https://github.com/your-username/monorepo \
  -e PROJECT_PATH=services/auth \
  -e APP_PORT=8080 \
  -p 8080:8080 \
  runonflux/orbit:latest
```

### Private Repository

```bash
docker run -d \
  --name private-go-api \
  -e GIT_REPO_URL=https://github.com/your-username/private-api \
  -e GIT_TOKEN=ghp_your_personal_access_token \
  -e APP_PORT=8080 \
  -p 8080:8080 \
  runonflux/orbit:latest
```

### With Deployment Hooks

Create `pre-deploy.sh` in your repository root:

```bash
#!/bin/bash
# Run database migrations before deployment
echo "Running database migrations..."
# Your migration logic here
```

Create `post-deploy.sh`:

```bash
#!/bin/bash
# Warm up cache after deployment
echo "Warming up cache..."
curl http://localhost:$APP_PORT/api/warmup
```

```bash
docker run -d \
  --name go-api-with-hooks \
  -e GIT_REPO_URL=https://github.com/your-username/go-api \
  -e APP_PORT=8080 \
  -p 8080:8080 \
  runonflux/orbit:latest
```

## CI/CD Integration

### Automatic Deployment with Webhooks

```bash
docker run -d \
  --name go-api \
  -e GIT_REPO_URL=https://github.com/your-username/go-api \
  -e APP_PORT=8080 \
  -e WEBHOOK_SECRET=my-secret-phrase \
  -p 8080:8080 \
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
  --name go-api \
  -e GIT_REPO_URL=https://github.com/your-username/go-api \
  -e APP_PORT=8080 \
  -e POLLING_INTERVAL=300 \
  -p 8080:8080 \
  runonflux/orbit:latest
```

## Troubleshooting

### Binary Not Found After Build

**Problem:** "No Go binary found in /app/src"

**Solution:** Ensure your `go.mod` has a valid module name. The binary name is derived from the module:

```go
module github.com/your-username/my-api  // Binary will be named "my-api"

go 1.22

require (
    github.com/gin-gonic/gin v1.9.1
)
```

### CGO Dependencies

**Problem:** Build fails with CGO-related errors

**Solution:** Enable CGO if your application requires it:

```bash
-e CGO_ENABLED=1
```

### Port Binding Issues

**Problem:** Application not accessible

**Solution:** Ensure your Go application binds to `0.0.0.0` (not `localhost` or `127.0.0.1`):

```go
// Good: Accessible from outside container
router.Run("0.0.0.0:" + port)

// Bad: Only accessible from inside container
router.Run("localhost:" + port)
```

### Build Takes Too Long

**Problem:** Go build timeout

**Solution:** Increase build timeout:

```bash
-e BUILD_TIMEOUT=2400  # 40 minutes
```

## Performance Tips

1. **Use Static Binaries**: Keep `CGO_ENABLED=0` for faster deploys and smaller images
2. **Optimize Dependencies**: Remove unused dependencies from go.mod
3. **Binary Size**: The build uses `-ldflags=-w -s` to strip debug info (typically 20-30% size reduction)
4. **Dependency Caching**: Dependencies are cached based on go.sum hash - no reinstall if unchanged
5. **Health Checks**: Implement `/health` endpoint for faster deployment verification

## Example Repository Structure

```
my-go-api/
├── go.mod                 # Module definition
├── go.sum                 # Dependency checksums
├── .go-version           # Optional: Pin Go version
├── main.go               # Application entry point
├── pre-deploy.sh         # Optional: Pre-deployment hook
├── post-deploy.sh        # Optional: Post-deployment hook
├── handlers/
│   ├── users.go
│   └── auth.go
├── models/
│   └── user.go
└── middleware/
    └── auth.go
```

## Next Steps

- [Environment Variables Reference](../configuration/environment-reference)
- [Deployment Hooks Guide](../hooks/deployment-hooks)
- [CI/CD Setup](../ci-cd/github-webhooks)
- [Troubleshooting](../troubleshooting/common-issues)
