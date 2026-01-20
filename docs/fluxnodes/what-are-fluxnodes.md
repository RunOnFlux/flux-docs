# What Are FluxNodes

**FluxNodes** are the decentralized servers that power the FluxCloud network. Each FluxNode is a physical or virtual machine running FluxOS, contributing compute, storage, and networking capacity to support applications on the platform. In effect, they form the decentralized infrastructure layer of FluxCloud.

FluxNodes are **permissionless and open to everyone**—anyone with the required hardware specs and FLUX collateral can join the network.

***

### Ways to Deploy a FluxNode

You can join the Flux network through several deployment options:

* **Legacy FluxNode** – The original FluxNodes running on common Linux distributions. They require manual installation and maintenance. Legacy nodes will continue earning standard block rewards but will **only** receive FluxCloud revenue rewards if upgraded to ArcaneOS.
* **ArcaneOS Node** – Flux’s next-generation operating system for nodes (released 2025) with built-in security, automated updates, and self-maintenance. ArcaneOS is the only setup eligible for **Progressive Node Rewards (PNR)** — a system that shares FluxCloud application revenue (80% to ArcaneOS operators, 20% to ArcaneOS application hosts). Migrating to ArcaneOS maximizes rewards and reduces maintenance effort.
* **Titan Node** – Participate with a smaller stake (minimum 50 FLUX) and minimal hardware requirements. Instead of hosting your own server, you stake via the dashboard to run a Titan Node on enterprise-grade machines managed by InFlux Technologies Limited.
* **Managed Service** – A third-party sets up and operates the node for you while you retain custody of your FLUX collateral. This is ideal for those who prefer a hands-off approach.

> **For full details and setup instructions, see:**\
> [Legacy FluxNode](fluxnodes/legacy-fluxnode/) | [ArcaneOS FluxNode](/fluxnodes/arcaneos-fluxnode/) | [Titan Node Staking](/fluxnodes/titan-node-staking) | [Managed FluxNode Service](/fluxnodes/managed-fluxnode-service)

***

### FluxNode Requirements & Tiers

**FluxNodes** are structured into performance-based tiers, each requiring increasing hardware specs and FLUX collateral. For example, the entry-level **Cumulus** node requires a **1,000 FLUX** stake, **2 CPU cores**, **8 GB of RAM**, and **220 GB of storage**. Higher tiers such as **Nimbus** and **Stratus** require significantly more: up to **40,000 FLUX**, **8 cores**, **64 GB of RAM**, and **880 GB of storage**. All nodes must pass a benchmark test before joining the network.&#x20;

Below are the minimum requirements for each FluxNode tier. Make sure your server has these available:

| **Node Tier** | **Collateral** | **CPU**              | **RAM** | **SSD / NVMe** | **Bandwidth** | **Public IP** | **Uptime**   |
| ------------- | -------------- | -------------------- | ------- | -------------- | ------------- | ------------- | ------------ |
| **Cumulus**   | 1,000 FLUX     | 2 cores / 4 threads  | 8 GB    | 220 GB         | ≥ 25 Mbit/s   | Required      | \~97% uptime |
| **Nimbus**    | 12,500 FLUX    | 4 cores / 8 threads  | 32 GB   | 440 GB         | ≥ 50 Mbit/s   | Required      | \~97% uptime |
| **Stratus**   | 40,000 FLUX    | 8 cores / 16 threads | 64 GB   | 880 GB         | ≥ 100 Mbit/s  | Required      | \~97% uptime |

***

### Network Incentivization & Block Rewards

FluxNodes are financially incentivized to remain online, meet performance benchmarks, and contribute resources to the network. When operating within the required standards, FluxNodes earn **block rewards** from the Flux blockchain. Nodes that drop below the availability or performance threshold are automatically deactivated by the protocol to maintain network reliability.

#### Reward Structure

Flux uses a **dual-reward model** for node operators:

1. **Native FLUX Block Rewards**
   * Each block produces **14 FLUX**, split evenly:
     * **1 FLUX** → to one Cumulus node
     * **3.5 FLUX** → to one Nimbus node
     * **9 FLUX** → to one Stratus node
     * **0.5 FLUX** → to an ecosystem development fund allocated to the Flux Foundation
   * Live earnings statistics: [Flux Rewards Dashboard](https://home.runonflux.com/dashboard/rewards)
2. **Parallel Mining Rewards**
   * In addition to native FLUX, node operators earn **parallel assets** (tokens on other blockchains such as ETH, BSC, KDA, SOL, etc.).
   * For each parallel asset, **10% of the node reward** (≈ 1.35 FLUX worth) is distributed per block.
   * Once all ten parallel assets are active, this totals **13.5 FLUX worth in parallel assets**, effectively **doubling total earnings**.
   * Parallel mining rewards are **not** automatically paid to your wallet — they must be manually claimed via the **Fusion** app in **Zelcore**. Follow this [guide](claim-parallel-assets) to learn more.

#### Timeline & Retroactive Rewards

* **Parallel mining launched:** March 27, 2021.
* Rewards for new parallel assets are **retroactively claimable** back to the block height of their introduction.
* This means when a new asset launches, node operators can claim all rewards accrued since the relevant hard fork.

#### Progressive Node Rewards (PNR)

With the launch of **ArcaneOS**, Flux introduced the **Progressive Node Rewards** system:

* **80%** of FluxCloud application revenue is shared among ArcaneOS node operators.
* **20%** is distributed to ArcaneOS nodes hosting applications.
* **Legacy nodes do not receive PNR**, so upgrading to ArcaneOS is recommended for maximum rewards.
* More details: see Ways to Deploy a FluxNode.

***

### Key Network Statitics

The Flux network is highly decentralized by design. As of mid-2025, it has over **10,000 nodes** distributed across **66+ countries** and operated by more than **560 independent infrastructure providers**. This global spread eliminates single points of failure. If a region suffers downtime due to a power outage or natural disaster, the workload is seamlessly redistributed to other nodes, ensuring application uptime and resilience against censorship or disruptions.

**Total Resources** _(Live stats:_ [_home.runonflux.io/dashboard/resources_](https://home.runonflux.io/dashboard/resources)_)_

* **Total Cores**: 91,370
* **Total RAM**: 216.62 TB
* **Total Storage**: 6.80 PB

<img src="/.gitbook/assets/Total Resources.png" alt=""/>

**Geolocations & Providers** _(Live stats:_ [_home.runonflux.io/dashboard/map_](https://home.runonflux.io/dashboard/map)_)_

* **Geographic Coverage**: 66 countries
* **Infrastructure Providers**: 560

<img src="/.gitbook/assets/image (53).png" alt=""/>
