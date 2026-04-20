# Terraria

This guide walks you through the process of **deploying, managing, and connecting to a Terraria Game Server** using FluxCloud. Whether you're setting up a new 2D sandbox world or maintaining an existing one, this page provides step-by-step instructions and key details for a seamless experience.

The FluxCloud Terraria template is built on the popular `ryshe/terraria:tshock-latest` image, which ships **TShock** — a server mod that adds admin tooling, permissions, and a REST API on top of vanilla Terraria.

For more information on **Terraria** visit: [https://terraria.org](https://terraria.org). For TShock documentation, see: [https://tshock.readme.io](https://tshock.readme.io).

***

### How To Install a Terraria Server

#### **Steps**

1. **Access FluxCloud**

* Visit [cloud.runonflux.com](https://cloud.runonflux.com) and sign in or create an account.


2. **Find the Terraria Server**

* Navigate to the **Marketplace → Games** tab, then locate the **Terraria** tile and click **View Details**.

3. **Select Server Configuration**

* Choose your preferred configuration based on expected player count:
  * **8 Slots** — 1GB RAM, 1 CPU core, 5GB SSD. Ideal for small groups of friends.
  * **16 Slots** — 2GB RAM, 2 CPU cores, 5GB SSD. Balanced for medium-sized groups.
  * **32 Slots** — 4GB RAM, 4 CPU cores, 10GB SSD. Recommended for larger communities or modded worlds.
* Click **Install Now** to continue.

4. **Choose Subscription**

* Select your desired **subscription duration**.
* Agree to the **Terms of Use** and **Privacy Policy**, and click the blue **Continue** arrow at the bottom.

5. **Deployment Location**

* Configure whether you want your Terraria server to deploy in specific geographic regions:
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
* Payment is monitored automatically. Once confirmed, your application will be deployed, and a blue **Manage** button will appear—directing you to your application's management panel.

> ⚠️ **Important: FLUX Payments**
>
> FLUX payments are **only accepted via the FLUX Mainnet,** not through any of our EVM tokens.
>
> We **ALSO** strongly recommend **not sending FLUX payments from exchanges**, as:
>
> * Transactions or withdrawals may not complete within the required 30-minute window.
> * Many exchanges do not support adding a **MEMO**, which is required for proper payment processing.

***

### First Launch — Allow Time for World Generation

When your Terraria server starts for the very first time, it will **auto-generate a large world** (`FluxWorld.wld`) before accepting connections. This is normal and only happens on the first boot.

* Expect world generation to take **a few minutes** (typically 2–5 minutes depending on node performance).
* During this time the server will not accept player connections.
* You can follow progress from **Applications → Management → Logs** in FluxCloud. Once you see `Server started` / `Type 'help' for a list of commands` in the log, the server is ready.
* Subsequent restarts are fast — the generated world is persisted on the volume and reloaded directly.

***

### Finding the IP of Your Game Server

Flux runs on a decentralized network, meaning your application is deployed across **three instances**.\
For game servers, a **Primary/Standby** setup is used — your game runs on the primary instance, while others are on standby for redundancy.

To find your server's **primary IP address**:

1. Visit [**cloud.runonflux.com**](https://cloud.runonflux.com) and log in.
2. Go to **Applications → Management**.
3. Click the **Settings icon** on your Terraria Server.
4. Open the **Instances** tab.
   * The **Primary IP address** is shown here.
   * You can also view geolocation details for all instances.

To connect to your server from the Terraria client:

1. Launch **Terraria** and click **Multiplayer → Join via IP**.
2. Select your character and world.
3. Enter your **Primary IP address** when prompted.
4. Enter the **port** `7777` when prompted (this is the Terraria default).
5. Enter the server password if one has been configured (see below).

#### Connecting via Domain Instead of IP

Every FluxCloud Marketplace game server is also reachable through its **application domain**. Flux's load balancer forwards traffic over DNS and is already configured with the correct game port, so you keep a stable address even when the primary instance changes due to failover.

* Find your app domain under **Applications → Management → Information**.
* Use it in the Terraria client in place of the IP address. The game port is already baked into the domain's DNS routing, so you do **not** need to append `:7777`:

    ```
    your-app-domain.app.runonflux.io
    ```

Using the domain means you never have to update your saved server entry when the primary switches.

***

### Adjusting Server Settings (TShock)

The TShock server ships with its own configuration file, which lets you customize the server name, password, max players, difficulty, and many gameplay options.

Settings are edited through the **Volume Browser**:

1. Go to **Applications → Management** on [cloud.runonflux.com](https://cloud.runonflux.com) and select your Terraria app.
2. Click the **Settings icon**, open the **Secure Shell** tab and scroll to **Volume Browser**.
3. Open the TShock configuration file:

    ```
    /root/.local/share/Terraria/Worlds/tshock/config.json
    ```

4. Common fields you may want to change:
   * `"ServerName"` — the name displayed in your in-game server info.
   * `"ServerPassword"` — the password required for players to join.
   * `"MaxSlots"` — the maximum number of concurrent players (keep aligned with your chosen plan).
   * `"DisableHardmode"`, `"PvPMode"`, `"InvasionMultiplier"` — gameplay tuning.
5. Save your changes, then open the **Control** tab, select **Local**, and click **Restart Application** so the new settings take effect.

> ⚠️ **Important:** Be cautious when modifying values in `config.json`. Invalid JSON will prevent the server from starting. If that happens, restore the file to a working state or redeploy.

***

### Setting an Admin (TShock Superadmin)

TShock uses a first-connect registration flow to assign the server owner:

1. Connect to your server in-game using the steps above.
2. In the chat box, run:

    ```
    /setup <code>
    ```

    The `<code>` is printed in the **Applications → Management → Logs** on first launch (look for a line beginning with `To gain access to admin functionality`).
3. Then register your account and grant yourself the `superadmin` group:

    ```
    /register <password>
    /login <password>
    /user group "<yourname>" superadmin
    ```

4. Once you are a superadmin, you can run any TShock command in chat (kicks, bans, item spawning, teleports, world backups, etc.).

***

### Managing the World File

Your world save lives on the persistent volume at:

```
/root/.local/share/Terraria/Worlds/FluxWorld.wld
```

You can download a backup via the **Volume Browser**, or upload an existing `.wld` file from a single-player game to continue your adventure on the server. After uploading or replacing the world file, restart the application from the **Control** tab.

***

### Frequently Asked Questions

#### Why can't I connect right after deployment?

The first launch generates a fresh Terraria world before opening the port. This usually takes 2–5 minutes. Watch the container logs from **Applications → Management → Logs** and wait for the `Server started` message before attempting to connect.

***

#### What port does Terraria use?

The default Terraria port is `7777`. FluxCloud exposes this port automatically. When connecting by IP you must specify the port; when connecting by the app domain the port is still `7777`.

***

#### How do I change the server password?

Edit `"ServerPassword"` inside `tshock/config.json` from the Volume Browser, save, then restart the application from **Control → Local → Restart Application**.

***

#### What happens if the primary server goes down?

If your current primary server becomes unavailable or experiences downtime, one of the standby instances automatically takes over as the new primary after a short delay. Your world save and TShock configuration are preserved on the persistent volume, so the game resumes where you left off once the switch is complete. You can check which instance is currently the primary from your application's management panel under the **Instances** tab.

> 💡 **Tip:** If you connect via the app domain (`your-app-domain.app.runonflux.io`, no port suffix) instead of the raw IP, your client will keep reaching the correct primary automatically after a failover.

***

#### Can I use my own world file?

Yes. Upload your `.wld` file to `/root/.local/share/Terraria/Worlds/` via the Volume Browser and rename it to `FluxWorld.wld`, then restart the application. If your world file has a different name and you prefer to keep it, you can update the `WORLD_FILENAME` environment variable to match: open your application settings, go to the **Specifications** tab and click **Update**, then navigate to the **Component** tab and change the `WORLD_FILENAME` value. Click **Review** in the top-right corner, confirm, and allow several minutes for the update to propagate across the network.

***

#### Can I install mods (tModLoader)?

The FluxCloud Terraria template runs the **vanilla Terraria server with TShock**. tModLoader is a separate server binary and is not part of this image. If you need tModLoader, you can deploy a custom app using the **Register New App** flow with a tModLoader-compatible Docker image.

***

#### How can I update my game server to the latest version?

Your Terraria server automatically pulls the latest TShock release during startup. If you'd like to update immediately, open the **Applications → Management** section, select your Terraria server, go to the **Control** tab, choose **Local**, and click **Restart Application**.
