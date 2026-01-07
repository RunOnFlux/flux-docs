# Backup & Restore

The **Backup & Restore** tab allows you to create, download, and restore backups of your running application on the Flux Cloud. This ensures you can securely save your application state and recover it in the event of deletion, failure, or redeployment.

#### How To Access

> **Applications → Management → Manage App → Backup & Restore**

Open the **Management** tab in the **Applications** menu, select an application from **My Active Apps**, click **Manage**, and open the **Backup & Restore** tab.

#### Backend Selector

At the top right you'll find a **FluxNode IP selector**, letting you choose which node you want to inspect or control. This allows you to manage individual node instances of your app. A **reload button** is also available to refresh the list of currently active FluxNodes running your application.

<img src="/.gitbook/assets/Image 29.10.2025 at 10.55.jpeg" alt=""/>

***

### Overview

This tab includes two primary functions:

* **Backup:** Create and manage manual snapshots of your application's data container.
* **Restore:** Revert your app to a previously saved backup.

<img src="/.gitbook/assets/Image 29.10.2025 at 11.24.jpeg" alt=""/>

***

### Manual Backup Container Data

Use the **Backup** tab to select specific application components to back up.

#### Steps to Create a Backup:

1. Select the component(s) to backup&#x20;
2. Click **Create Backup**.
3. The new backup will appear in the table below with details like:
   * **Component Name**
   * **Created Date**
   * **Expiry Date**
   * **Size**
   * **Actions** (Download, Remove)

***

### Downloading a Backup

After creating a backup:

1. Select the desired applications component(s) you would like to backup.
2. Click **Download** to save the selected backups locally, or **Download All** to save all of them.

This is essential before canceling your subscription to ensure no data loss.

***

### Restore a Backup

To restore your app:

1. Go to the **Restore** tab at the top of the Backup/Restore section.
2. Select the Restore Method
   1. FluxDrive
   2. Remote URL
   3. Upload File
3. Select the component to restore to

> ⚠️ Restoring a backup will overwrite your current application state.

***

### Remove a Backup

To delete old or unused backups:

1. Use the **Select** option to choose specific backups.
2. Click **Remove All** to delete all backups listed.

> ⚠️ Deleted backups are **permanently removed** and cannot be recovered.

***

### Best Practices

* **Backup regularly**, especially before:
  * Major updates or changes
  * Cancelling a subscription
  * Migrating to another node
* **Download and archive** your backups to local or cloud storage.
* Label backups clearly with their purpose and creation date for easy restoration.

***

### Frequently Asked Questions

#### How long are backups retained?

Backup expiry dates are shown in the backup table. Make sure to download them before expiration.

***

#### Can I schedule automatic backups?

Currently, only **manual backups** are supported via the UI. For automated solutions, consider using the Flux API.

***

#### Is backup creation disruptive to my app?

No. Backups are created without affecting the app's uptime or running status.

***
