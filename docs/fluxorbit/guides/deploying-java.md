---
sidebar_position: 7
title: Deploying Java Applications
description: Complete guide for deploying Java applications with Flux-Orbit
---

# Deploying Java Applications

This comprehensive guide covers everything you need to know about deploying Java applications with Flux-Orbit, from simple Spring Boot applications to complex microservices using Maven or Gradle.

## Overview

Flux-Orbit automatically detects Java applications by looking for:
- `pom.xml` file (Maven)
- `build.gradle` or `build.gradle.kts` file (Gradle)
- `.java-version` for version specification (optional)

## Basic Java Deployment

### Simple Spring Boot Application

```bash
docker run -d \
  --name spring-boot-api \
  -e GIT_REPO_URL=https://github.com/your-username/spring-boot-api \
  -e APP_PORT=8080 \
  -p 8080:8080 \
  runonflux/orbit:latest
```

### What Happens Automatically

1. **Detection**: Finds `pom.xml` or `build.gradle` and identifies as Java project
2. **Version Selection**:
   - Checks `JAVA_VERSION` environment variable
   - Checks `.java-version` file
   - Checks `<java.version>` or `<maven.compiler.target>` in pom.xml
   - Checks `sourceCompatibility` in build.gradle
   - Falls back to Java 21 LTS
3. **Runtime Installation**:
   - Downloads Eclipse Temurin JDK from Adoptium
   - Extracts to `/opt/flux-tools/java`
   - Installs Maven 3.9.6 to `/opt/flux-tools/maven`
   - Sets JAVA_HOME and M2_HOME environment variables
4. **Dependencies**:
   - Maven: Runs `mvn dependency:go-offline -B`
   - Gradle: Runs `gradle dependencies --no-daemon` (auto-installs Gradle 8.5 if needed)
5. **Build**:
   - Maven: `mvn clean package -DskipTests -B`
   - Gradle: `gradle build -x test --no-daemon`
6. **Memory Configuration**: Auto-configures JVM heap (75% of container memory, min 512MB, max 8GB)
7. **Start**: Executes JAR with `java $JAVA_OPTS -jar {jar} --server.port=$APP_PORT`

## Framework-Specific Guides

### Spring Boot

Spring Boot is the most popular Java framework. Flux-Orbit automatically detects and optimizes Spring Boot applications:

```bash
docker run -d \
  --name spring-boot-rest-api \
  -e GIT_REPO_URL=https://github.com/your-username/spring-boot-api \
  -e APP_PORT=8080 \
  -e JAVA_VERSION=21 \
  -p 8080:8080 \
  runonflux/orbit:latest
```

**Example Maven `pom.xml`:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
    </parent>

    <groupId>com.example</groupId>
    <artifactId>my-api</artifactId>
    <version>1.0.0</version>

    <properties>
        <java.version>21</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

**Example Application:**
```java
package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "healthy");
    }

    @GetMapping("/")
    public Map<String, String> root() {
        return Map.of("message", "Hello from Spring Boot!");
    }
}
```

**Key Features:**
- Auto-configures `--server.port` from `APP_PORT` environment variable
- Detects Spring Boot framework and optimizes build
- Supports Spring Boot 2.x and 3.x
- Handles both JAR and WAR packaging

### Quarkus

Quarkus is a Kubernetes-native Java framework optimized for GraalVM and HotSpot:

```bash
docker run -d \
  --name quarkus-api \
  -e GIT_REPO_URL=https://github.com/your-username/quarkus-api \
  -e APP_PORT=8080 \
  -p 8080:8080 \
  runonflux/orbit:latest
```

**Example Maven `pom.xml`:**
```xml
<project>
    <properties>
        <quarkus.version>3.6.0</quarkus.version>
        <maven.compiler.source>21</maven.compiler.source>
        <maven.compiler.target>21</maven.compiler.target>
    </properties>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>io.quarkus</groupId>
                <artifactId>quarkus-bom</artifactId>
                <version>${quarkus.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <dependencies>
        <dependency>
            <groupId>io.quarkus</groupId>
            <artifactId>quarkus-resteasy-reactive-jackson</artifactId>
        </dependency>
    </dependencies>
</project>
```

**Key Features:**
- Detects Quarkus framework automatically
- Fast startup time
- Low memory footprint
- Handles Quarkus-specific JAR naming (`*-runner.jar`)

### Micronaut

Micronaut is a modern JVM-based framework for building microservices:

```bash
docker run -d \
  --name micronaut-api \
  -e GIT_REPO_URL=https://github.com/your-username/micronaut-api \
  -e APP_PORT=8080 \
  -p 8080:8080 \
  runonflux/orbit:latest
```

## Build Tool Configuration

### Maven

Flux-Orbit fully supports Maven projects and automatically handles:

**Maven Wrapper (Preferred):**
```bash
# If your project has mvnw, Flux-Orbit uses it automatically
./mvnw clean package -DskipTests -B
```

**System Maven (Fallback):**
```bash
# If no wrapper, uses installed Maven 3.9.6
mvn clean package -DskipTests -B
```

**Skip Tests:**
Tests are automatically skipped during build (`-DskipTests`). To run tests:
```bash
docker run -d \
  -e BUILD_COMMAND="mvn clean package -B" \
  runonflux/orbit:latest
```

### Gradle

Flux-Orbit fully supports Gradle projects with both Groovy and Kotlin DSL:

**Gradle Wrapper (Preferred):**
```bash
# If your project has gradlew, Flux-Orbit uses it automatically
./gradlew build -x test --no-daemon
```

**System Gradle (Auto-installed):**
```bash
# If no wrapper, Gradle 8.5 is installed automatically
gradle build -x test --no-daemon
```

**Example `build.gradle`:**
```gradle
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.2.0'
    id 'io.spring.dependency-management' version '1.1.4'
}

group = 'com.example'
version = '1.0.0'

java {
    sourceCompatibility = '21'
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
}
```

**Example `build.gradle.kts` (Kotlin DSL):**
```kotlin
plugins {
    java
    id("org.springframework.boot") version "3.2.0"
    id("io.spring.dependency-management") version "1.1.4"
}

group = "com.example"
version = "1.0.0"

java {
    sourceCompatibility = JavaVersion.VERSION_21
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
}
```

## Configuration Options

### Environment Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `JAVA_VERSION` | Force specific Java version | Auto-detected or 21 | `17`, `21` |
| `JAVA_OPTS` | JVM options | Auto-configured | `-Xms512m -Xmx2048m` |
| `MAVEN_OPTS` | Maven-specific options | None | `-Xmx1024m` |
| `GRADLE_OPTS` | Gradle-specific options | None | `-Xmx1024m` |
| `BUILD_COMMAND` | Override build command | Auto (mvn/gradle) | `mvn clean install` |
| `RUN_COMMAND` | Override run command | Auto-detected JAR | `java -jar custom.jar` |
| `BUILD_TIMEOUT` | Build timeout in seconds | 1800 (30 min) | `3600` |

### Java Version Detection Priority

1. `JAVA_VERSION` environment variable (highest priority)
2. `.java-version` file in project root
3. `<java.version>` in pom.xml
4. `<maven.compiler.target>` in pom.xml
5. `sourceCompatibility` in build.gradle
6. **Default: Java 21 LTS**

### Memory Configuration

Flux-Orbit automatically configures JVM memory based on container resources:

**Automatic Configuration:**
```bash
# Container with 4GB RAM:
# JAVA_OPTS=-Xms3072m -Xmx3072m -XX:+UseG1GC -XX:MaxGCPauseMillis=200 ...
```

**Manual Override:**
```bash
docker run -d \
  -e JAVA_OPTS="-Xms512m -Xmx1024m -XX:+UseG1GC" \
  runonflux/orbit:latest
```

**Memory Calculation:**
- Uses 75% of container memory for heap
- Minimum: 512MB
- Maximum: 8GB
- Uses G1GC for optimal performance

### JAR File Detection

Flux-Orbit automatically finds and runs the correct JAR file:

**Detection Priority:**
1. Saved JAR path from build (`/app/.java_jar_file`)
2. Search in `target/` (Maven) or `build/libs/` (Gradle)
3. Exclude: `*-sources.jar`, `*-javadoc.jar`, `*-tests.jar`
4. Prefer: `*-boot.jar`, `*-runner.jar`, `*-exec.jar`, `*-all.jar`

## Advanced Configurations

### Multi-Module Projects (Monorepo)

Deploy specific modules from a monorepo:

```bash
docker run -d \
  --name user-service \
  -e GIT_REPO_URL=https://github.com/company/monorepo \
  -e PROJECT_PATH=user-service \
  -e APP_PORT=8080 \
  -p 8080:8080 \
  runonflux/orbit:latest
```

**Monorepo Structure:**
```
monorepo/
├── pom.xml                  # Parent POM
├── common/                  # Shared library
├── user-service/            # Microservice 1
│   ├── pom.xml
│   └── target/user-service.jar
├── order-service/           # Microservice 2
│   └── pom.xml
└── payment-service/         # Microservice 3
    └── pom.xml
```

**What Happens:**
1. Clones entire repo
2. Sets working directory to `user-service/`
3. Builds from root (builds all modules)
4. Finds JAR in `user-service/target/`
5. Runs only the user-service JAR

### Custom Build Commands

Override the default build command:

```bash
docker run -d \
  -e BUILD_COMMAND="mvn clean install -P production" \
  runonflux/orbit:latest
```

### Custom JVM Options

Configure JVM for specific requirements:

```bash
# High-throughput application
docker run -d \
  -e JAVA_OPTS="-Xms2g -Xmx4g -XX:+UseParallelGC" \
  runonflux/orbit:latest

# Low-latency application
docker run -d \
  -e JAVA_OPTS="-Xms1g -Xmx1g -XX:+UseZGC -XX:+UnlockExperimentalVMOptions" \
  runonflux/orbit:latest
```

### Maven Profiles

Activate specific Maven profiles:

```bash
docker run -d \
  -e MAVEN_OPTS="-P production,security" \
  runonflux/orbit:latest
```

## CI/CD Integration

### GitHub Webhooks

Enable automatic deployments on push:

```bash
docker run -d \
  --name spring-boot-api \
  -e GIT_REPO_URL=https://github.com/your-username/spring-boot-api \
  -e APP_PORT=8080 \
  -e WEBHOOK_PORT=9001 \
  -e WEBHOOK_SECRET=your-secret-key \
  -p 8080:8080 \
  -p 9001:9001 \
  runonflux/orbit:latest
```

Configure webhook in GitHub:
- **Payload URL**: `http://your-server:9001/webhook`
- **Content type**: `application/json`
- **Secret**: `your-secret-key`
- **Events**: Just the push event

### Dependency Caching

Dependencies are cached based on build file hash:

**Maven:** Hash of `pom.xml`
**Gradle:** Hash of `build.gradle` or `build.gradle.kts`

If hash hasn't changed, dependency installation is skipped (saves 30-180 seconds per deployment).

### Automatic Rollback

Failed deployments automatically rollback to the last working version:

```bash
# Deployment fails
[ERROR] Java build failed with exit code 1
[INFO] Rolling back to previous commit: abc1234
[SUCCESS] Rollback completed
```

## Troubleshooting

### Build Timeout

If builds take longer than 30 minutes:

```bash
docker run -d \
  -e BUILD_TIMEOUT=3600 \
  runonflux/orbit:latest
```

### Out of Memory (OOM)

Increase container memory or manually configure heap:

```bash
# Increase heap size
docker run -d \
  -e JAVA_OPTS="-Xms1g -Xmx2g" \
  runonflux/orbit:latest
```

### Wrong JAR File Detected

Specify the exact JAR to run:

```bash
docker run -d \
  -e RUN_COMMAND="java -jar target/my-app-1.0.0.jar" \
  runonflux/orbit:latest
```

### Maven/Gradle Wrapper Issues

If wrapper has wrong permissions or line endings:

```bash
# Flux-Orbit automatically:
# 1. Makes wrapper executable
# 2. Handles Windows line endings (CRLF)
```

### Java Version Mismatch

Force specific Java version:

```bash
docker run -d \
  -e JAVA_VERSION=17 \
  runonflux/orbit:latest
```

## Best Practices

### 1. Use Wrappers

Include `mvnw` or `gradlew` in your repository for reproducible builds:

```bash
# Generate Maven wrapper
mvn wrapper:wrapper

# Generate Gradle wrapper
gradle wrapper
```

### 2. Specify Java Version

Explicitly declare Java version in build files:

**Maven:**
```xml
<properties>
    <java.version>21</java.version>
</properties>
```

**Gradle:**
```gradle
java {
    sourceCompatibility = '21'
}
```

### 3. Health Check Endpoint

Include a `/health` endpoint for monitoring:

```java
@GetMapping("/health")
public Map<String, String> health() {
    return Map.of("status", "healthy");
}
```

### 4. Read Port from Environment

Always read `APP_PORT` (passed as `--server.port`):

```java
// Not needed! Flux-Orbit automatically passes:
// --server.port=$APP_PORT

// But if you need it in code:
String port = System.getenv("APP_PORT");
```

### 5. Externalize Configuration

Use Spring profiles or environment variables for configuration:

```java
@Value("${database.url:${DATABASE_URL:jdbc:postgresql://localhost:5432/db}}")
private String databaseUrl;
```

### 6. Log to STDOUT

Always log to standard output (not files):

```java
// Good: Spring Boot logs to STDOUT by default
logger.info("Application started");

// Avoid: File-based logging in containers
// Use Flux Network's log aggregation instead
```

## Example Deployments

### Production Spring Boot API

```bash
docker run -d \
  --name production-api \
  -e GIT_REPO_URL=https://github.com/company/spring-boot-api \
  -e GIT_BRANCH=main \
  -e APP_PORT=8080 \
  -e JAVA_VERSION=21 \
  -e WEBHOOK_PORT=9001 \
  -e WEBHOOK_SECRET=${WEBHOOK_SECRET} \
  -e DATABASE_URL=${DATABASE_URL} \
  -e REDIS_URL=${REDIS_URL} \
  -p 8080:8080 \
  -p 9001:9001 \
  runonflux/orbit:latest
```

### Microservice with Resource Limits

```bash
docker run -d \
  --name user-service \
  --memory="2g" \
  --cpus="2" \
  -e GIT_REPO_URL=https://github.com/company/microservices \
  -e PROJECT_PATH=user-service \
  -e APP_PORT=8080 \
  -e JAVA_OPTS="-Xms512m -Xmx1536m -XX:+UseG1GC" \
  -p 8080:8080 \
  runonflux/orbit:latest
```

