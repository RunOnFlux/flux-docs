# Priority Nodes

The **Priority Nodes** tab is only available if you enabled the **Enterprise Application** option in the **General** tab. It allows you to define exactly which nodes will host your application—offering advanced security, control, and encryption capabilities.

***

### Overview

Use this tab to select trusted, high-reputation enterprise nodes that will exclusively run your application. These nodes are required for:

* **Access to private container images**
* **Secrets injection and encryption**
* **Secure repository authentication**

By locking your deployment to known, reputable nodes, you ensure maximum stability and data confidentiality.

<img src="/.gitbook/assets/Image 31.10.2025 at 10.35.jpeg" alt=""/>

***

### Node Selection

You have two options for selecting nodes:

* **Auto Select Enterprise Nodes**\
  Automatically pick a balanced set of enterprise-grade nodes based on reputation score, tier, and uptime.
* **Choose Enterprise Nodes**\
  Manually review and select each node yourself based on IP address, Node ID, Tier, and Score.

***

### Selected Nodes Table

#### Selected Nodes Table

Once nodes are selected, they appear in a table that includes:

* **IP Address** – The public-facing IP of the node
* **Node Address** – Unique node identifier on the Flux network
* **Tier** – All enterprise nodes must be on the **Stratus** tier
* **Score** – Reputation score used to assess stability and performance

You can click **Visit** to view node details or **Remove** to deselect any node.

> ⚠️ Changing the node list after the message is computed and encrypted will cause deployment failure. You must reconfigure Secrets and Repository Authentication if the node list changes.

<img src="/.gitbook/assets/Image 31.10.2025 at 10.36.jpeg" alt=""/>
