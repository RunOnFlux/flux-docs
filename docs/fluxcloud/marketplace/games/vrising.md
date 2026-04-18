# V Rising

This guide walks you through the process of **deploying, managing, and connecting to a V Rising Dedicated Server** using FluxCloud. Whether you're starting a fresh vampire clan or continuing an existing castle, this page provides step-by-step instructions and key details for a seamless experience.

The FluxCloud V Rising template is built on the popular `trueosiris/vrising` image, which bundles SteamCMD, automatic server updates, persistent world saves, and a configuration layout that survives game patches.

For more information on **V Rising** visit: [https://playvrising.com](https://playvrising.com). For the server image documentation, see: [https://github.com/TrueOsiris/docker-vrising](https://github.com/TrueOsiris/docker-vrising).

***

### How To Install a V Rising Server

#### **Steps**

1. **Access FluxCloud**

* Visit [cloud.runonflux.com](https://cloud.runonflux.com) and sign in or create an account.


2. **Find the V Rising Server**

* Navigate to the **Marketplace → Games** tab, then locate the **V Rising** tile and click **View Details**.

3. **Select Server Configuration**

* Choose your preferred configuration based on expected player count:
  * **20 Slots** — 4GB RAM, 2 CPU cores, 10GB SSD. Ideal for small groups of friends or duo/clan PvE play.
  * **30 Slots** — 6GB RAM, 3 CPU cores, 15GB SSD. Balanced for medium-sized communities running standard PvP or PvE.
  * **40 Slots** — 8GB RAM, 4 CPU cores, 20GB SSD. Recommended for large communities, full PvP servers, and worlds with heavy castle building.
* Click **Install Now** to continue.

4. **Provide Server Configuration Values**

* Fill in the required field:
  * **SERVERNAME** — the name displayed in the V Rising server browser. This is how other players will find your server when listed on Steam/EOS.

5. **Choose Subscription**

* Select your desired **subscription duration**.
* Agree to the **Terms of Use** and **Privacy Policy**, and click the blue **Continue** arrow at the bottom.

6. **Deployment Location**

* Configure whether you want your V Rising server to deploy in specific geographic regions:
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

When your V Rising server starts for the very first time, the container uses **SteamCMD to download the full V Rising Dedicated Server** and then generates a fresh world before opening the game port. This is normal and only happens on the first boot.

* Expect the initial download and world generation to take **up to 10 minutes** depending on node bandwidth and disk speed.
* During this time the server will not accept player connections and will not appear in the in-game server browser.
* You can follow progress from **Applications → Management → Logs** in FluxCloud. Once you see the server reporting `Server Started` / listening on the game port, the server is ready.
* Subsequent restarts are fast — the binaries and your world are persisted on the volume and only patched when Stunlock releases an update (the image checks for updates via Steam on every boot).

***

### Finding the IP of Your Game Server

Flux runs on a decentralized network, meaning your application is deployed across **three instances**.\
For game servers, a **Primary/Standby** setup is used — your game runs on the primary instance, while others are on standby for redundancy.

To find your server's **primary IP address**:

1. Visit [**cloud.runonflux.com**](https://cloud.runonflux.com) and log in.
2. Go to **Applications → Management**.
3. Click the **Settings icon** on your V Rising Server.
4. Open the **Instances** tab.
   * The **Primary IP address** is shown here.
   * You can also view geolocation details for all instances.

To connect to your server from the V Rising client:

1. Launch **V Rising** and click **Play**, then choose **Online Play**.
2. Open the **Servers** tab and switch to the **Direct Connect** sub-tab (or click the **Direct Connect** button).
3. Enter your **Primary IP address** followed by the query port — for example:

    ```
    1.2.3.4:9877
    ```

4. Enter the **server password** if one has been configured (see *Adjusting Server Settings* below).

> 💡 **Tip:** You can also find your server in the **Online Play → Servers** browser by searching for your `SERVERNAME`, since the template lists the server on Steam and EOS by default.

#### Connecting via Domain Instead of IP

Every FluxCloud Marketplace game server is also reachable through its **application domain**. Flux's load balancer forwards UDP traffic over DNS and is already configured with the correct game port, so you keep a stable address even when the primary instance changes due to failover.

* Find your app domain under **Applications → Management → Information**.
* Use it in V Rising's **Direct Connect** field in place of the IP address. The query port is already baked into the domain's DNS routing, so you do **not** need to append `:9877`:

    ```
    your-app-domain.app.runonflux.io
    ```

Using the domain means you never have to update your saved server entry when the primary switches.

***

### Adjusting Server Settings

V Rising stores its runtime configuration in two JSON files on the persistent volume:

| File | Controls |
| ---- | -------- |
| `ServerHostSettings.json` | Server name, description, password, ports, RCON, public listing on Steam/EOS, max users, save name |
| `ServerGameSettings.json` | Gameplay rules — PvP/PvE, difficulty, resource and loot rates, daylight, castle decay, clan size, blood drain, raid windows |

To edit them:

1. Go to **Applications → Management** on [cloud.runonflux.com](https://cloud.runonflux.com) and select your V Rising app.
2. Click the **Settings icon**, open the **Secure Shell** tab and scroll to **Volume Browser**.
3. Open the file you want to change:

    ```
    /mnt/vrising/persistentdata/Settings/ServerHostSettings.json
    /mnt/vrising/persistentdata/Settings/ServerGameSettings.json
    ```

4. Common fields you may want to set in `ServerHostSettings.json`:

    ```
    "Name": "My Flux V Rising Server"
    "Description": "PvE server hosted on Flux"
    "Password": ""
    "MaxConnectedUsers": 40
    "GameSettingsPreset": ""
    "ListOnSteam": true
    "ListOnEOS": true
    ```

5. Save your changes, then open the **Control** tab, select **Global**, and click **Restart Application** so the new settings take effect.

> ⚠️ **Important:** Both files must remain valid JSON. Back up a file before editing and revert if the server fails to boot.

#### Changing the server name without editing JSON

The `SERVERNAME` you provided at deployment is injected via an environment variable and **overrides** the `Name` field in `ServerHostSettings.json` on every boot. To rename the server without touching JSON:

1. Open your application settings and go to the **Specifications** tab, then click **Update**.
2. Go to the **Component** tab and edit `SERVERNAME` to the new value.
3. Click **Review** in the top-right corner, confirm, and **sign the update** — the update is registered on the network **free of charge**.
4. Allow **several minutes** for the update to propagate across the Flux network. Your server will restart with the new name.

***

### Managing the World File

Your world saves live on the persistent volume under:

```
/mnt/vrising/persistentdata/Saves/v3/<world_name>/
```

The default world folder is `world1`. Each save consists of multiple `.save` files plus map data. You can:

* **Download a backup** via the Volume Browser before risky changes or major game updates.
* **Upload an existing world** from a self-hosted server to continue your adventure — drop the world folder into `/mnt/vrising/persistentdata/Saves/v3/`.
* **Roll back** by replacing the current world folder with a backup and restarting the application from the **Control** tab.

> 💡 **Tip:** V Rising does not generate automatic timed backups. Take periodic copies via the Volume Browser before patch days or major raid windows.

***

### Setting Server Admins and Bans

V Rising uses two simple text files for moderation, located on the persistent volume:

```
/mnt/vrising/persistentdata/Settings/adminlist.txt
/mnt/vrising/persistentdata/Settings/banlist.txt
```

Each file contains **one SteamID64 per line**. To grant yourself admin:

1. Look up your SteamID64 (e.g. via [steamid.io](https://steamid.io)).
2. In the **Volume Browser**, edit `adminlist.txt` and add your SteamID64 on a new line.
3. Save the file and restart the application from **Control → Global → Restart Application**.
4. In-game, press the **`** key to open the console, log in (`adminauth`), and use admin commands such as `gamesettings`, `ban_user`, `kick_user`, etc.

`banlist.txt` works the same way — one SteamID64 per line. You can also issue `/ban` from the in-game admin console and the file is updated automatically.

***

### Installing Mods

V Rising mods are typically distributed through **Thunderstore** ([thunderstore.io/c/v-rising](https://thunderstore.io/c/v-rising/)) and run through **BepInEx** with the **VRising.ModLoader** framework. Mods are installed into the persistent volume and survive restarts and game updates.

1. Download the BepInEx + ModLoader package and any mods you want to install.
2. In FluxCloud, open **Applications → Management**, select your V Rising app, click the **Settings icon** and open the **Secure Shell** tab.
3. Scroll to the **Volume Browser** and upload the BepInEx folder structure (`BepInEx/`, `doorstop_config.ini`, `winhttp.dll`) into the **server** mount:

    ```
    /mnt/vrising/server/
    ```

4. Drop your mod `.dll` files into:

    ```
    /mnt/vrising/server/BepInEx/plugins/
    ```

5. Mod configuration files are written to:

    ```
    /mnt/vrising/server/BepInEx/config/
    ```

6. Restart the server from **Control → Global → Restart Application**.

> ⚠️ **Important:** All players connecting to a modded server must have the same client-side mods installed locally. Server-only mods do not require client installation, but most balance and gameplay mods do. Mods may break after a V Rising update — wait for mod authors to release compatible versions before updating.
>
> Files placed under `/mnt/vrising/server/` are technically overwritten when the dedicated server is updated via Steam. BepInEx survives because it lives alongside (not in) the validated game files, but always keep a local copy of your mod folder so you can re-upload after a major patch if needed.

***

### Frequently Asked Questions

#### Why can't I connect right after deployment?

The first launch downloads the full V Rising Dedicated Server via SteamCMD and generates the world before opening the game port. This usually takes up to 10 minutes. Watch the container logs from **Applications → Management → Logs** and wait for the server to report it is listening on the game port before attempting to connect.

***

#### What ports does V Rising use?

V Rising uses **UDP port `9876`** for gameplay traffic and **UDP port `9877`** for the server query/browser. FluxCloud exposes both automatically. When connecting by IP you must specify the query port (`1.2.3.4:9877`); when connecting by the app domain the port is resolved by DNS and you do not need to append it.

***

#### How do I change the server password?

Edit `/mnt/vrising/persistentdata/Settings/ServerHostSettings.json` via the Volume Browser, set `"Password"` to the password you want (or `""` to make the server passwordless), save, then restart the application from **Control → Global → Restart Application**.

***

#### How do I change PvP/PvE rules, loot rates, or castle decay?

Those rules live in `ServerGameSettings.json`. Open it in the Volume Browser and tweak fields like `GameModeType` (`PvP`/`PvE`), `CastleDamageMode`, `InventoryStacksModifier`, `MaterialYieldModifier`, `BloodDrainModifier`, and the `VBloodUnitSettings` block. Save, then restart the application. For a clean slate, copy one of Stunlock's preset files (Standard / Hard / Brutal) into place rather than editing many fields by hand.

***

#### What happens if the primary server goes down?

If your current primary server becomes unavailable or experiences downtime, one of the standby instances automatically takes over as the new primary after a short delay. Your world saves, configuration, admin/ban lists, and mods are preserved on the persistent volume, so the game resumes where you left off once the switch is complete. You can check which instance is currently the primary from your application's management panel under the **Instances** tab.

> 💡 **Tip:** If you connect via the app domain (`your-app-domain.app.runonflux.io`, no port suffix) instead of the raw IP, your client will keep reaching the correct primary automatically after a failover.

***

#### Can I use my own world save?

Yes. Upload your existing world folder to `/mnt/vrising/persistentdata/Saves/v3/` via the Volume Browser, then restart the application from the **Control** tab. If your world folder name differs from the default `world1`, set the `WorldName` field in `ServerHostSettings.json` to match.

***

#### Can I install mods?

Yes — see the **Installing Mods** section above. V Rising uses BepInEx + VRising.ModLoader. Upload mod `.dll` files to `/mnt/vrising/server/BepInEx/plugins/` via the Volume Browser. All connecting players must have the same client-side mods installed locally.

***

#### How can I update my game server to the latest version?

The `trueosiris/vrising` image checks for and downloads the latest V Rising Dedicated Server build via Steam on every startup. To update immediately, open **Applications → Management**, select your V Rising server, go to the **Control** tab, choose **Global**, and click **Restart Application**.
