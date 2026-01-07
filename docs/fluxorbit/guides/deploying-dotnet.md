---
sidebar_position: 7
title: Deploying .NET Core Applications
description: Complete guide for deploying .NET Core applications with Flux-Orbit
---

# Deploying .NET Core Applications

This comprehensive guide covers everything you need to know about deploying .NET Core applications with Flux-Orbit, from lightweight Web APIs to full ASP.NET Core applications with Blazor.

## Overview

Flux-Orbit automatically detects .NET Core applications by looking for:
- `.csproj` (C# project file)
- `.fsproj` (F# project file)
- `.vbproj` (VB.NET project file)
- `.sln` (Solution file)
- Framework detection via SDK references in project files

## Basic .NET Deployment

### Simple Web API

```bash
docker run -d \
  --name dotnet-api \
  -e GIT_REPO_URL=https://github.com/your-username/dotnet-api \
  -e APP_PORT=5000 \
  -p 5000:5000 \
  runonflux/orbit:latest
```

### What Happens Automatically

1. **Detection**: Finds `.csproj` or `.sln` and identifies as .NET Core project
2. **Version Selection**:
   - Checks `DOTNET_VERSION` environment variable
   - Checks `global.json` for SDK version
   - Checks `TargetFramework` in `.csproj` (net6.0, net7.0, net8.0, net9.0)
   - Falls back to .NET 8.0 LTS
3. **Runtime Installation** (First deployment only, ~30-70s):
   - Installs required libraries: ICU (globalization), Kerberos (enterprise auth)
   - Downloads and installs .NET SDK using Microsoft's official script
   - Installs to `/opt/flux-tools/dotnet`
   - Future deployments skip this step (~5-10s updates)
4. **Dependencies**: Runs `dotnet restore` (uses `--locked-mode` if `packages.lock.json` exists)
5. **Build**: Framework-specific (publish for web apps, build for console/worker)
6. **Start**: Executes appropriate command (dotnet run, dotnet ./publish/app.dll)

## Framework-Specific Guides

### ASP.NET Core Web API

ASP.NET Core is a cross-platform framework for building modern web APIs. Flux-Orbit automatically detects and optimizes ASP.NET Core applications:

```bash
docker run -d \
  --name aspnet-api \
  -e GIT_REPO_URL=https://github.com/your-username/aspnet-api \
  -e APP_PORT=5000 \
  -e DOTNET_VERSION=8.0 \
  -p 5000:5000 \
  runonflux/orbit:latest
```

**What Flux-Orbit Does Automatically:**

1. **Framework Detection**: Identifies ASP.NET Core via `Microsoft.AspNetCore` or `Microsoft.NET.Sdk.Web` references
2. **Production Build**: Runs `dotnet publish -c Release -o ./publish`
3. **URL Configuration**: Sets `ASPNETCORE_URLS=http://0.0.0.0:5000` for container access
4. **Environment Setup**: Configures `ASPNETCORE_ENVIRONMENT=Production`
5. **Server Start**: Uses `dotnet ./publish/YourApp.dll --urls "http://0.0.0.0:$APP_PORT"`

**Example `Program.cs` (Minimal API):**
```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapGet("/", () => new { message = "ASP.NET Core API", version = "1.0.0" });
app.MapGet("/health", () => Results.Ok(new { status = "healthy" }));

app.Run();
```

**Important Environment Variables:**

```bash
docker run -d \
  --name aspnet-api \
  -e GIT_REPO_URL=https://github.com/your-username/aspnet-api \
  -e APP_PORT=5000 \
  -e DOTNET_VERSION=8.0 \
  -e ASPNETCORE_ENVIRONMENT=Production \
  -e ConnectionStrings__DefaultConnection="Server=db;Database=mydb;User=sa;Password=YourPassword" \
  -p 5000:5000 \
  runonflux/orbit:latest
```

### Blazor Server

Blazor Server is a framework for building interactive web UIs using C# instead of JavaScript:

```bash
docker run -d \
  --name blazor-server \
  -e GIT_REPO_URL=https://github.com/your-username/blazor-server \
  -e APP_PORT=5000 \
  -p 5000:5000 \
  runonflux/orbit:latest
```

**What Flux-Orbit Does:**

1. **Detection**: Identifies Blazor Server via ASP.NET Core detection
2. **Production Build**: Runs `dotnet publish -c Release -o ./publish`
3. **Server Start**: Same as ASP.NET Core (published DLL)

### Blazor WebAssembly

Blazor WebAssembly runs .NET code in the browser using WebAssembly:

```bash
docker run -d \
  --name blazor-wasm \
  -e GIT_REPO_URL=https://github.com/your-username/blazor-wasm \
  -e APP_PORT=5000 \
  -p 5000:5000 \
  runonflux/orbit:latest
```

**What Flux-Orbit Does:**

1. **Detection**: Identifies Blazor WASM via `Microsoft.AspNetCore.Components.WebAssembly` reference
2. **Production Build**: Runs `dotnet publish -c Release -o ./publish`
3. **Static File Serving**: Serves `wwwroot` directory using Node.js static server
4. **Server Start**: Uses built-in static file server for `publish/wwwroot`

### Worker Service

Worker Services are background services for long-running tasks:

```bash
docker run -d \
  --name worker-service \
  -e GIT_REPO_URL=https://github.com/your-username/worker-service \
  -e APP_PORT=5000 \
  -p 5000:5000 \
  runonflux/orbit:latest
```

**Example `Program.cs`:**
```csharp
using Microsoft.Extensions.Hosting;

var builder = Host.CreateApplicationBuilder(args);
builder.Services.AddHostedService<Worker>();

var host = builder.Build();
host.Run();

public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;

    public Worker(ILogger<Worker> logger)
    {
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
            await Task.Delay(10000, stoppingToken);
        }
    }
}
```

**What Flux-Orbit Does:**

1. **Detection**: Identifies Worker Service via `Microsoft.Extensions.Hosting` reference
2. **Build**: Runs `dotnet build -c Release` (publish not needed for workers)
3. **Server Start**: Uses `dotnet run --no-build` or `dotnet ./publish/Worker.dll`

### gRPC Services

gRPC is a high-performance RPC framework:

```bash
docker run -d \
  --name grpc-service \
  -e GIT_REPO_URL=https://github.com/your-username/grpc-service \
  -e APP_PORT=5000 \
  -p 5000:5000 \
  runonflux/orbit:latest
```

**What Flux-Orbit Does:**

1. **Detection**: Identifies gRPC via `Grpc.AspNetCore` reference
2. **Production Build**: Runs `dotnet publish -c Release -o ./publish`
3. **Server Start**: Same as ASP.NET Core

### Console Applications

Simple console applications for CLI tools or scripts:

```bash
docker run -d \
  --name console-app \
  -e GIT_REPO_URL=https://github.com/your-username/console-app \
  -e APP_PORT=5000 \
  -p 5000:5000 \
  runonflux/orbit:latest
```

**What Flux-Orbit Does:**

1. **Detection**: Default if no framework-specific references found
2. **Build**: Runs `dotnet build -c Release`
3. **Server Start**: Uses `dotnet run --no-build` or published executable

## Version Management

### Specify .NET SDK Version

**Option 1: Environment Variable**
```bash
docker run -d \
  -e GIT_REPO_URL=https://github.com/your-username/dotnet-app \
  -e APP_PORT=5000 \
  -e DOTNET_VERSION=9.0 \
  -p 5000:5000 \
  runonflux/orbit:latest
```

**Option 2: global.json**
```json
{
  "sdk": {
    "version": "8.0.100"
  }
}
```

**Option 3: .csproj TargetFramework**
```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
  </PropertyGroup>
</Project>
```

**Supported Versions**: .NET 6.0, 7.0, 8.0 (LTS), 9.0

## Performance Optimization

### Memory Configuration

Flux-Orbit automatically configures .NET for production:

**Memory Limit**: Auto-configured to 75% of container memory
- Minimum: 512MB
- Maximum: 8GB
- Set via `DOTNET_GCHeapHardLimit` environment variable

**Container Settings** (automatically enabled):
```bash
DOTNET_RUNNING_IN_CONTAINER=true
DOTNET_EnableDiagnostics=0
DOTNET_TieredPGO=1
DOTNET_ReadyToRun=1
```

**Example for Large Applications:**
```bash
# On Flux Cloud, increase container RAM:
RAM: 4096 MB  # .NET will use ~3GB (75%)

Environment Variables:
  GIT_REPO_URL: https://github.com/your-username/large-dotnet-app
  APP_PORT: 5000
  DOTNET_VERSION: 8.0
```

### NuGet Package Caching

Dependencies are cached based on lock file hash:
- **First deployment**: Restores all packages (~20-40s)
- **Subsequent deployments**: Skips restore if `packages.lock.json` unchanged
- Force reinstall: Use `FORCE_INSTALL=true` environment variable

**Enable lock file in your project:**
```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <RestorePackagesWithLockFile>true</RestorePackagesWithLockFile>
  </PropertyGroup>
</Project>
```

Then run `dotnet restore` locally to generate `packages.lock.json`.

### Build Optimization

Production builds use Release configuration:
```bash
dotnet publish -c Release -o ./publish
```

This enables:
- Code optimization
- Trimming (if configured)
- ReadyToRun compilation
- AOT compilation (if configured in .NET 7+)

## Environment Variables

### .NET-Specific Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DOTNET_VERSION` | .NET SDK version (6.0-9.0) | Auto-detected from global.json or .csproj |
| `ASPNETCORE_ENVIRONMENT` | ASP.NET Core environment | `Production` |
| `ASPNETCORE_URLS` | URL bindings | `http://0.0.0.0:$APP_PORT` |

### Common Application Variables

```bash
docker run -d \
  --name dotnet-app \
  -e GIT_REPO_URL=https://github.com/your-username/dotnet-app \
  -e APP_PORT=5000 \
  -e DOTNET_VERSION=8.0 \
  -e ASPNETCORE_ENVIRONMENT=Production \
  -e ConnectionStrings__DefaultConnection="Server=db;Database=mydb" \
  -e Logging__LogLevel__Default=Information \
  -p 5000:5000 \
  runonflux/orbit:latest
```

**Environment Variable Mapping:**

.NET uses double underscore (`__`) for nested configuration:
```bash
# Environment variable
ConnectionStrings__DefaultConnection="Server=db;Database=mydb"

# Maps to appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=db;Database=mydb"
  }
}
```

## Advanced Scenarios

### Monorepo - Deploy Specific Service

```bash
docker run -d \
  --name dotnet-api-service \
  -e GIT_REPO_URL=https://github.com/your-username/monorepo \
  -e PROJECT_PATH=services/api \
  -e APP_PORT=5000 \
  -p 5000:5000 \
  runonflux/orbit:latest
```

### Private Repository

```bash
docker run -d \
  --name private-dotnet-app \
  -e GIT_REPO_URL=https://github.com/your-username/private-app \
  -e GIT_TOKEN=ghp_your_personal_access_token \
  -e APP_PORT=5000 \
  -p 5000:5000 \
  runonflux/orbit:latest
```

### Private NuGet Feed

For private NuGet packages, add `nuget.config` to your repository:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <add key="nuget.org" value="https://api.nuget.org/v3/index.json" />
    <add key="mycompany" value="https://pkgs.dev.azure.com/mycompany/_packaging/myfeed/nuget/v3/index.json" />
  </packageSources>
  <packageSourceCredentials>
    <mycompany>
      <add key="Username" value="az" />
      <add key="ClearTextPassword" value="%NUGET_AUTH_TOKEN%" />
    </mycompany>
  </packageSourceCredentials>
</configuration>
```

Then set the token as environment variable:
```bash
docker run -d \
  --name dotnet-app \
  -e GIT_REPO_URL=https://github.com/your-username/dotnet-app \
  -e APP_PORT=5000 \
  -e NUGET_AUTH_TOKEN=your-azure-devops-pat \
  -p 5000:5000 \
  runonflux/orbit:latest
```

### With Deployment Hooks

Create `pre-deploy.sh` in your repository root:

```bash
#!/bin/bash
# Run database migrations before deployment
echo "Running database migrations..."
dotnet ef database update --no-build
```

Create `post-deploy.sh`:

```bash
#!/bin/bash
# Warm up the application cache
echo "Warming up application cache..."
curl -s http://localhost:$APP_PORT/health > /dev/null
```

```bash
docker run -d \
  --name dotnet-with-hooks \
  -e GIT_REPO_URL=https://github.com/your-username/dotnet-app \
  -e APP_PORT=5000 \
  -e ConnectionStrings__DefaultConnection="Server=db;Database=mydb" \
  -p 5000:5000 \
  runonflux/orbit:latest
```

**Install EF Core tools for migrations:**

Add to your `.csproj`:
```xml
<ItemGroup>
  <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="8.0.0" />
</ItemGroup>
```

Or add to `.config/dotnet-tools.json`:
```json
{
  "version": 1,
  "isRoot": true,
  "tools": {
    "dotnet-ef": {
      "version": "8.0.0",
      "commands": ["dotnet-ef"]
    }
  }
}
```

Flux-Orbit automatically runs `dotnet tool restore` if this file exists.

## CI/CD Integration

### Automatic Deployment with Webhooks

```bash
docker run -d \
  --name dotnet-api \
  -e GIT_REPO_URL=https://github.com/your-username/dotnet-api \
  -e APP_PORT=5000 \
  -e WEBHOOK_SECRET=my-secret-phrase \
  -p 5000:5000 \
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
  --name dotnet-api \
  -e GIT_REPO_URL=https://github.com/your-username/dotnet-api \
  -e APP_PORT=5000 \
  -e POLLING_INTERVAL=300 \
  -p 5000:5000 \
  runonflux/orbit:latest
```

## Troubleshooting

### NuGet Restore Fails

**Problem:** "Unable to find package" or "Unable to resolve dependency"

**Solution:** Check .NET SDK version compatibility:

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="8.0.0" />
  </ItemGroup>
</Project>
```

Ensure `DOTNET_VERSION` env matches `TargetFramework`.

### Build Fails - SDK Not Found

**Problem:** "The current .NET SDK does not support targeting .NET 8.0"

**Solution:** Specify SDK version explicitly:

```bash
-e DOTNET_VERSION=8.0
```

Or add `global.json`:
```json
{
  "sdk": {
    "version": "8.0.100"
  }
}
```

### Application Not Accessible

**Problem:** Can't access the application on configured port

**Solution:** ASP.NET Core must bind to `0.0.0.0` (not `localhost`):

Flux-Orbit automatically sets `ASPNETCORE_URLS=http://0.0.0.0:$APP_PORT`.

If using custom Kestrel configuration:
```csharp
// Good: Accessible from outside container
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5000);
});

// Bad: Only accessible from inside container
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenLocalhost(5000);
});
```

### High Memory Usage

**Problem:** .NET process using too much memory

**Solution:** Memory is auto-configured, but you can adjust by increasing container RAM:

```yaml
# On Flux Cloud
RAM: 4096 MB  # .NET will use ~3GB (75%)
```

Or set custom limit:
```bash
-e DOTNET_GCHeapHardLimit=2147483648  # 2GB in bytes
```

### Slow NuGet Restore

**Problem:** `dotnet restore` takes too long

**Solution:**

1. Use dependency caching - enable `packages.lock.json`:
   ```xml
   <PropertyGroup>
     <RestorePackagesWithLockFile>true</RestorePackagesWithLockFile>
   </PropertyGroup>
   ```

2. Remove unnecessary package references
3. Use local NuGet cache (automatically configured at `/app/.nuget/packages`)

### Entity Framework Migrations Fail

**Problem:** "Unable to create an object of type 'ApplicationDbContext'"

**Solution:** Install EF Core tools and set connection string:

```bash
docker run -d \
  -e GIT_REPO_URL=https://github.com/your-username/dotnet-app \
  -e APP_PORT=5000 \
  -e ConnectionStrings__DefaultConnection="Server=db;Database=mydb;User=sa;Password=YourPassword" \
  -p 5000:5000 \
  runonflux/orbit:latest
```

## Performance Tips

1. **Use Dependency Caching**: Enable `packages.lock.json` - saves 20-40s per deployment
2. **Tiered Compilation**: Automatically enabled with `DOTNET_TieredPGO=1`
3. **ReadyToRun**: Automatically enabled for faster startup
4. **Production Environment**: Set `ASPNETCORE_ENVIRONMENT=Production`
5. **Health Checks**: Implement `/health` endpoint for faster deployment verification
6. **Response Compression**: Enable in ASP.NET Core for better performance
7. **Output Caching**: Use .NET 7+ output caching for API responses
8. **First Deployment**: Takes 30-60s (.NET installation), subsequent deploys are 10-20s

## Deployment Timeline

**First Deployment** (~30-60 seconds):
1. Git clone: 5-10s
2. .NET SDK installation: 15-30s (one-time, persists in container)
3. NuGet restore: 10-20s
4. Build/publish: 5-15s
5. Application start: 2-5s

**Subsequent Deployments** (~10-20 seconds):
1. Git pull: 2-3s
2. .NET check: `<1s` (already installed)
3. NuGet restore: `<1s` (cached if packages.lock.json unchanged)
4. Build/publish: 5-10s
5. Application restart: 2-3s

## Example Repository Structure

```
my-dotnet-api/
├── MyApi.sln              # Solution file
├── MyApi.csproj          # Project file with dependencies
├── packages.lock.json    # Locked package versions (optional)
├── global.json           # SDK version specification (optional)
├── nuget.config          # NuGet feed configuration (optional)
├── pre-deploy.sh         # Optional: Pre-deployment hook
├── post-deploy.sh        # Optional: Post-deployment hook
├── Program.cs            # Application entry point
├── appsettings.json      # Application configuration
├── appsettings.Production.json
├── Controllers/
│   └── WeatherController.cs
├── Models/
│   └── WeatherForecast.cs
├── Services/
│   └── IWeatherService.cs
└── Data/
    ├── ApplicationDbContext.cs
    └── Migrations/
```

## Next Steps

- [Environment Variables Reference](../configuration/environment-reference)
- [Deployment Hooks Guide](../hooks/deployment-hooks)
- [CI/CD Setup](../ci-cd/github-webhooks)
- [Troubleshooting](../troubleshooting/common-issues)
