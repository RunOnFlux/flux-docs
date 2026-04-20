# Don't Starve Together

This guide walks you through the process of **deploying, managing, and connecting to a Don't Starve Together (DST) Game Server** using FluxCloud. Whether you're setting up a new server or maintaining an existing one, this page provides step-by-step instructions and key details for a seamless experience.

For more information on **Don't Starve Together Dedicated Servers** visit: [https://www.klei.com/games/dont-starve-together](https://www.klei.com/games/dont-starve-together)

***

### Before You Begin — Get Your Klei Cluster Token

Don't Starve Together requires a **Klei cluster token** to authenticate your dedicated server with Klei's servers. You'll need this token during deployment, so generate it first:

1. Visit [accounts.klei.com](https://accounts.klei.com) and sign in with the Klei account that owns DST.
2. Go to **Game Servers → Add New Server**.
3. Give your server a name and click **Add New Server**.
4. Click **View** next to the server you just created to reveal the token.
5. Copy the full token string — you'll paste it into the `CLUSTER_TOKEN` field during deployment.

> ⚠️ **Keep your cluster token private.** Anyone with this token can host a server that appears as yours. You can revoke and regenerate tokens anytime from the same Klei page.

***

### How To Install a Don't Starve Together Server

#### **Steps**

1. **Access FluxCloud**

* Visit [cloud.runonflux.com](https://cloud.runonflux.com) and sign in or create an account.


2. **Find the Don't Starve Together Server**

* Navigate to the **Marketplace → Games** tab, then locate the **Don't Starve Together** tile and click **View Details**.

3. **Select Server Configuration**

* Choose your preferred configuration based on expected player count:
  * **DST 1.5GB** — good for small groups (up to \~4 players).
  * **DST 2GB** — balanced for medium groups (up to \~8 players).
  * **DST 4GB** — recommended for larger groups or heavily modded worlds (up to \~16 players).
* Click **Install Now** to continue.

4. **Choose Subscription**

* Select your desired **subscription duration**.
* Agree to the **Terms of Use** and **Privacy Policy**, and click the blue **Continue** arrow at the bottom.

5. **Provide Server Configuration Values**

* During deployment you will be asked to fill in the server parameters:
  * **CLUSTER\_TOKEN** *(required)* — paste the Klei cluster token you generated above.
  * **CLUSTER\_NAME** *(required)* — the name displayed in the in-game server browser (e.g. `My DST Server`).
  * **SHARD\_NAME** *(optional, advanced)* — defaults to `Master`. Leave as is for a single-shard server.
  * **MAX\_PLAYERS** *(optional, advanced)* — defaults to `6`. Adjust to fit the plan you chose.

6. **Deployment Location**

* Configure whether you want your DST server to deploy in specific geographic regions:
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

### First Launch — Allow Time for the Server to Download

When your DST server starts for the very first time, the container downloads the full **Don't Starve Together dedicated server files from Steam** via SteamCMD before it can accept connections. This is normal and only happens on first launch (or after a major game update).

* Expect the initial download and world generation to take **several minutes** (typically 5–15 minutes depending on network conditions and node performance).
* During this time the server will **not appear** in the in-game browser and cannot be joined.
* You can follow progress by opening **Applications → Management → Logs** in FluxCloud and watching the container output. Once you see the `Sim paused` / `Starting Master server` / `listening on port` messages, the server is ready.
* Subsequent restarts are much faster — Steam data is cached on the persistent volume.

***

### Finding the IP of Your Game Server

Flux runs on a decentralized network, meaning your application is deployed across **three instances**.\
For game servers, a **Primary/Standby** setup is used — your game runs on the primary instance, while others are on standby for redundancy.

To find your server's **primary IP address**:

1. Visit [**cloud.runonflux.com**](https://cloud.runonflux.com) and log in.
2. Go to **Applications → Management**.
3. Click the **Settings icon** on your Don't Starve Together Server.
4. Open the **Instances** tab.
   * The **Primary IP address** is shown here.
   * You can also view geolocation details for all instances.

To connect to your server from the DST client:

* Launch **Don't Starve Together** and click **Browse Games**.
* Open the **Servers** tab and search for your `CLUSTER_NAME`, **or** add your server directly by IP:
  * Click **Dedicated** / **Add Dedicated Server**.
  * Enter your **Primary IP** with port `11000` (e.g. `123.45.67.89:11000`).
* Enter the server password when prompted (see below for how to retrieve or change it).

#### Connecting via Domain Instead of IP

Every FluxCloud Marketplace game server is also reachable through its **application domain**. Flux's load balancer forwards UDP traffic over DNS and is already configured with the correct game port, so you do **not** need to append a port when using the domain — this keeps working even if the primary instance changes due to failover.

* Find your app domain under **Applications → Management → Information**.
* Use it in the DST client in place of the IP, without specifying a port:

    ```
    your-app-domain.app.runonflux.io
    ```

***

### Managing the Auto-Generated Server Password

The DST server ships with an **auto-generated password** on first launch. This password protects your server from public join attempts. You'll need to retrieve it to share with friends — or change it to something easier to remember.

Both actions happen through the **Volume Browser**:

1. Go to **Applications → Management** on [cloud.runonflux.com](https://cloud.runonflux.com) and select your DST app.
2. Click the **Settings icon**, open the **Secure Shell** tab and scroll to **Volume Browser**.
3. Navigate into the persistent volume and open:

    ```
    /home/dst/dst_server/DoNotStarveTogether/Cluster_1/cluster.ini
    ```

4. Locate the `[GAMEPLAY]` section and look for the `password =` line. This is the current server password.
5. To change it, click **Edit**, replace the value with your own password, and save.
6. Open the **Control** tab, select **Local**, and click **Restart Application** so the new password takes effect.

> ⚠️ **Important:** Be cautious when modifying values in `cluster.ini`. Incorrect changes may prevent your server from starting. If that happens, restore the file to a working state or redeploy.

***

### Adjusting Other Server Settings

Most gameplay and world options live in two files on the same persistent volume:

* `cluster.ini` — cluster-wide settings: server name, password, max players, PvP, game mode, intention (cooperative / madness / social / competitive).
* `DoNotStarveTogether/Cluster_1/Master/server.ini` — shard-specific settings for the Master shard (port, bind IP, etc.). Most users do **not** need to change this.

Open either file from the **Volume Browser**, edit the values, save, and restart the application from the **Control** tab to apply.

World customisation (season length, resource regrowth, boss presets) is controlled by `worldgenoverride.lua` in the same `Master` folder. Delete the world save (`save/` directory) if you want the next restart to regenerate the world with your new settings.

***

### Frequently Asked Questions

#### Why can't I see my server in the in-game browser right after deployment?

The first launch has to download the dedicated server binaries from Steam and generate the world. This typically takes 5–15 minutes. Watch the container logs from **Applications → Management → Logs** and wait for the `Sim paused` / `listening on port` messages. After that, the server will register with Klei and appear in the browser.

***

#### Where is the server password stored, and how do I change it?

The password is auto-generated into `cluster.ini` under the `[GAMEPLAY]` section on first launch. You can view or change it from **Secure Shell → Volume Browser → `DoNotStarveTogether/Cluster_1/cluster.ini`**. Restart the app from the **Control** tab after saving.

***

#### Do I really need a Klei cluster token? Can I skip it?

Yes, the token is **required**. DST dedicated servers must authenticate with Klei to appear online, display Steam avatars, and allow connections. Generate one for free at [accounts.klei.com](https://accounts.klei.com) under **Game Servers**.

***

#### How can I update my game server to the latest version?

Your DST server automatically checks for updates from Steam during startup. If you'd like to update immediately, open the **Applications → Management** section, select your DST server, go to the **Control** tab, choose **Local**, and click **Restart Application**. This will pull the latest dedicated server files on the next boot.

***

#### What happens if the primary server goes down?

If your current primary server becomes unavailable or experiences downtime, one of the standby instances automatically takes over as the new primary after a short delay. Your world save and configuration are preserved on the persistent volume, so the game resumes where you left off once the switch is complete. You can check which instance is currently the primary from your application's management panel under the **Instances** tab.

***

#### Can I enable the Caves shard?

The default deployment runs a single **Master** shard, which is enough for most groups. Running Caves requires a second shard process and extra ports, which is not part of this template. Advanced users can edit `cluster.ini` to set `shard_enabled = true` and add a second shard manually, but expect to do additional container-level configuration.

***

#### Can I install mods?

Yes. Add your desired Steam Workshop mod IDs to `DoNotStarveTogether/Cluster_1/Master/modoverrides.lua` via the Volume Browser, then restart the app. Mods are downloaded on the next startup — allow extra time on first launch after adding them.
