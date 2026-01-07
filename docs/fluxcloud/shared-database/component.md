# Component

Component section is where you define your Shared Database its container settings, connectivity options, environment variables, and resource requirements.

***

### Overview

When registering a Shared DB via FluxCloud you’ll add **two** components:

1. Your **DB engine** container (e.g. `mysql:latest`),&#x20;
2. The **Flux Shared DB operator** (`runonflux/shared-db`)

Please follow the configuration for each component carefully.

### Field Summary

| **Component**          | **Field**                   | **Notes**                                        |
| ---------------------- | --------------------------- | ------------------------------------------------ |
| **DB Engine**          | Component Name              | ≥3 chars; alphanumeric only (e.g., `mysql`)      |
|                        | Component Description       | ≥3 chars; free text                              |
|                        | Repository                  | Docker repo (e.g., `mysql:latest`)               |
|                        | Ports, Domains, Cont. Ports | Leave all empty or remove placeholder values     |
|                        | Environment                 | Include `MYSQL_ROOT_PASSWORD`, `MYSQL_ROOT_HOST` |
|                        | Commands                    | Put `["--disable-log-bin"]`                      |
|                        | Cont. Data                  | Put `/var/lib/mysql`                             |
|                        | Resources                   | Set based on performance needs                   |
| **Shared DB Operator** | Component Name              | Put `operator`                                   |
|                        | Description                 | Put `operator`                                   |
|                        | Repository                  | Use `runonflux/shared-db:latest`                 |
|                        | Ports                       | 3 random public ports: `[31000,31001,31002]`     |
|                        | Domains                     | Must be `["", "", ""]`                           |
|                        | Cont. Ports                 | Must be `[3307,7071,8008]`                       |
|                        | Environment                 | See required & optional vars below               |
|                        | Commands                    | Leave empty                                      |
|                        | Cont. Data                  | Put `r:/app/dumps`                               |
|                        | Resources                   | Recommended: 1 Core, 1 GB RAM, 2 GB SSD          |

### Field Description

### 1. DB Engine Component

### Component Name

* ≥3 chars; alphanumeric only (no spaces/special chars)
* **Example:** mysql

### Component Description

* ≥3 chars; free text.
* **Example:** mysql

### Repository

Enter the **Docker container repository** of your DB engine

* **Example:** mysql:latest

### Ports, Domains, Cont. Ports

* Leave all **empty brackets** `[]`
* If default placeholders like `""` exist, **delete them**

### Environment

Insert into the Environment field as a JSON array:

```
["MYSQL_ROOT_PASSWORD=<YourRootPassword>", "MYSQL_ROOT_HOST=172.0.0.0/255.0.0.0"]
```

* **Explanation of Values:**&#x20;
  * `<YourRootPassword>`: Root password for your MySQL database

### Commands (Optional)

Add to Commands if you'd like to disable binary logs (optional):

* \["--disable-log-bin"]

### Cont. Data

* Put /var/lib/mysql

### Resources

Specify **CPU**, **RAM**, and **storage** based on your database load.

***

### Add Another Component

Once you've configured your **DB Engine** component, you need to add the **Flux Shared DB Operator** as a second component.

Click **“Add Component to Application Composition”** at the bottom to continue.

***

### 2. Shared DB Operator Container

### Component Name

* Just put `operator`

### Component Description

* Just put `operator`

### Repository

* Must be `runonflux/shared-db:latest`

### Ports

Choose **3 random public ports** between `1024–65535`. Format them as a JSON array using square brackets, with **commas and no spaces**:

* ⚠️ **Do not use restricted ports**:\
  `['16100–16299', '26100–26299', '30000–30099', 22, 23, 25, 123, 161, 512, 513, 3388, 3889, 4444, 5800, 5900, 5901, 8384, 27017]`
* **Example:** `[31000,31001,31002]`

### Domains

* Must be `["","",""]`

### Cont. Ports

* Must be `[3307,7071,8008]`

### Environment

**Fill in required values:**

```json
[
  "DB_COMPONENT_NAME=flux<DB_ENGINE_COMPONENT_NAME>_<APPLICATION_NAME>",
  "DB_INIT_PASS=<YourRootPassword>",
  "CLIENT_APPNAME=<APPLICATION_NAME>",
  "DB_APPNAME=<APPLICATION_NAME>",
  "DB_PORT=<FluxPublicPort_1stEntry>",
  "API_PORT=<FluxPublicPort_2ndEntry>",
  "WHITELIST=<CommaSeparatedIPs>"
]
```

**Optional additions:**

```json
[
  "INIT_DB_NAME=<InitialDBName>",
  "DB_USER=<Username>"
]
```

&#x20;**Explanation of Values:**

* `DB_COMPONENT_NAME`: Format using `flux<DB_ENGINE_COMPONENT_NAME>_<APPLICATION NAME>` (e.g., `fluxmysql_mysql01`)
  * `<DB_ENGINE_COMPONENT_NAME>`: the **Component** **Name** you chose for your DB engine (e.g. `mysql`)
  * `<APPLICATION_NAME>`: your **Application Name** from **Details**
* `DB_INIT_PASS`: Same root password used in **Environment** for the **DB Engine**
* `CLIENT_APPNAME`, `DB_APPNAME`: Match **Application Name** from the **Details** section
* `DB_PORT`, `API_PORT`: Match 1st and 2nd entries of the chosen **Ports** for the **DB Engine Component**
* `WHITELIST`: IPs allowed to connect, comma-separated
* `INIT_DB_NAME`: Initial DB to be created (optional)
* `DB_USER`: Optional DB user

**Example:**

```json
[
  "DB_COMPONENT_NAME=fluxmysql_mysql01",
  "DB_INIT_PASS=123secret",
  "CLIENT_APPNAME=mysql01",
  "DB_APPNAME=mysql01",
  "DB_PORT=31000",
  "API_PORT=31001",
  "WHITELIST=<CommaSeparatedIPs>"
]
```

### Commands (Optional)

* Keep Empty

### Cont. Data

* Must be `r:/app/dumps`

### Resources

* **Recommended**: 1 Core, 1 GB RAM, 2 GB SSD
* Adjust up based on expected database traffic.
* Read more about monitoring and scaling in the Monitoring & Update section.

***

Once both components are added, continue to the **Validate & Pay** section to finalize your deployment.
