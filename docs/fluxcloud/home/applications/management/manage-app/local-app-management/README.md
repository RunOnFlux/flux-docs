# Local App Management

The **Local App Management** section offers deep visibility and control over a specific instance of your application as it runs on a selected FluxNode. This is where node-level diagnostics, resource monitoring, debugging, and administrative control come together in one focused workspace.

#### How To Access

> **Management → My Active Apps → Manage → Local App Management**

Open the **Management** tab in the **Applications** menu, select an application from **My Active Apps**, and click **Manage**.

#### Backend Selector

At the top right of each tab, you'll find a **FluxNode IP selector**, letting you choose which node you want to inspect or control. This allows you to manage individual node instances of your app. A **reload button** is also available to refresh the list of currently active FluxNodes running your application.

Whether you're troubleshooting deployment issues, validating system behavior, or ensuring performance stability, this section provides the tools you need to manage your app’s lifecycle on a per-node basis.

<img src="/.gitbook/assets/Backend Selector.png" alt=""/>

***

### Overview of Tabs

#### 1. Specifications

The **Specifications** tab shows how your app is configured on this specific node vs. its global setup—ideal for spotting config mismatches or verifying deployment accuracy.\
\
→ Read more about the [Specifications tab](specifications)

***

#### 2. Information

The **Information** tab gives you raw, detailed metadata directly from the Docker engine running your app.

→ Read more about the [Information tab](information)

***

#### 3. Monitoring

The **Monitoring** tab displays real-time and historical performance data from the container environment.\
You can track stats like CPU, RAM, and storage usage—essential for analyzing trends, spotting anomalies, and understanding runtime behavior.&#x20;

This tab also includes a **Processes** view, providing a real-time snapshot of active processes running inside the container.

→ Read more about [Stats](monitoring#stats-overview) and [Processes](monitoring#processes-overview)

***

#### 4. File Changes

The **File Changes** tab tracks which files and directories have been created, modified, or deleted inside your container.

→ Read more about the [File Changes tab](file-changes)

***

#### 5. Log Files

The **Log Files** tab is your window into what your app is saying behind the scenes.&#x20;

→ Read more about the [Log Files tab](logs)

***

#### 6. Application Control

The **Application Control** tab lets you manage the entire lifecycle of the app instance running on the selected FluxNode.

→ Read more about the [Application Control tab](application-control)

***

#### **7. Backup & Restore**

Secure and safeguard your data by creating manual backups or restoring your container to a previous state.

→ Read more about the [Backup & Restore tab](backup-and-restore)

***

#### **8. Interactive Terminal**

The **Interactive Terminal** tab lets you connect to a live terminal session inside your container.\
You can issue commands, inspect logs, or make real-time changes—all without restarting the app.\
A volume browser is also available, allowing you to upload, edit, rename, or delete files and folders directly from the UI.

→ Read more about [Interactive Terminal](interactive-terminal) and [Browsing & Managing Files](interactive-terminal#browsing--managing-files)

***

### When to Use Local App Management

Use this section when you need:

* Node-specific diagnostics and runtime data
* Performance or configuration validation at the container level
* To troubleshoot issues that aren’t affecting all instances equally
* Fine-grained control over one app instance, separate from global behavior
* Full access to your container’s environment, filesystem, and data
* To create or restore backups before updates, migrations, or cancellations
* To debug and test in real-time using terminal commands
* To investigate or manage stored logs, temp files, or persistent volume data
* Direct manipulation of component-level behavior on the local level
