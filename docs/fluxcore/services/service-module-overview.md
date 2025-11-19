---
description: >-
  This guide provides step-by-step instructions on how to subscribe your
  machines to the FluxEdge marketplace by installing the service module. You'll
  gain access to all relevant information and tools n
---

# Service Module Overview

### **Overview of the Service Module**

The service module is essential for participating in the FluxEdge Marketplace. To make your machines available for Proof of Useful Work (PoUW) and rent them out on FluxEdge, you need to join a Kubernetes cluster. The service module provides all the necessary information and tools for this process.

### **Installing the Service Module**

1. Via the Menu Bar: Click the install button on the menu bar.
2. Via Account Settings: Navigate to Account > Modules to install it from there.

Once installed, the service module will be available in the UI for further interaction.

<img src="/.gitbook/assets/image (13) (1).png" alt=""/>

### **Services Overview UI**

<img src="/.gitbook/assets/image (12) (1).png" alt=""/>

The Services Overview UI provides a data table tracking all your machines connected to your account. Here are the columns and their descriptions:

* Machine Name: Displays your machine's name.
* Type of Machine: Indicates whether the machine is dedicated or shared.
* Machine Uptime: Shows how long the machine has been running continuously.
* Machine Reliability: Displays the percentage of rentals completed without disruptions.
* Status: Indicates the current status of the machine.
* Revenue: Shows current revenue per hour when leased and total revenue so far.
* Hardware Specifications: Lists the machine's GPU, vRAM, cores, RAM, and storage.
* Load: Shows the current load of the machine in percentage.
* Fan Speed: Displays the live percentage of fan speed.
* GPU Status: Shows a dedicated box per GPU and its temperature.
* Subscribed Services: Displays the current machine configuration and which FluxEdge services it is available for, such as AI, rendering, cloud gaming, etc.

### **Subscribing Your Machine to a Service and Joining a Cluster**

<img src="/.gitbook/assets/image (11) (1).png" alt=""/>

1. Access Settings:
   * Click the settings icon in the “Subscribed Services” column in the My Machines data table. A pop-up will open.
2. Select Services:
   * Choose the services you want to make your machine available for. Some providers may prefer not to offer certain services, like rendering, due to heavy load. At least one service must be selected to continue. You can also access benchmark stats and your global ranking for each service.
3. Choose a Cluster Server:
   * Select an available cluster server in your region. The list shows available and maximum slots.
4. Select Machine Rental Type:
   * Currently, the only option is "Dedicated Machine". More options will be available soon.
5. Save Settings:
   * Agree to Terms: Review and agree to the terms of making your machine available on the marketplace.
   * Click Save to install the Kubernetes software, join the selected cluster, and make your machine available on the FluxEdge marketplace. If there are any setup issues, you can troubleshoot using the Cluster Management tile.

### **Cluster Management Tile**

<img src="/.gitbook/assets/image (10) (1).png" alt=""/>

This tile shows various cluster server statuses reflecting your machine's availability on the FluxEdge marketplace. Machines must be subscribed to a service and joined to a cluster to appear here. The columns include:

* Machine Name: Displays your machine's name.
* Cluster: Shows the cluster name joined.
* Node Status: Status of your node within the cluster.
* Machine Status: Status of your machine within the cluster.
* GPU Operator: This status indicates whether the cluster server recognizes the GPU on your machine. If the status is "inactive," your machine will still be rentable on the FluxEdge Marketplace but will only be available for CPU requests, not GPU requests.

_Note: GPU operator support for Windows is not yet available. We are awaiting official support and will implement it as soon as it is released._

* Action: Shows if your machine is listed on the FluxEdge marketplace. A green status means available for lease; red indicates a problem.

#### **Troubleshooting**

* If any status remains red or blue for over 6 minutes, an uninstall action button will appear. Click it to confirm uninstallation, which removes all cluster-related software. A 6-minute timer will start before further actions can be taken. After this, manually resubscribe your machine to a service and cluster server.
* If the node status is **"Cordoned"** and the action button says **"Uncordon"**, manual intervention is required. Uninstall Rancher manually via the **command line** or **FluxCore UI**. For more details, refer to the [Troubleshooting Guide](../installation/linux-installation/troubleshooting/).

By following these steps, you can effectively subscribe your machines to the FluxEdge marketplace and manage their participation in various services.
