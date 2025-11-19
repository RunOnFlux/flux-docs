# Manage App

The **Manage App** section is your control panel for operating and maintaining your application on the Flux Cloud. It offers both granular and global control over your app’s deployment, behavior, and resources.

This is where developers, sysadmins, and DevOps teams go to keep their apps performant, secure, and under control.

#### How To Access

> **Management → My Active Apps → Manage**

Open the **Management** tab in the **Applications** menu, select an application from **My Active Apps**, and click **Manage**.

***

### Overview of Tools

#### 1. **Local App Management**

The **Local App Management** section provides deep insight and control over a specific instance of your application running on a single FluxNode.

You’ll find tools for:

* Viewing node-specific specs and metadata
* Monitoring live resources and performance
* Inspecting log files, file changes, and running processes
* Controlling the app’s local lifecycle (e.g., restart, pause, rebuild)
* Connecting to a live terminal inside your container
* Browsing and modifying files using the Volume Browser
* Createing, downloading, or restoring backups of your container data

→ Read more about [Local App Management](local-app-management/)

***

#### **2. Global App Management**

The **Global App Management** section enables centralized actions affecting the entire application—across all FluxNodes where it's deployed.

You can:

* Start, stop, or redeploy your app globally
* View all active node instances
* Cancel or update your app settings, and subscription

→ Read more about [Global App Management](global-app-management/)

***

### Choosing the Right Tool

| Task                            | Use This Section      |
| ------------------------------- | --------------------- |
| Debug a specific instance       | Local App Management  |
| Modify files or open a terminal | Local App Management  |
| Restart the entire app          | Global App Management |
| View system logs                | Local App Management  |
| Cancel your subscription        | Global App Management |
| Monitor real-time CPU/RAM usage | Local App Management  |
| Restore from a previous backup  | Local App Management  |
