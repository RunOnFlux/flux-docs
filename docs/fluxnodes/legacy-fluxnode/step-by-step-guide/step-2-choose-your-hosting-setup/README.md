# Step 2: Choose Your Hosting Setup

To run a FluxNode, you’ll need a server that is **always online** and meets the technical requirements for your selected FluxNode tier. You have two main options:

* **Rent a VPS (Virtual Private Server)** from a hosting provider
* **Host from home** using your own hardware (e.g., desktop PC, Raspberry Pi, NVIDIA Jetson)

Each approach has its pros and cons depending on your budget, technical skill level, and desired control over your setup.

Once your server environment is ready, you’ll proceed with the FluxNode installation and configuration process.

***

### Hardware Requirements&#x20;

Below are the minimum requirements for each FluxNode tier. Make sure your server has these available:

| **Node Tier** | **Collateral** | **CPU**              | **RAM** | **SSD / NVMe** | **Bandwidth** | **Public IP** | **Uptime**   |
| ------------- | -------------- | -------------------- | ------- | -------------- | ------------- | ------------- | ------------ |
| **Cumulus**   | 1,000 FLUX     | 2 cores / 4 threads  | 8 GB    | 220 GB         | ≥ 25 Mbit/s   | Required      | \~97% uptime |
| **Nimbus**    | 12,500 FLUX    | 4 cores / 8 threads  | 16 GB   | 440 GB         | ≥ 50 Mbit/s   | Required      | \~97% uptime |
| **Stratus**   | 40,000 FLUX    | 8 cores / 16 threads | 32 GB   | 880 GB         | ≥ 100 Mbit/s  | Required      | \~97% uptime |

***

### Option 1: Rented VPS Server

A **Virtual Private Server (VPS)** simulates a dedicated server using shared physical hardware. It provides root access and a consistent network connection—ideal for those who prefer low-maintenance, remote infrastructure.

| ✅ Pros                                              | ⚠️ Considerations                                     |
| --------------------------------------------------- | ----------------------------------------------------- |
| No need to maintain hardware                        | Only one FluxNode per VPS is allowed                  |
| High uptime and stable internet                     | Performance can be affected by other VPS users        |
| Easily scalable by renting additional VPS instances | Monthly cost depending on provider and specifications |
| Ideal for beginners                                 | Limited control over the physical server              |

> 💡 If you want to run multiple nodes, consider renting multiple VPS instances or switching to a **dedicated server**.

We’ve compiled a community-tested list of VPS and dedicated server providers here:\
[Server Providers List](https://docs.google.com/spreadsheets/u/0/d/1KJf9yI7RGl01ZgkWA8qVPQUwChEfe0JK2UGfubnq4Fw/htmlview) _(tiers are organized in separate tabs)_

> ⚠️ **Disclaimer**: The Flux team does not endorse any specific provider. Please do your own research to ensure suitability for your use case.

**Operating System Recommendation**

We recommend using **Ubuntu 22.04 LTS** or higher as your OS. You may use others if preferred—see the OS Compatibility List for full details.

Once your VPS is ready with Ubuntu installed, proceed to the FluxNode Installation section.

***

### Option 2: Home-Based Server

Operating a Flux Node from home is a great option that gives you **full control over your hardware and network** while eliminating recurring VPS costs. It also directly supports the mission of Flux by helping to **decentralize and scale Web3 cloud infrastructure.**

There are multiple hardware approaches you can take, from repurposing an old PC to using compact devices like Raspberry Pi or NVIDIA Jetson. If you're more ambitious, a **bare metal server** at home can even run **multiple nodes** using virtualization.

| ✅ Pros                                                | ⚠️ Considerations                               |
| ----------------------------------------------------- | ----------------------------------------------- |
| No ongoing monthly hosting fees                       | Requires reliable power and stable internet     |
| Full control over hardware and network setup          | Initial hardware cost may be high               |
| Can support multiple nodes with proper virtualization | Port forwarding or UPnP setup required          |
| Helps decentralize and scale the Flux network         | Responsible for maintenance and troubleshooting |

**Hardware Requirements**

Before proceeding, ensure your device meets the **minimum system and network requirements** for your chosen node tier (Cumulus, Nimbus, or Stratus):\
[FluxNode Requirements](#hardware-requirements-)

***

**🧱 A. Bare Metal Server (Multi-node Support)**

A **bare metal server** is a dedicated physical machine hosted in your home. This gives you access to the full performance of the hardware and the ability to install a **hypervisor**, allowing you to **run up to 8 Flux Nodes** from a single machine—if your hardware and network can handle it.

This is a powerful and scalable option ideal for advanced users.

🧰 Requirements:

* High-performance CPU, RAM, and SSD storage
* Stable home internet with proper upload speeds
* Proxmox or another virtualization platform (if running multiple nodes)

> 💡 Starting with one node and expanding over time is a common approach.

***

**💻 B. Virtualized Server on Windows (Proxmox, VirtualBox)**

If you're on Windows, you can use virtualization software like **Proxmox** or **VirtualBox** to run an Ubuntu server as a VM (Virtual Machine). This is a popular option for those who want to keep their existing setup while running a FluxNode.

🧰 Requirements:

* PC with virtualization support (VT-x or AMD-V enabled in BIOS)
* 1 VM per node (Ubuntu 22.04 or higher is recommended)
* Sufficient system resources for each VM

***

**🍓 C. Raspberry Pi (Cumulus Only)**

**Raspberry Pi** devices are affordable, energy-efficient, and ideal for running **Cumulus-tier** nodes.

🧰 Requirements:

* Raspberry Pi 4 (4GB or 8GB RAM recommended)
* SD card or SSD for storage
* Cooling system (fan or heatsink)
* Ethernet connection (not Wi-Fi)
* Ubuntu-based OS

> ⚠️ Not recommended for Nimbus or Stratus tiers due to performance limitations.

***

**🤖 D. NVIDIA Jetson**

The **NVIDIA Jetson** series is a powerful ARM-based platform, great for running energy-efficient Flux Nodes with AI-capable hardware.

🧰 Requirements:

* Jetson Nano, Xavier NX, or equivalent
* Ubuntu-based Jetson OS
* SSD and heatsink
* Ethernet connection

> ⚠️ This is a more technical setup, best suited for developers and edge computing enthusiasts.
