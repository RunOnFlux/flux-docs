---
sidebar_position: 6
title: Deploying Rust Applications
description: Complete guide for deploying Rust applications with Flux-Orbit
---

# Deploying Rust Applications

This comprehensive guide covers everything you need to know about deploying Rust applications with Flux-Orbit, from simple HTTP servers to complex microservices using Actix-web, Rocket, or Axum.

## Overview

Flux-Orbit automatically detects Rust applications by looking for:
- `Cargo.toml` file
- `Cargo.lock` for dependency locking (optional)
- `rust-toolchain.toml` or `rust-toolchain` for version specification (optional)

## Basic Rust Deployment

### Simple Actix-web API

```bash
docker run -d \
  --name actix-api \
  -e GIT_REPO_URL=https://github.com/your-username/actix-api \
  -e APP_PORT=3000 \
  -p 3000:3000 \
  runonflux/orbit:latest
```

### What Happens Automatically

1. **Detection**: Finds `Cargo.toml` and identifies as Rust project
2. **Version Selection**:
   - Checks `RUST_VERSION` environment variable
   - Checks `rust-toolchain.toml` channel field
   - Checks `rust-toolchain` file
   - Falls back to `stable` channel
3. **Runtime Installation**:
   - Installs Rust using official rustup installer
   - Sets RUSTUP_HOME to `/opt/flux-tools/rustup`
   - Sets CARGO_HOME to `/opt/flux-tools/cargo`
   - Adds cargo bin directory to PATH
4. **Dependencies**: Runs `cargo fetch` to download and verify dependencies
5. **Build**: Compiles optimized release binary with `cargo build --release`
6. **Start**: Executes compiled binary from `target/release/`

## Framework-Specific Guides

### Actix-web Framework

Actix-web is a powerful, pragmatic, and extremely fast web framework for Rust:

```bash
docker run -d \
  --name actix-rest-api \
  -e GIT_REPO_URL=https://github.com/your-username/actix-api \
  -e APP_PORT=3000 \
  -e RUST_VERSION=stable \
  -p 3000:3000 \
  runonflux/orbit:latest
```

**Example `main.rs`:**
```rust
use actix_web::{get, web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Serialize, Deserialize)]
struct HealthCheck {
    status: String,
}

#[get("/health")]
async fn health() -> impl Responder {
    HttpResponse::Ok().json(HealthCheck {
        status: "healthy".to_string(),
    })
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let port = env::var("APP_PORT")
        .unwrap_or_else(|_| "3000".to_string())
        .parse::<u16>()
        .expect("APP_PORT must be a valid port number");

    HttpServer::new(|| {
        App::new()
            .service(health)
    })
    .bind(("0.0.0.0", port))?
    .run()
    .await
}
```

**Example `Cargo.toml`:**
```toml
[package]
name = "actix-api"
version = "1.0.0"
edition = "2021"

[dependencies]
actix-web = "4"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
```

### Rocket Framework

Rocket is a web framework for Rust with focus on ease-of-use, expressiveness, and speed:

```bash
docker run -d \
  --name rocket-api \
  -e GIT_REPO_URL=https://github.com/your-username/rocket-api \
  -e APP_PORT=3000 \
  -p 3000:3000 \
  runonflux/orbit:latest
```

**Example `main.rs`:**
```rust
#[macro_use] extern crate rocket;

use rocket::{State, Config};
use rocket::serde::{Serialize, json::Json};
use std::env;

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
struct HealthCheck {
    status: String,
}

#[get("/health")]
fn health() -> Json<HealthCheck> {
    Json(HealthCheck {
        status: "healthy".to_string(),
    })
}

#[launch]
fn rocket() -> _ {
    let port = env::var("APP_PORT")
        .unwrap_or_else(|_| "3000".to_string())
        .parse::<u16>()
        .expect("APP_PORT must be a valid port number");

    let config = Config {
        port,
        address: "0.0.0.0".parse().unwrap(),
        ..Config::default()
    };

    rocket::custom(&config)
        .mount("/", routes![health])
}
```

### Axum Framework

Axum is an ergonomic and modular web framework built with Tokio, Tower, and Hyper:

```bash
docker run -d \
  --name axum-api \
  -e GIT_REPO_URL=https://github.com/your-username/axum-api \
  -e APP_PORT=3000 \
  -p 3000:3000 \
  runonflux/orbit:latest
```

### Warp Framework

Warp is a super-easy, composable, web server framework for warp speeds:

```bash
docker run -d \
  --name warp-api \
  -e GIT_REPO_URL=https://github.com/your-username/warp-api \
  -e APP_PORT=3000 \
  -p 3000:3000 \
  runonflux/orbit:latest
```

## Version Management

### Specify Rust Version

**Option 1: Environment Variable**
```bash
docker run -d \
  -e GIT_REPO_URL=https://github.com/your-username/rust-app \
  -e APP_PORT=3000 \
  -e RUST_VERSION=stable \
  -p 3000:3000 \
  runonflux/orbit:latest
```

Supported values:
- `stable` - Latest stable release
- `nightly` - Nightly builds
- `beta` - Beta channel
- `1.75.0` - Specific version number

**Option 2: rust-toolchain.toml File**
```toml
[toolchain]
channel = "stable"
components = ["rustfmt", "clippy"]
```

**Option 3: rust-toolchain File**
```
stable
```

## Build Optimization

### Release Mode

By default, Flux-Orbit builds Rust applications in release mode for optimal performance:

```bash
# Default: Optimized release build
docker run -d \
  -e GIT_REPO_URL=https://github.com/your-username/rust-app \
  -e APP_PORT=3000 \
  -p 3000:3000 \
  runonflux/orbit:latest
```

This runs `cargo build --release`, which:
- Optimizes for speed
- Removes debug symbols
- Takes longer to build but runs faster
- Creates binary in `target/release/` directory

### Custom Build Command

Override the default build command if needed:

```bash
docker run -d \
  -e GIT_REPO_URL=https://github.com/your-username/rust-app \
  -e APP_PORT=3000 \
  -e BUILD_COMMAND="cargo build --release --features production" \
  -p 3000:3000 \
  runonflux/orbit:latest
```

## Environment Variables

### Rust-Specific Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `RUST_VERSION` | Rust channel or version | `stable` |
| `RUSTFLAGS` | Additional compiler flags | - |
| `CARGO_BUILD_JOBS` | Parallel build jobs | Auto-detected |

### Common Application Variables

```bash
docker run -d \
  --name rust-api \
  -e GIT_REPO_URL=https://github.com/your-username/rust-api \
  -e APP_PORT=3000 \
  -e RUST_VERSION=stable \
  -e DATABASE_URL=postgres://user:pass@db:5432/mydb \
  -e JWT_SECRET=your-secret-key \
  -e RUST_LOG=info \
  -p 3000:3000 \
  runonflux/orbit:latest
```

## Advanced Scenarios

### Monorepo - Deploy Specific Service

```bash
docker run -d \
  --name rust-auth-service \
  -e GIT_REPO_URL=https://github.com/your-username/monorepo \
  -e PROJECT_PATH=services/auth \
  -e APP_PORT=3000 \
  -p 3000:3000 \
  runonflux/orbit:latest
```

### Private Repository

```bash
docker run -d \
  --name private-rust-api \
  -e GIT_REPO_URL=https://github.com/your-username/private-api \
  -e GIT_TOKEN=ghp_your_personal_access_token \
  -e APP_PORT=3000 \
  -p 3000:3000 \
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
  --name rust-api-with-hooks \
  -e GIT_REPO_URL=https://github.com/your-username/rust-api \
  -e APP_PORT=3000 \
  -p 3000:3000 \
  runonflux/orbit:latest
```

## CI/CD Integration

### Automatic Deployment with Webhooks

```bash
docker run -d \
  --name rust-api \
  -e GIT_REPO_URL=https://github.com/your-username/rust-api \
  -e APP_PORT=3000 \
  -e WEBHOOK_SECRET=my-secret-phrase \
  -p 3000:3000 \
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
  --name rust-api \
  -e GIT_REPO_URL=https://github.com/your-username/rust-api \
  -e APP_PORT=3000 \
  -e POLLING_INTERVAL=300 \
  -p 3000:3000 \
  runonflux/orbit:latest
```

## Troubleshooting

### Binary Not Found After Build

**Problem:** "Binary 'my-app' was not created"

**Solution:** Ensure your `Cargo.toml` has a valid package name:

```toml
[package]
name = "my-app"  # Binary will be named "my-app"
version = "1.0.0"
edition = "2021"
```

The binary name is derived from the package name in Cargo.toml.

### Build Takes Too Long

**Problem:** Rust build timeout

**Solution:** Rust builds can be slow, especially first builds. Increase build timeout:

```bash
-e BUILD_TIMEOUT=3600  # 60 minutes for large projects
```

**Performance tips:**
- Release builds are slower but produce faster binaries
- First build downloads and compiles all dependencies
- Subsequent builds are much faster (cached dependencies)
- Consider using fewer dependencies for faster builds

### Port Binding Issues

**Problem:** Application not accessible

**Solution:** Ensure your Rust application binds to `0.0.0.0` (not `localhost` or `127.0.0.1`):

```rust
// Good: Accessible from outside container
HttpServer::new(|| App::new())
    .bind(("0.0.0.0", port))?
    .run()
    .await

// Bad: Only accessible from inside container
HttpServer::new(|| App::new())
    .bind(("127.0.0.1", port))?
    .run()
    .await
```

### Dependency Compilation Errors

**Problem:** Cargo build fails with dependency errors

**Solution:** Check Rust version compatibility. Some crates require specific Rust versions:

```bash
# Try with latest stable
-e RUST_VERSION=stable

# Or specific version if crate requires it
-e RUST_VERSION=1.75.0
```

## Performance Tips

1. **Release Mode**: Always use release builds in production (automatic with Flux-Orbit)
2. **Static Linking**: Rust produces static binaries by default - no runtime dependencies needed
3. **Binary Size**: Use `strip = true` in Cargo.toml to reduce binary size:
   ```toml
   [profile.release]
   strip = true
   opt-level = 3
   lto = true
   ```
4. **Dependency Caching**: Dependencies are cached based on Cargo.lock hash - no recompilation if unchanged
5. **Health Checks**: Implement `/health` endpoint for faster deployment verification
6. **Async Runtime**: Use Tokio for async operations - excellent performance characteristics

## Example Repository Structure

```
my-rust-api/
├── Cargo.toml             # Package manifest
├── Cargo.lock             # Dependency lock file
├── rust-toolchain.toml    # Optional: Pin Rust version
├── pre-deploy.sh          # Optional: Pre-deployment hook
├── post-deploy.sh         # Optional: Post-deployment hook
├── src/
│   ├── main.rs           # Application entry point
│   ├── routes/
│   │   ├── mod.rs
│   │   ├── users.rs
│   │   └── auth.rs
│   ├── models/
│   │   ├── mod.rs
│   │   └── user.rs
│   └── middleware/
│       ├── mod.rs
│       └── auth.rs
└── tests/
    └── integration_test.rs
```

## Why Rust?

Rust delivers exceptional performance with memory safety:

- **Blazingly Fast**: Performance comparable to C/C++
- **Memory Safe**: No null pointers, no data races
- **Zero-Cost Abstractions**: High-level features with no runtime overhead
- **Concurrent**: Fearless concurrency with ownership system
- **Reliable**: Catch bugs at compile time, not runtime

Perfect for:
- High-performance APIs
- Microservices
- Real-time systems
- WebSocket servers
- Data processing pipelines

## Next Steps

- [Environment Variables Reference](../configuration/environment-reference)
- [Deployment Hooks Guide](../hooks/deployment-hooks)
- [CI/CD Setup](../ci-cd/github-webhooks)
- [Troubleshooting](../troubleshooting/common-issues)
