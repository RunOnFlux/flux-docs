# ArcaneOS FluxNode

FluxNode operators now have access to a powerful new tool—**Arcane OS**—purpose-built to elevate security, privacy, and ease of deployment across the Flux network. This page explains what Arcane OS is, how it fits into the FluxNode ecosystem, and why it matters for node operators seeking maximum trust, consistency, and compliance—especially with enterprise-grade applications.

***

### What is ArcaneOS

Arcane OS is a major security and usability upgrade to FluxOS, launched on **March 31, 2025.** It introduces two core components:

#### ArcaneOS Live Image Installer

A standalone, Ubuntu 24‑based operating system that boots from USB or other media, without requiring full installation. It includes an intuitive graphical interface secured through a cryptographic _chain of trust_, ensuring each installation step is verified and consistent via built‑in checkpointing. Installation settings are pre-selected for ease of use, minimizing manual configuration.

#### FluxOS System Attestation Service (SAS)

A proprietary, closed‑source security protocol designed to validate system integrity. SAS ensures that OS files and packages remain unaltered, employing file attestation, encryption/decryption based on hardware specs, live activity monitoring, and memory protection. SAS code is obfuscated to prevent tampering and reverse engineering.

***

### Key Benefits for FluxCloud

* **Enhanced Privacy**\
  Node operators can’t access application data due to encryption of disk partitions and restrictions on root access. This ensures maximum isolation and confidentiality.
* **Improved Security & Trust**\
  The chain of trust during installation, plus active system attestation, protects against tampering and unauthorized changes—strengthening ecosystem integrity.
* **Consistency & Reliability**\
  The checkpoint system guarantees identical boot behavior post-install. Preselected installer settings reduce setup complexity and minimize user error.

***

### Why Arcane Matters for FluxNodes

Since the v6.0.0 release of FluxOS, only operators running Arcane OS–based nodes are eligible to install enterprise‑grade “v8 app specifications,” ensuring a secure and compliant environment for business‑critical applications. This positions Arcane as a necessary upgrade for operators aiming to engage with enterprise deployment and the latest features in the FluxCloud ecosystem.

***

### Summary  Table

| Component                        | Description                                                                                     |
| -------------------------------- | ----------------------------------------------------------------------------------------------- |
| Live Image Installer             | Ubuntu 24‑based OS bootable from USB/media, with GUI and cryptographic checkpointing            |
| System Attestation Service (SAS) | Closed-source service for verifying OS integrity, encryption, monitoring, and memory protection |
| Security & Privacy               | Encrypted partitions and root-restrictions prevent unauthorized data access                     |
| Enterprise Compatibility         | Required for installing v8 enterprise app specs as of FluxOS v6.0.0                             |

***

### Looking Ahead

Arcane OS represents Flux's ongoing commitment to privacy-first decentralized infrastructure, and lays the groundwork for future enhancements, and enterprise integrations. If you’re deploying a FluxNode today—especially for production or enterprise use—installing Arcane OS ensures your node is secure, compliant, and future-ready.
