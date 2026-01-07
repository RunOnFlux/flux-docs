# Control

The **Control** tab gives you full authority over the lifecycle of your deployed application. Whether you're performing routine maintenance, recovering from an issue, or testing changes, this tab is your command center for starting, stopping, pausing, redeploying, or removing the app.

#### How To Access

> **Applications → Management → Manage App → Control**

Open the **Management** tab in the **Applications** menu, select an application from **My Active Apps**, click **Manage**, then go to the **Local App Management** section and open the **Control** tab.

#### Backend Selector

At the top right you'll find a **FluxNode IP selector**, letting you choose which node you want to inspect or control. This allows you to manage individual node instances of your app. A **reload button** is also available to refresh the list of currently active FluxNodes running your application.

<img src="/.gitbook/assets/Image 29.10.2025 at 10.55.jpeg" alt=""/>

***

### Overview of Application Control

First, select the **type of application control** you want to use. The available options determine which control or monitoring tools you can access.

* **Manual Control:** Manage the application on one, several, or all servers by selecting specific IP addresses to control.
* **Local Control:** Manage the application on a **single server level**, based on the IP you selected in the backend selector at the header.
* **Global Control:** Manage the application on a **global level**, affecting all server instances running your application. Any action performed here applies to every server.

<img src="/.gitbook/assets/Image 30.10.2025 at 11.12.jpeg" alt=""/>

***

#### Control

General options to control running status of Application.

| Action                  | Description                                                                                                                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Start Application**   | Launches the application if it's currently stopped.                                                                                                                                |
| **Stop Application**    | Gracefully stops the running application and terminates its processes.                                                                                                             |
| **Restart Application** | Stops and immediately starts the app again — useful for applying configuration changes or recovering from temporary issues.                                                        |
| **Pause Application**   | Suspends all active processes within the app without shutting it down. This is like hitting a “pause button” on execution.                                                         |
| **Unpause Application** | Resumes previously paused processes and returns the app to its active running state.                                                                                               |
| **Remove Application**  | Uninstalls the app and deletes all associated data from the current selected FluxNode running the application. This will result in the app being deployed on a different FluxNode. |
| **Soft Reinstall**      | Restarts the app while preserving persistent data. Ideal for safe updates or config changes.                                                                                       |
| **Hard Reinstall**      | Wipes persistent data and redeploys the app from scratch. Use with caution — this is best for full resets or destructive testing.                                                  |

**Pro tip:** Always use **Soft Redeploy** unless you intentionally want to delete stored application state.

***

#### Monitoring

Controls Application Monitoring.

| Action                 | Description                                           |
| ---------------------- | ----------------------------------------------------- |
| **Start Monitoring**   | Start the monitoring process.                         |
| **Stop Monitoring**    | Stop the monitoring process.                          |
| **Stop & Delete Data** | Stop monitoring process, and delete all history data. |
