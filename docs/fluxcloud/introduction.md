# Introduction

**FluxCloud** is a decentralized Web3 cloud computing platform (“Blockchain-as-a-Service”) built and maintained by **InFlux Technologies** (UK). Launched in 2018, it delivers an AWS/GCP-style environment **without central control**—a truly “people-powered” alternative to Big Tech clouds.&#x20;

By late 2025, FluxCloud had enabled over **25,000 applications across 75+ countries**, giving developers and businesses a familiar cloud experience (containers, storage, networking) on a blockchain-coordinated network.

***

### Problems We Solve

| **Challenge**                                            | **FluxCloud Solution**                                                                        |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Escalating cloud costs for RPC, validators & frontends   | Up to **90% cheaper** than AWS, GCP, and other traditional clouds. No ingress or egress fees. |
| Centralized downtime risks impacting uptime & trust      | Geo-distributed redundancy with **auto-failover** across **10,000+ FluxNodes**                |
| Complex DevOps barriers for small or non-technical teams | Container-based platform: deploy in minutes via UI or API—**no DevOps overhead**              |
| Need for enterprise SLAs and white-glove support         | **Managed Service** option for turnkey deployment, monitoring, and scaling                    |

***

### Architecture Overview

FluxCloud is built on a globally distributed network of **FluxNodes**—independent servers operated by individuals and organizations that contribute compute, memory, and storage resources. With over **10,000 nodes** across 66 countries, FluxCloud forms one of the world’s largest decentralized cloud infrastructures.

When a user deploys an application on FluxCloud, it is automatically scheduled to run across **three or more FluxNodes**. This ensures high availability and redundancy: if one node fails or goes offline, others seamlessly continue hosting the workload, with zero downtime for the end-user. These workloads are coordinated over the **Flux blockchain**, which acts as the backbone of the platform—enabling transparent, on-chain verification, task distribution, and incentive management.

In 2025, InFlux Technologies released **ArcaneOS**, a major security upgrade to FluxOS. It introduced a secure live installer and a new attestation system that verifies OS integrity, monitors activity, and enforces runtime protections. Together, these enhancements significantly improve the security and trustworthiness of the platform—particularly for sensitive or enterprise-grade workloads.

FluxCloud’s innovative architecture has earned industry-wide recognition. In September 2024, it received the **Stratus Award for Cloud Computing**, with judges praising its resilience, scalability, and decentralized design as “groundbreaking” in the Web3 space.

***

### FluxNodes — The Backbone of the Cloud

**FluxNodes** are the decentralized servers that power the FluxCloud network. Each FluxNode is a physical or virtual machine running FluxOS, contributing compute, storage, and networking capacity to support applications on the platform. In effect, they form the decentralized infrastructure layer of FluxCloud.

FluxNodes are structured into performance-based tiers, each requiring increasing hardware specs and FLUX collateral. For example, the entry-level **Cumulus** node requires a **1,000 FLUX** stake, **2 CPU cores**, **8 GB of RAM**, and **220 GB of storage**. Higher tiers such as **Nimbus** and **Stratus** require significantly more: up to **40,000 FLUX**, **8 cores**, **64 GB of RAM**, and **880 GB of storage**. All nodes must pass a benchmark test before joining the network.

While online and meeting performance standards, FluxNodes automatically earn block rewards from the Flux blockchain. This incentivizes operators to provide consistent uptime and performance. Nodes that drop below the required availability threshold are deactivated by the protocol to maintain overall network reliability.

The Flux network is highly decentralized by design. As of mid-2025, it has over **10,000 nodes** distributed across **66+ countries** and operated by more than **560 independent infrastructure providers**. This global spread eliminates single points of failure. If a region suffers downtime due to a power outage or natural disaster, the workload is seamlessly redistributed to other nodes, ensuring application uptime and resilience against censorship or disruptions.

#### Key Network Statistics

**Total Resources** _(Live stats:_ [_home.runonflux.io/dashboard/resources_](https://home.runonflux.io/dashboard/resources)_)_

* **Total Cores**: 91,370
* **Total RAM**: 216.62 TB
* **Total Storage**: 6.80 PB

<img src="/.gitbook/assets/Total Resources.png" alt=""/>

**Geolocations & Providers** _(Live stats:_ [_home.runonflux.io/dashboard/map_](https://home.runonflux.io/dashboard/map)_)_

* **Geographic Coverage**: 66 countries
* **Infrastructure Providers**: 560

<img src="/.gitbook/assets/Geolocations &#x26; Providers.png" alt=""/>

***

### Choosing your Front-End: CLOUD vs. HOME

FluxCloud provides two distinct front-end interfaces for accessing the decentralized cloud: **CLOUD** and **HOME**. Both support FLUX and fiat payments, Web2 and Web3 authentication, and core deployment workflows—but they differ in focus and feature availability.

**CLOUD**

**URL**: [cloud.runonflux.com](https://cloud.runonflux.com)\
CLOUD is optimized for **end users and non-technical audiences**, offering a guided, step-by-step UI for launching applications. It's ideal for fast, simplified deployments.

* Wizard-based UI for easier onboarding
* Supports **WordPress** and **FluxDrive** (HOME does not—support coming soon)
* Best for quick consumer deployments or non-technical users
* Features roll out here **after** being stabilized in HOME

**HOME**

**URL**: [home.runonflux.com](https://home.runonflux.com)\
HOME is the **developer-centric dashboard**, updated in real time with the latest backend features. It provides deeper access to FluxCloud’s capabilities and configuration options.

* Full access to advanced deployment features
* Updated more frequently in sync with backend releases
* Ideal for technical users, power deployers, and testers
* Does **not** currently support WordPress or FluxDrive

If you're new to FluxCloud or looking for a consumer-friendly experience, start with [**CLOUD**](cloud/). For advanced use cases or early access to platform improvements, go with [**HOME**](home/).

***

### Learn More About Us

* **Official Website**: [runonflux.com](https://runonflux.com)
* **GitHub**: [RunOnFlux GitHub](https://github.com/runonflux)
* **Twitter (X)**: [@RunOnFlux](https://twitter.com/runonflux)
* **LinkedIn**: [InFlux Technologies](https://www.linkedin.com/company/influxtechnologies)
