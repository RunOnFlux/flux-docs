# Shared Database

Flux Shared DB is a decentralized, persistent database service built on FluxCloud. It bundles standard DB engines with a custom “operator” that:

1. Discovers peers via FluxCloud
2. Forms a Master‑Slave cluster
3. Exposes a native DB interface on port **3307**

### Overview

* **High‑Availability Cluster**\
  Replicates automatically across ≥3 FluxNodes. No single point of failure.
* **Master‑Slave Replication**
  * **Master** handles writes, stamps and sequences them.
  * **Slaves** replicate the Master’s data.
  * **Reads** served locally by any node.
* **Scalability & Fault Tolerance**
  * Reads scale horizontally with added nodes.
  * Writes remain globally ordered by the Master.

<img src="/.gitbook/assets/Gitbook - CLOUD - Shared Database.jpg" alt=""/>

> **Figure:** Cluster architecture\
> Clients connect on port 3307; Master sequences writes (red) and replicates to Slaves; any node can serve reads (green).

### Supported Engines

* **✅ MySQL** (fully supported)
* **🚧 MongoDB** (in progress)
* **🚧 PostgreSQL** (in progress)

### How To Deploy

1. Sign in at **cloud.runonflux.com → Register New Application**
2. Complete, in order:

* **Details**
* **Component**
* **Review**
