# Component

The Component section is where you define your application’s container settings, connectivity options, environment variables, and resource requirements.

***

### Component Name

* Must be at least **3 characters** long
* Allowed characters: **A–Z, a–z, 0–9**
* **No spaces or special characters** allowed

### Component Description

* Must be at least **3 characters** long

### Repository

Enter the **Docker container repository**

* Supported formats include: `namespace/repository:tag`
* Compatible with Docker Hub, GCR, GitHub Packages, and similar registries
* If you enabled **Enterprise Application** at **Details**, you will be able to enter your authentication token here for deploying a private container

### Ports

Set your Flux Public Port enclosed in brackets `[ ]`. You can specify multiple ports by separating them with commas, **without spaces**.

* Flux Public Port must be between **1024–65535**
* Restricted ports (do not use):\
  `['16100–16299', '26100–26299', '30000–30099', 22, 23, 25, 123, 161, 512, 513, 3388, 3889, 4444, 5800, 5900, 5901, 8384, 27017]`
* Example: `[31000,31001]`

### Domains (Optional)

Add your custom domain by enclosing it in brackets and double quotations

* Example: `["www.test.com"]`
* If you do not wish to add a domain, use empty quotations: `[""]`
  * &#x20;If you specified multiple Ports above, you need to add the double quotation per entry there
* For setup instructions, refer to the **Custom Domain Setup** guide

### Cont. Ports

Set your Container Port enclosed in brackets `[ ]`. You can specify multiple ports by separating them with commas, **without spaces**.

* Example: `[80]`
* For multiple ports: `[80,22]`&#x20;

> **⚠️&#x20;**_**Note: The number of Ports, Domains, and Cont. Ports must always be equal.**_

### Environment (Optional)

Configure environment variables for your Docker container using this syntax:\
`docker run -e VARIABLE=VALUE ...`

* The maximum payload size per environment is 400 characters
* Place the pairs within brackets and enclose them in quotations
* You can set multiple variables separated by commas
  * Example: `["DEBUG=1","DB_USER_NAME=admin","DB_USER_PASSWORD=admin"]`
* If you don’t need environment variables, leave the brackets empty as is

> **⚠️ Environment variables are publicly accessible via the FluxCloud API.**

**Upload to Flux Storage**

* Use the blue upload button next to the field to upload environment variables to Flux Storage
* This replaces parameters with a storage link, increasing max character size and providing basic privacy (only the link is visible via API, and the content is not accessible)

### Commands (Optional)

Define CLI commands for your container in JSON array format. Example: `["--logs","--history","version"]`

* The maximum payload size per command is 400 characters
* Place the command within brackets and enclose them in quotations
* You can set multiple commands separated by commas
* If you don’t need commands, leave the brackets empty as is

> **⚠️ Commands are publicly accessible via the FluxCloud API.**

**Upload to Flux Storage**

* Use the blue upload button next to the field to upload environment variables to Flux Storage
* This replaces parameters with a storage link, increasing max character size and providing basic privacy (only the link is visible via API, and the content is not accessible)

### Cont. Data

Define shared data volumes for your container using the format:

```
/path
```

**Container Data Guidelines**

* **`r:`** (Replicated After Readiness)\
  Use `r:` to delay data synchronization until **all container instances are fully running**. This ensures volumes are only mounted and synced when all backends are confirmed live—ideal for consistency in replicated setups
* **`g:`** (Primary/Standby)\
  Use `g:` to enable a **primary/standby configuration**. One instance acts as the primary (read–write), while the others stay in standby mode and only replicate changes from the primary
* **No Prefix**\
  If no prefix (`r:` or `g:`) is used, the path is treated as a **standard local volume**. These are **non-persistent** and **not synchronized** between instances

### Resources

Specify the **CPU, RAM, and storage** needed for this component.

***

### Add Component

You can include multiple components in your application composition. This is useful for multi-container apps, such as a backend API and frontend UI working together.

To add a new component:

1. Fill out the current component configuration.
2. Click the **“Add Component to Application Composition”** button at the bottom.
3. A new component panel will appear where you can configure the next container.

You can add or remove components as needed before finalizing the application.

***

Let’s continue to the final section, the Validate & Pay section, finalize and submit your application deployment.
