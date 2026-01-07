# Specifications

The **Specifications** tab gives you detailed insight into the configuration and deployment settings of your application, and includes two tabs. Use this panel to audit consistency across instances or troubleshoot discrepancies between nodes.

#### How To Access

> **Applications → Management → Manage App → Specifications**

Open the **Management** tab in the **Applications** menu, select an application from **My Active Apps**, click **Manage**, and open the **Specifications** tab.

#### Backend Selector

At the top right you'll find a **FluxNode IP selector**, letting you choose which node you want to inspect or control. This allows you to manage individual node instances of your app. A **reload button** is also available to refresh the list of currently active FluxNodes running your application.

<img src="/.gitbook/assets/Image 29.10.2025 at 10.55.jpeg" alt=""/>

***

<img src="/.gitbook/assets/image (6).png" alt=""/>

### Local Specifications

Displays the App and Component settings specifically running on the **selected FluxNode** (identified by its IP address). Use this to verify node-level deployment configurations.

### Global Specifications

Shows the App and Component settings as they are **globally applied** across all FluxNodes running the application. This is useful to compare expected configurations with actual node-level implementations.
