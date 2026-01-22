---
id: kaspathon
title: FluxCloud Compute Support for Kaspathon Builders
sidebar_label: Kaspathon
---

# FluxCloud Compute Support for Kaspathon Builders

For **Kaspathon**, FluxCloud is providing **free, censorship-resistant cloud compute**, allowing every team to deploy and scale their projects without worrying about infrastructure constraints.

This initiative is **not a partnership**, it’s FluxCloud’s commitment to empowering builders. By combining a globally distributed compute network with flexible deployment workflows, FluxCloud enables teams to focus on building rather than infrastructure.

---

## How to Apply for Free Compute Credits

FluxCloud’s Kaspathon compute support is open to **all registered hackers**.  
To receive free credits, simply fill out the [**Kaspathon FluxCloud Compute Form**](https://forms.gle/Vp41U4RyRfupbmrY9).

You will need:

- **A FLUX address**  
  Credits are distributed on the Flux blockchain. If you don’t have one yet, download **Zelcore**, a secure non-custodial wallet available on desktop, mobile, and browser.

- **Your DoraHacks registration name**  
  A FluxCloud team member (**kyuubi2709**) will contact you on via message at DoraHacks to verify your FLUX address before credits are sent.

For help or questions related to FluxCloud during Kaspathon, builders can reach out to **kyuubi2709** in the **official Kaspa Discord server**, in the **#kaspathon** channel. You can also contact **kyuubi2709 directly on DoraHacks** (**@U_4e9a05a1456b2e**) for support.

---

## How FluxCloud Works

Launched in 2018, FluxCloud has grown into a people-powered alternative to traditional big-tech clouds, offering familiar cloud services without central control.

FluxCloud is powered by a global network of **8,000+ FluxNodes** distributed across **66 countries**. Each FluxNode is independently operated and contributes CPU, RAM, and storage resources to the network.

When you deploy an application on FluxCloud, it is scheduled to run on FluxNodes across the global network. By default, nodes are selected automatically to maximize decentralization, performance, and availability. However, **geographic placement is fully configurable**.

You can optionally define where your application is allowed—or not allowed—to run using:

- **Allowed locations** (continents, countries, or regions)
- **Forbidden locations** (continents, countries, or regions)

This gives builders fine-grained control over data locality, latency, regulatory requirements, or regional preferences.

You can choose to run your application on:

- **A single instance**, or
- **Multiple instances (2–100)** for redundancy and high availability

FluxCloud supports **automatic failover**. If a server experiences downtime or failure, your application is automatically redeployed to a healthy node. With multi-instance deployments, this ensures **up to 99.99% uptime**.  
*(Note: single-instance deployments may experience brief downtime during redeployments.)*

---

## Networking, Domains, and Security

Each deployed application receives an automatically generated **Flux subdomain** (`*.app.runonflux.io`) that is ready to use out of the box.

Custom domains are also supported. To use one, simply point a **CNAME record** to your assigned Flux domain and specify the custom domain in your application configuration.

Because applications run on infrastructure operated by independent node operators, FluxCloud places a strong emphasis on security. To address this, Flux introduced **ArcaneOS**, a hardened operating system now installed on nearly **70% of the network**.

ArcaneOS provides:
- Encrypted disk space
- Continuous integrity monitoring
- Improved isolation for application data

For applications requiring maximum data protection, **Enterprise Mode** can be enabled during deployment, ensuring stricter security guarantees.

---

## Transparent and Flexible Pricing

FluxCloud’s pricing model differs significantly from traditional cloud providers. By leveraging under-utilized global hardware, FluxCloud offers:

- Flexible pricing
- Zero egress fees
- No vendor lock-in

An interactive **Cost Calculator** is available at **https://cloud.runonflux.com** allowing you to estimate monthly costs by selecting vCPUs, memory, storage, and instance count.

---

## Two Ways to Deploy on FluxCloud

### 1. Deploy with Docker

The classic deployment method on FluxCloud uses Docker containers. You package your application as a Docker image, define resource requirements (CPU, RAM, storage), choose the number of instances, and FluxCloud handles the rest.

Because FluxCloud is **code-agnostic**, you can deploy virtually any tech stack using Docker.

[**Deploy with Docker Documentation**](https://docs.runonflux.com/fluxcloud/register-new-app/deploy-with-docker/)

---

### 2. Deploy with Git (Instant Deploy)

FluxCloud is introducing **Instant Deploy**, a new *Deploy with Git* workflow designed to eliminate Docker complexity.

Instead of writing Dockerfiles or configuring CI/CD pipelines, you simply provide a **Git repository URL**. FluxCloud automatically:
- Detects your framework
- Installs the required runtime
- Deploys your app across multiple servers

Updates pushed to your repository are deployed automatically, with built-in health checks and safe rollbacks. Deploy with Git supports **100+ frameworks and languages**, including Node.js, Python, Go, Rust, Java, and monorepos.

**Deploy with Git goes live next week.** Follow **RunOnFlux’s official channels** for updates on the full release.

[**Deploy with Git Documentation**](https://docs.runonflux.com/fluxcloud/register-new-app/deploy-with-git/)
