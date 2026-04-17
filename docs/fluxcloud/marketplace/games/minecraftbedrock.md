# Minecraft Bedrock

This guide walks you through the process of **deploying, managing, and connecting to a Minecraft Bedrock Edition Game Server** using FluxCloud. Bedrock Edition is the version of Minecraft that runs on phones, tablets, consoles, and Windows 10/11 — it is **not** cross-compatible with Minecraft Java Edition servers.

The FluxCloud Minecraft Bedrock template is built on the popular `itzg/minecraft-bedrock-server` image, which wraps the official Mojang Bedrock dedicated server and keeps it up to date on every restart.

For more information on **Minecraft** visit: [https://www.minecraft.net](https://www.minecraft.net). For the server image documentation, see: [https://github.com/itzg/docker-minecraft-bedrock-server](https://github.com/itzg/docker-minecraft-bedrock-server).

> 💡 **Looking for Java Edition?** If your players are on desktop (Java), you want the [Minecraft Java](./minecraft.md) guide instead.

***

### How To Install a Minecraft Bedrock Server

#### **Steps**

1. **Access FluxCloud**

* Visit [cloud.runonflux.com](https://cloud.runonflux.com) and sign in or create an account.


2. **Find the Minecraft Bedrock Server**

* Navigate to the **Marketplace → Games** tab, then locate the **Minecraft Bedrock** tile and click **View Details**.

<img src="/.gitbook/assets/Screenshot 2025-11-03 133435.jpg" alt=""/>

3. **Select Server Configuration**

* Choose your preferred configuration, and click **Install Now** to continue.

4. **Choose Subscription**

* Select your desired **subscription duration**.
* Agree to the **Terms of Use** and **Privacy Policy**, and click the blue **Continue** arrow at the bottom.

5. **Deployment Location**

* Configure whether you want your Minecraft Bedrock server to deploy in specific geographic regions:
  * **Global (Recommended):** No geographic restrictions for best availability.
  * **Custom:** Restrict by continent or country.
* Click the blue **Continue** arrow to proceed.

6. **Email Notifications**

* Optionally enter your email address to receive notifications about your game server, including:
  * When your application finishes launching.
  * When the primary server changes.
  * When your app expiration date is approaching.

7. **Launching the Application**

* Your application must be **signed and registered** on the Flux network.
  1. Click **Sign and Register**.
  2. Sign the message using the pop-up.
     * If you logged in via Google or Email, this step is completed automatically.

8. **Complete Payment**

* Choose your payment method:
  * **Fiat:** Stripe or PayPal
  * **Crypto:** FLUX coin (5% discount)
* Payment is monitored automatically. Once confirmed, your application will be deployed, and a blue **Manage** button will appear—directing you to your application’s management panel.

> ⚠️ **Important: FLUX Payments**
>
> FLUX payments are **only accepted via the FLUX Mainnet,** not through any of our EVM tokens.
>
> We **ALSO** strongly recommend **not sending FLUX payments from exchanges**, as:
>
> * Transactions or withdrawals may not complete within the required 30-minute window.
> * Many exchanges do not support adding a **MEMO**, which is required for proper payment processing.

***

### Finding the IP of Your Game Server

Flux runs on a decentralized network, meaning your application is deployed across **three instances**.\
For game servers, a **Primary/Standby** setup is used — your game runs on the primary instance, while others are on standby for redundancy.

To find your server’s **primary IP address**:

1. Visit [**cloud.runonflux.com**](https://cloud.runonflux.com) and log in.
2. Go to **Applications → Management**.
3. Click the **Settings icon** on your Minecraft Bedrock Server.
4. Open the **Instances** tab.
   * The **Primary IP address** is shown here.
   * You can also view geolocation details for all instances.

To connect to your server from a Bedrock client (mobile, console, or Windows 10/11):

1. Launch **Minecraft** and tap/click **Play → Servers**.
2. Scroll to the bottom of the server list and choose **Add Server**.
3. Fill in the fields:
   * **Server Name:** any label you like (e.g. `Flux Bedrock`).
   * **Server Address:** your **Primary IP address**.
   * **Port:** `19132`.
4. Save and then tap/click the server to connect.

> 💡 **Tip:** Bedrock uses **UDP port `19132`**. If your client has a separate **Port** field, enter `19132` there — do not append it to the address field.

#### Connecting via Domain Instead of IP

Every FluxCloud Marketplace game server is also reachable through its **application domain**. Flux's load balancer forwards traffic over DNS and is already configured with the correct game port, so you keep a stable address even when the primary instance changes due to failover.

* Find your app domain under **Applications → Management → Information**.
* In the Bedrock **Add Server** dialog, enter the domain in the **Server Address** field. Bedrock's **Port** field already defaults to `19132`, and the domain's DNS routing targets that same port:

    ```
    your-app-domain.app.runonflux.io
    ```

Using the domain means your saved server entry continues to work automatically after any primary switch.

***

### Adjusting Server Settings

Bedrock server settings (level name, game mode, difficulty, max players, whitelist) live in a single config file on the persistent volume.

1. Open **Applications → Management** on [cloud.runonflux.com](https://cloud.runonflux.com), select your Minecraft Bedrock app, click the **Settings icon** and open the **Secure Shell** tab.
2. Scroll to the **Volume Browser** and locate:

    ```
    /data/server.properties
    ```

3. Edit the values you want to change (for example `server-name`, `gamemode`, `difficulty`, `max-players`, `allow-cheats`), then save.
4. Open the **Control** tab, select **Global**, and click **Restart Application** so the new settings take effect.

> ⚠️ **Important:** Invalid configuration values can prevent the server from starting. Back up the file before editing and revert if the server fails to boot.

***

### Managing World Files

Bedrock worlds live on the persistent volume at:

```
/data/worlds/
```

Each world is a directory. You can:

* **Download a backup** via the Volume Browser before risky changes or major game updates.
* **Upload an existing world** from a single-player game or another server — drop the world folder into `/data/worlds/`, then update `level-name` in `server.properties` to match the folder name and restart the application.
* **Roll back** by replacing the current world folder with a backup and restarting the application from the **Control** tab.

***

### Frequently Asked Questions

#### What ports does Minecraft Bedrock use?

The Bedrock dedicated server listens on UDP port `19132` (IPv4). FluxCloud exposes this port automatically. In the in-game **Add Server** dialog, enter your server’s IP or app domain in **Server Address** and `19132` in **Port**.

***

#### Can Java and Bedrock players join the same server?

No — Java and Bedrock use different protocols and are not natively cross-compatible. If you need cross-play, deploy the Java server and install a community bridge plugin (e.g. Geyser + Floodgate) on it. The FluxCloud Bedrock template runs the vanilla Bedrock server and only accepts Bedrock clients.

***

#### What happens if the primary server goes down?

If your current primary server becomes unavailable or experiences downtime, one of the standby instances automatically takes over as the new primary after a short delay. Your worlds and configuration are preserved on the persistent volume, so the game resumes where you left off once the switch is complete. You can check which instance is currently the primary from your application’s management panel under the **Instances** tab.

> 💡 **Tip:** If you connect via the app domain (`your-app-domain.app.runonflux.io`) with port `19132` instead of the raw IP, your client will keep reaching the correct primary automatically after a failover.

***

#### Can I use my own world file?

Yes. Upload your world directory to `/data/worlds/` via the Volume Browser, then update `level-name` in `server.properties` to match the directory name and restart the application from the **Control** tab.

***

#### How can I update my game server to the latest version?

The `itzg/minecraft-bedrock-server` image pulls the latest official Bedrock dedicated server build on every startup. To update immediately, open **Applications → Management**, select your Minecraft Bedrock server, go to the **Control** tab, choose **Global**, and click **Restart Application**.
