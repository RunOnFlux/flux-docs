# Information

The **Information** tab provides an in-depth, technical snapshot of your app’s container, pulling metadata directly from the Docker engine. This view is ideal for debugging, verifying configuration, and ensuring operational integrity. Use this tab when validating your app’s runtime configuration or performing diagnostics.

**How To Access**

> **Applications → Management → Manage App → Information**

Open the **Management** tab in the **Applications** menu, select an application from **My Active Apps**, click **Manage**, and open the **Information** tab.

**Backend Selector**

At the top right you'll find a **FluxNode IP selector**, letting you choose which node you want to inspect or control. This allows you to manage individual node instances of your app. A **reload button** is also available to refresh the list of currently active FluxNodes running your application.

<img src="/.gitbook/assets/image (8).png" alt=""/>

***

#### What You'll See <a href="#what-youll-see" id="what-youll-see"></a>

* **Container Status**: Indicates if your container is running, paused, or stopped.
* **Start Time & Uptime**: Tracks when the container started and how long it has been active.
* **Docker Image Info**: Shows the image name and version used.
* **Networking Details**: Lists exposed ports and internal IP assignments.
* **Environment Variables**: Displays runtime configuration variables (e.g., API keys, environment flags).
* **Resource Limits**: Highlights CPU, memory, and swap limits applied by FluxCloud.
* **Mounted Volumes**: Shows persistent storage paths and mounted volumes.
* **Security Context**: Confirms if the container runs in a secure, non-privileged context.

<img src="/.gitbook/assets/image (7).png" alt=""/>
