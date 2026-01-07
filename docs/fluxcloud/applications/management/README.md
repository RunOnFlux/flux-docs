# Management

The **Management** tab allows you to view and manage all of your deployed applications on FluxCloud.\
From here, you can quickly access the status, details, and expiration information of each application. It serves as your central dashboard for managing everything you've deployed.

***

### Overview of Tabs

At the top of the **Management** page, you'll find navigation tabs that help you filter your applications by current status:

* **My Active Apps** – Displays all applications that are currently running and valid.
* **My Expired Apps** – Displays applications that have reached the end of their subscription period. These can be quickly redeployed.

You can also:

* Use the search bar to find specific applications.
* Select how many entries to view per page.

***

### My Active Apps

The **My Active Apps** tab provides a focused view of all applications you currently have running on FluxCloud. This dashboard is ideal for monitoring live deployments, making real-time changes, and accessing detailed management controls.

<img src="/.gitbook/assets/Image 29.10.2025 at 10.52.jpeg" alt=""/>

Each app is displayed as a row entry by default, showing:

* **App Name**
* **Expiry Date**: When the current deployment expires (e.g., Jul 17th 2025, 05:36:45).
* **App Specification**:
  * **CPU** – In cores
  * **RAM** – In megabytes
  * **Storage** – In gigabytes
  * **Instances** – Number of running app instances (e.g., 3)
* An **extension arrow** to expand into a more in-depth view, including:
  * Application details
  * Component breakdown
  * Deployment location and IP information
* A **Manage** button to view or manage the application\
  → Read more about **Manage**
* A **Visit** button to access the deployed app’s web interface (if available)

***

### My Expired Apps

The **My Expired Apps** tab displays all applications that have reached the end of their subscription period and are no longer actively running on FluxCloud.

Even though these apps are no longer live, this section gives you continued access to valuable information and redeployment options.

<img src="/.gitbook/assets/Image 29.10.2025 at 10.52 (1).jpeg" alt=""/>

Each app is displayed as a row entry by default, showing:

* **App Name**
* **App Specification**:
  * **CPU** – In cores
  * **RAM** – In megabytes
  * **Storage** – In gigabytes
  * **Instances** – Number of running app instances (e.g., 3)
* **App Description**
* An **extension arrow** to expand into a more in-depth view, including:
  * Application details
  * Component information
* A **Redeploy** button to bring the application back online

#### Redeploy an App

To bring an expired application back online, follow these steps:

1. Click the **Redeploy** button for the application you want to revive, and confirm the redeployment in the confirmation popup.
2. You’ll be redirected to the **Register New App** screen. All your previous configuration settings—such as component definitions, resource allocations, geolocation preferences, and more—will be pre-filled exactly as before.
3. Review the configuration and make any updates if needed.
4. Proceed through the review steps:
   * Agree to the Terms of Service
   * Compute Registration Message
   * Register Application
   * Test Application Installation
   * Send Payment
