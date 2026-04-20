# Valheim

This guide walks you through the process of **deploying, managing, and connecting to a Valheim Dedicated Server** using FluxCloud. Whether you're starting a fresh Viking expedition or continuing an existing world, this page provides step-by-step instructions and key details for a seamless experience.

The FluxCloud Valheim template is built on the popular `lloesche/valheim-server` image, which bundles automatic updates, world backups, and BepInEx mod support out of the box.

For more information on **Valheim** visit: [https://www.valheimgame.com](https://www.valheimgame.com). For the server image documentation, see: [https://github.com/lloesche/valheim-server-docker](https://github.com/lloesche/valheim-server-docker).

***

### How To Install a Valheim Server

#### **Steps**

1. **Access FluxCloud**

* Visit [cloud.runonflux.com](https://cloud.runonflux.com) and sign in or create an account.


2. **Find the Valheim Server**

* Navigate to the **Marketplace → Games** tab, then locate the **Valheim** tile and click **View Details**.

3. **Select Server Configuration**

* Choose your preferred configuration based on expected player count:
  * **Valheim 4GB** — 4GB RAM, 2 CPU cores, 10GB SSD. Ideal for small groups of friends (2–4 players).
  * **Valheim 6GB** — 6GB RAM, 2.5 CPU cores, 15GB SSD. Balanced for medium-sized groups (4–6 players).
  * **Valheim 8GB** — 8GB RAM, 4 CPU cores, 20GB SSD. Recommended for larger groups or heavily modded worlds (6–10 players).
* Click **Install Now** to continue.

4. **Provide Server Configuration Values**

* Fill in the required fields:
  * **SERVER_NAME** — the name displayed in the Valheim server browser. This is how other players will find your server if it is set to public.
  * **SERVER_PASS** — the password required to join your server (minimum 5 characters). Share this only with players you want to allow in.
* Optionally expand **Advanced Settings** to configure:
  * **WORLD_NAME** — the name of the world save file. Choose from `FluxWorld` (default), `Dedicated`, or `MyWorld`. This determines the filename used for your world data.

5. **Choose Subscription**

* Select your desired **subscription duration**.
* Agree to the **Terms of Use** and **Privacy Policy**, and click the blue **Continue** arrow at the bottom.

6. **Deployment Location**

* Configure whether you want your Valheim server to deploy in specific geographic regions:
  * **Global (Recommended):** No geographic restrictions for best availability.
  * **Custom:** Restrict by continent or country.
* Click the blue **Continue** arrow to proceed.

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

9. **Complete Payment**

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

When your Valheim server starts for the very first time, it will **download the dedicated server files and generate a new world** before accepting connections. This is normal and only happens on the first boot.

* Expect the initial setup to take **5–10 minutes** depending on node performance.
* During this time the server will not accept player connections.
* You can follow progress from **Applications → Management → Logs** in FluxCloud. Once you see `Game server connected` in the log, the server is ready.
* Subsequent restarts are fast — the server binaries and generated world are persisted on the volume and reloaded directly.

***

### Automatic Backups

The FluxCloud Valheim template ships with **automatic backups enabled**. The server image creates periodic backups of your world save and retains them for up to **3 days**.

Backups are stored on the persistent volume under `/config/backups/`. You can download backup files via the **Volume Browser** if you need to restore a previous world state.

***

### Finding the IP of Your Game Server

Flux runs on a decentralized network, meaning your application is deployed across **three instances**.\
For game servers, a **Primary/Standby** setup is used — your game runs on the primary instance, while others are on standby for redundancy.

To find your server's **primary IP address**:

1. Visit [**cloud.runonflux.com**](https://cloud.runonflux.com) and log in.
2. Go to **Applications → Management**.
3. Click the **Settings icon** on your Valheim Server.
4. Open the **Instances** tab.
   * The **Primary IP address** is shown here.
   * You can also view geolocation details for all instances.

To connect to your server from the Valheim client:

1. Launch **Valheim** and click **Start Game**, then select your character.
2. Click **Join Game** and switch to the **Join IP** tab.
3. Enter your **Primary IP address** followed by the game port — for example:

    ```
    1.2.3.4:2456
    ```

4. Enter the **server password** when prompted.

> 💡 **Tip:** You can also find your server in the **Community Servers** tab of the in-game server browser by searching for your `SERVER_NAME`, since the template sets `SERVER_PUBLIC=true` by default.

#### Connecting via Domain Instead of IP

Every FluxCloud Marketplace game server is also reachable through its **application domain**. Flux's load balancer forwards traffic over DNS and is already configured with the correct game port, so you keep a stable address even when the primary instance changes due to failover.

* Find your app domain under **Applications → Management → Information**.
* Use it in the Valheim client in place of the IP address. The game port is already baked into the domain's DNS routing, so you do **not** need to append `:2456`:

    ```
    your-app-domain.app.runonflux.io
    ```

Using the domain means you never have to update your saved server entry when the primary switches.

***

### Adjusting Server Settings

Basic server settings (name, password, world name) are configured during deployment through the environment variables described above. To change them after deployment:

1. Go to **Applications → Management** on [cloud.runonflux.com](https://cloud.runonflux.com) and select your Valheim app.
2. Click the **Settings icon** and open the **Specifications** tab.
3. Make any changes you need on this tab and click **Update**.
4. Navigate to the **Component** tab — here you will find the **environment variables** (`SERVER_NAME`, `SERVER_PASS`, `WORLD_NAME`). Edit the values you want to change.
5. Click **Review** in the top-right corner to review your changes.
6. Confirm and **sign the update** — the update is registered on the network **free of charge**.
7. Allow **several minutes** for the update to propagate across the Flux network and reach the nodes running your server. Once propagation is complete, your server will restart with the new settings.

For advanced server configuration (world modifiers, combat difficulty, resource rates), you can edit the server config files through the **Volume Browser**:

1. Click the **Settings icon**, open the **Secure Shell** tab and scroll to **Volume Browser**.
2. Config and world data live under:

    ```
    /config/
    ```

3. Save your changes, then restart the application from the **Control** tab.

> ⚠️ **Important:** Invalid configuration values can prevent the server from starting. Back up any file before editing and revert if the server fails to boot.

***

### Managing the World File

Your world saves live on the persistent volume at:

```
/config/worlds_local/
```

Each world consists of a `.db` and `.fwl` file pair. You can:

* **Download a backup** via the Volume Browser before risky changes or major game updates.
* **Upload an existing world** from a single-player game to continue your adventure — drop both world files into `/config/worlds_local/`. If the filename doesn't match the current `WORLD_NAME`, update the environment variable: open your application settings, go to the **Specifications** tab and click **Update**, then navigate to the **Component** tab and change `WORLD_NAME` to match. Click **Review** in the top-right corner, confirm, and allow several minutes for the update to propagate.
* **Roll back** by replacing the current world files with a backup from `/config/backups/` and restarting the application from the **Control** tab.

***

### Installing Mods (BepInEx)

The `lloesche/valheim-server` image includes built-in support for **BepInEx**, the most popular Valheim mod framework. Mods are installed into the persistent volume and survive restarts.

1. Open **Applications → Management** on [cloud.runonflux.com](https://cloud.runonflux.com), select your Valheim app, click the **Settings icon** and open the **Secure Shell** tab.
2. Navigate to the **Volume Browser** and open:

    ```
    /config/bepinex/plugins/
    ```

3. Upload your mod `.dll` files (downloaded from [Thunderstore](https://thunderstore.io/c/valheim/) or [Nexus Mods](https://www.nexusmods.com/valheim)) into this directory.
4. Mod configuration files can be found and edited under:

    ```
    /config/bepinex/config/
    ```

5. Restart the server from **Control → Local → Restart Application**.

> ⚠️ **Important:** All players connecting to a modded server must have the same mods installed locally. After any mod change, restart the server for it to take effect. Mods may break after a Valheim game update — wait for mod authors to release compatible versions before updating.

***

### Frequently Asked Questions

#### Why can't I connect right after deployment?

The first launch downloads the Valheim dedicated server and generates a world before opening the game port. This usually takes 5–10 minutes. Watch the container logs from **Applications → Management → Logs** and wait for the `Game server connected` message before attempting to connect.

***

#### What ports does Valheim use?

Valheim uses UDP ports `2456` and `2457` for gameplay traffic. FluxCloud exposes these ports automatically. When connecting by IP you must specify port `2456` (e.g. `1.2.3.4:2456`); when connecting by the app domain the port is resolved by DNS and you do not need to append it.

***

#### How do I change the server password?

Open your application settings, go to the **Specifications** tab and click **Update**, then navigate to the **Component** tab and change the `SERVER_PASS` value (minimum 5 characters). Click **Review** in the top-right corner and confirm the update. Allow several minutes for the change to propagate across the network.

***

#### What happens if the primary server goes down?

If your current primary server becomes unavailable or experiences downtime, one of the standby instances automatically takes over as the new primary after a short delay. Your world saves, backups, and mod configuration are preserved on the persistent volume, so the game resumes where you left off once the switch is complete. You can check which instance is currently the primary from your application's management panel under the **Instances** tab.

> 💡 **Tip:** If you connect via the app domain (`your-app-domain.app.runonflux.io`, no port suffix) instead of the raw IP, your client will keep reaching the correct primary automatically after a failover.

***

#### Can I use my own world file?

Yes. Upload both the `.db` and `.fwl` files for your world to `/config/worlds_local/` via the Volume Browser. If the filename doesn't match the current `WORLD_NAME`, update the environment variable: open your application settings, go to the **Specifications** tab → **Update** → **Component** tab, change `WORLD_NAME` to match (without extension), then click **Review** and confirm. Allow several minutes for the update to propagate across the network.

***

#### Can I install mods?

Yes — see the **Installing Mods (BepInEx)** section above. The server image has built-in BepInEx support. Upload mod files to `/config/bepinex/plugins/` via the Volume Browser.

***

#### How can I update my game server to the latest version?

The `lloesche/valheim-server` image automatically checks for and downloads the latest Valheim dedicated server build on every startup. To update immediately, open **Applications → Management**, select your Valheim server, go to the **Control** tab, choose **Local**, and click **Restart Application**.
