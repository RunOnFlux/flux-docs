# Deploy with Git

Deploy directly from your Git repository without managing Docker images. **Deploy with Git** automatically detects your framework, installs dependencies, builds, and runs your application.

---

### How It Works

Deploy with Git is a smart deployment layer that:

- Automatically detects your framework (Node.js, Python, Ruby, Go, Rust, PHP, .NET, Java, Bun)
- Installs the correct runtime and dependencies
- Builds your application
- Starts it running on FluxCloud

No Dockerfile required. Just point to your repository and deploy.

---

### Supported Frameworks

| Runtime | Frameworks |
|---------|------------|
| **Node.js** | React, Next.js, Vue, Nuxt, Express, Fastify, and more |
| **Python** | Django, Flask, FastAPI, Streamlit |
| **Ruby** | Rails, Sinatra |
| **Go** | Any Go application |
| **Rust** | Cargo-based projects |
| **PHP** | Laravel, Symfony, WordPress |
| **.NET** | ASP.NET Core |
| **Java** | Spring Boot, Maven, Gradle |
| **Bun** | Bun-based applications |

---

### Get Started

Ready to deploy from Git? Head over to the **Deploy with Git documentation** for complete setup instructions:

<div className="row">
  <div className="col col--6">
    <div className="card">
      <div className="card__header">
        <h3>Quick Start</h3>
      </div>
      <div className="card__body">
        <p>Deploy your first app in 5 minutes</p>
      </div>
      <div className="card__footer">
        <a className="button button--primary button--block" href="./getting-started/quick-start">Start Deploying</a>
      </div>
    </div>
  </div>
  <div className="col col--6">
    <div className="card">
      <div className="card__header">
        <h3>Flux-Orbit Docs</h3>
      </div>
      <div className="card__body">
        <p>Full documentation and guides</p>
      </div>
      <div className="card__footer">
        <a className="button button--primary button--block" href="./introduction">View Documentation</a>
      </div>
    </div>
  </div>
</div>

---

### Looking for Docker Deployment?

If you have an existing Docker image or need full container control, check out **[Deploy with Docker](../deploy-with-docker/)**.
