# Minecraft

This guide walks you through the process of **deploying, managing, and connecting to a Minecraft Java Edition Game Server** using FluxCloud. Whether you’re setting up a new server or maintaining an existing one, this page provides step-by-step instructions and key details for a seamless experience.

The FluxCloud Minecraft Java template is built on the popular `itzg/minecraft-server` image, which supports Vanilla, Paper, Spigot, Forge, Fabric and many other server types out of the box.

For more information on **Minecraft** visit: [https://www.minecraft.net](https://www.minecraft.net). For the server image documentation, see: [https://github.com/itzg/docker-minecraft-server](https://github.com/itzg/docker-minecraft-server).

> 💡 **Looking for Bedrock Edition?** Deploying a server for phones, consoles, or Windows 10/11 Bedrock clients uses a different template — see the [Minecraft Bedrock](./minecraftbedrock.md) guide.

***

### How To Install a MinecraftServer

#### **Steps**

1. **Access FluxCloud**

* Visit [cloud.runonflux.com](https://cloud.runonflux.com) and sign in or create an account.


2. **Find the Minecraft Server**

* Navigate to the **Marketplace → Games** tab, then locate the **Minecraft** tile and click **View Details**.

<img src="/.gitbook/assets/Screenshot 2025-11-03 133435.jpg" alt=""/>

3. **Select Server Configuration**

* Choose your preferred configuration, and click **Install Now** to continue.

<img src="/.gitbook/assets/Screenshot 2025-11-03 145852.jpg" alt=""/>

4. **Choose Subscription**

* Select your desired **subscription duration**.
* Agree to the **Terms of Use** and **Privacy Policy**, and click the blue **Continue** arrow at the bottom.

<img src="/.gitbook/assets/Screenshot 2025-11-03 145934.jpg" alt="" width="410"/>

5. **Choose Server Type**

* Select the type of **Minecraft server** you want to deploy, such as **Vanilla**, **Paper**, or another supported version.
* Enable **Show Advanced** to access additional configuration options, including **difficulty**, **game mode**, and other advanced settings.

<img src="/.gitbook/assets/Screenshot 2025-11-03 150332.jpg" alt="" width="563"/>

6. **Deployment Location**

* Configure whether you want your Minecraft server to deploy in specific geographic regions:
  * **Global (Recommended):** No geographic restrictions for best availability.
  * **Custom:** Restrict by continent or country.
* Click the blue **Continue** arrow to proceed.

<img src="/.gitbook/assets/Screenshot 2025-11-03 150414.jpg" alt="" width="483"/>

7. **Email Notifications**

* Optionally enter your email address to receive notifications about your game server, including:
  * When your application finishes launching.
  * When the primary server changes.
  * When your app expiration date is approaching.

8. **Launching the Application**

* Your application must be **signed and registered** on the Flux network.
  1. Click **Sign and Register**.
  2. Sign the message using the pop-up.
     * If you logged in via Google or Email, this step is completed automatically.

<img src="/.gitbook/assets/Screenshot 2025-11-03 150509.jpg" alt=""/>

9. **Complete Payment**&#x20;

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

<img src="/.gitbook/assets/Screenshot 2025-11-03 150549.jpg" alt="" width="494"/>

***

### Finding our your IP of the Game Server

Flux runs on a decentralized network, meaning your application is deployed across **three instances**.\
For game servers, a **Primary/Standby** setup is used — your game runs on the primary instance, while others are on standby for redundancy.

To find your server’s **primary IP address**:

1. Visit [**cloud.runonflux.com**](https://cloud.runonflux.com) and log in.
2. Go to **Applications → Management**.
3. Click the **Settings icon** on your Minecraft Server.
4. Open the **Instances** tab.
   * The **Primary IP address** is shown here.
   * You can also view geolocation details for all instances.

<img src="/.gitbook/assets/Screenshot 2025-11-03 142233.jpg" alt=""/>

To connect to your server:

1. In Minecraft, go to **Multiplayer**.
2. Click **Add Server**.
3. Copy the **Primary IP address** and paste it into the server address field.
4. Click **Done** and start playing!

#### Connecting via Domain Instead of IP

Every FluxCloud Marketplace game server is also reachable through its **application domain**. Flux's load balancer forwards traffic over DNS and is already configured with the correct game port, so you keep a stable address even when the primary instance changes due to failover.

* Find your app domain under **Applications → Management → Information**.
* Use it in the Minecraft **Server Address** field in place of the IP:

    ```
    your-app-domain.app.runonflux.io
    ```

Using the domain means your saved server entry continues to work automatically after any primary switch.

***

### Frequently Asked Questions

#### How can I update my game server to the latest version?

Your Minecraft server automatically checks for updates during startup and at regular intervals. If you’d like to update immediately, you can do so from your application’s management panel.

Simply open the **Applications → Management** section on FluxCloud, select your Minecraft server, and go to the **Control** tab. From there, choose **Local** and click **Restart Application**. This will redeploy your server with the latest available version.

***

#### What port does Minecraft Java use?

Minecraft Java Edition dedicated servers use TCP port `25565` for gameplay traffic. FluxCloud exposes this port automatically. When connecting by IP you must specify the port (`1.2.3.4:25565`); when connecting by the app domain the port is resolved by DNS and you do not need to append it.

***

#### What happens if the primary server goes down?

If your current primary server becomes unavailable or experiences downtime, one of the standby instances automatically takes over as the new primary after a short delay. All your game data remains intact, so you can continue right where you left off once the switch is complete. You can check which instance is currently the primary from your application’s management panel under the _Instances_ tab.

> 💡 **Tip:** If you connect via the app domain (`your-app-domain.app.runonflux.io`, no port suffix) instead of the raw IP, your client will keep reaching the correct primary automatically after a failover.

***

#### What if a new version of the game server is released and my server doesn't update automatically?

Your server normally updates itself automatically during startup or periodic checks. However, if it hasn’t updated yet, a simple restart from the management panel will trigger the update and ensure you’re running the latest version.
