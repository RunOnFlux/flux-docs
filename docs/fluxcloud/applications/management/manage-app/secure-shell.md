# Secure Shell

The **Interactive Terminal** tab provides direct command-line access to your application container running on the FluxCloud. This powerful feature allows developers and administrators to troubleshoot, configure, or modify their applications in real time—without redeploying.

#### How To Access

> **Applications → Management → Manage App → Secure Shell**

Open the **Management** tab in the **Applications** menu, select an application from **My Active Apps**, click **Manage**, and open the **Secure Shell** tab.

#### Backend Selector

At the top right you'll find a **FluxNode IP selector**, letting you choose which node you want to inspect or control. This allows you to manage individual node instances of your app. A **reload button** is also available to refresh the list of currently active FluxNodes running your application.

<img src="/.gitbook/assets/Image 29.10.2025 at 10.55.jpeg" alt=""/>

***

### Overview

This tab enables you to:

* Connect to your container using common shell environments.
* Execute commands inside the live environment.
* View output instantly within the dashboard.
* Toggle user and environment settings for fine-tuned control.
* Navigate the live file system inside your app’s container
* Upload new files or create folders
* Edit or rename existing files
* Download or delete files and folders
* Monitor storage usage relative to your allocation

***

### How to Use the Terminal

1. Select your application component from the dropdown (e.g., `timpicollector`).
2. Choose your shell environment from the dropdown menu:
   * `Linux` (default)
   * `/bin/bash`
   * `/bin/ash`
   * `/bin/sh`
   * `Other`
   * `Custom`
3. Optional toggles:
   * **User**: Enables user-based session context to preserve the container's user context (useful for permission-sensitive ops). Format is one of : user, user:group, uid, or uid:gid
   * **Environment**: Includes environment variables during terminal execution. Enter environment variables via (String).
4. Click **Connect** to launch the terminal session.
5. Type your commands directly into the terminal pane.

<img src="/.gitbook/assets/image (9).png" alt=""/>

### Shell Environment Options

| Option    | Description                                                  |
| --------- | ------------------------------------------------------------ |
| Linux     | Default terminal environment for typical Linux containers.   |
| /bin/bash | Bash shell – widely used, feature-rich.                      |
| /bin/ash  | Lightweight shell (often used in Alpine-based containers).   |
| /bin/sh   | Standard shell; basic scripting and interaction.             |
| Other     | Define a non-standard shell.                                 |
| Custom    | Enter a specific path for a custom shell or script executor. |

### Disconnecting

To end your session:

* Simply close the terminal tab.
* Or navigate away from the **Interactive Terminal** panel.

> ⚠️ All sessions are ephemeral and isolated—commands are executed live but not persisted unless saved or scripted accordingly.

***

### Volume Browser

The Volume Browser can be used to browse and managing files, and displays the contents of your container's filesystem starting at the root `/`. For each file or folder, you’ll see:

* **Name**: Showing the file name. You can click to open folders and view its content.
* **Size**: File size in bytes.
* **Last Modification**: Timestamp of the most recent change.
* **Actions**:
  * Download
  * Rename
  * Edit
  * Delete

Above the file table, you can:

* Select the component
* Refresh the current view
* Upload new files
* Create a new folder

<img src="/.gitbook/assets/image (10).png" alt=""/>

### Volume Usage Indicator

A usage bar displays how much of your allocated volume storage is currently used (e.g., `0.00 / 10.46 GB`). This helps you manage space and avoid capacity issues.

### Best Practises

* Use the browser for inspecting logs, temporary data, and config files.
* Avoid deleting system-critical files unless you know their purpose.
* Download a copy of important files before making changes.
* Clean up large unused files regularly to stay within your storage quota.

***

### Frequently Asked Questions

#### Can I upload folder?

Currently, you can upload individual files. To add folders, compress them into `.zip` or `.tar` archives before uploading.

***

#### Are changes made here permanent?

Yes. Any file modifications, uploads, or deletions are applied instantly to the container volume.

***

#### What if the view doesn't update?

Use the refresh icon above the file table or reload the node list if needed.
