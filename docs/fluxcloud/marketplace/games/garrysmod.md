# Garry's Mod

This guide walks you through the process of **deploying, managing, and connecting to a Garry's Mod (GMod) Game Server** using FluxCloud. Whether you're running TTT, DarkRP, Prop Hunt, or any custom gamemode your community can invent, this page provides step-by-step instructions and key details for a seamless experience.

The FluxCloud Garry's Mod template is built on the `ich777/steamcmd:garrysmod` image, which bundles SteamCMD and keeps the Garry's Mod Dedicated Server (GMDS, Steam app `4020`) up to date on every restart.

For more information on **Garry's Mod** visit: [https://gmod.facepunch.com](https://gmod.facepunch.com). For server documentation, see: [https://wiki.facepunch.com/gmod/Creating_a_Dedicated_Server](https://wiki.facepunch.com/gmod/Creating_a_Dedicated_Server).

***

### How To Install a Garry's Mod Server

#### **Steps**

1. **Access FluxCloud**

* Visit [cloud.runonflux.com](https://cloud.runonflux.com) and sign in or create an account.


2. **Find the Garry's Mod Server**

* Navigate to the **Marketplace → Games** tab, then locate the **Garry's Mod** tile and click **View Details**.

3. **Select Server Configuration**

* Choose your preferred configuration based on expected player count:
  * **16 Slots** — 2GB RAM, 1.5 CPU cores, 10GB SSD. Ideal for small groups of friends or lightweight gamemodes like Sandbox.
  * **32 Slots** — 4GB RAM, 2.5 CPU cores, 15GB SSD. Balanced for medium-sized communities and popular gamemodes like TTT or Prop Hunt.
  * **64 Slots** — 6GB RAM, 4 CPU cores, 20GB SSD. Recommended for large communities or mod-heavy setups like DarkRP with workshop collections.
* Click **Install Now** to continue.

4. **Choose Subscription**

* Select your desired **subscription duration**.
* Agree to the **Terms of Use** and **Privacy Policy**, and click the blue **Continue** arrow at the bottom.

5. **Provide Server Configuration Values**

* During deployment you can optionally fill in:
  * **GAME\_PARAMS** *(optional, advanced)* — Source engine launch parameters appended to the server command line. Example: `+maxplayers 24 +gamemode sandbox +map gm_flatgrass`. Leave blank to start on the defaults.

6. **Deployment Location**

* Configure whether you want your Garry's Mod server to deploy in specific geographic regions:
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

When your Garry's Mod server starts for the very first time, the container uses **SteamCMD to download the full Garry's Mod Dedicated Server** before the game port is opened. This is normal and only happens on the first boot.

* Expect the initial download and validation to take **5–15 minutes** depending on node bandwidth and disk speed.
* During this time the server will not accept player connections and will not appear in the Steam server browser.
* You can follow progress from **Applications → Management → Logs** in FluxCloud. Once you see `VAC secure mode is activated` / `Gameserver logged in to Steam` in the log, the server is ready.
* Subsequent restarts are fast — the binaries are persisted on the volume and only patched when Facepunch releases an update (SteamCMD `VALIDATE=true` is enabled, so files are verified on every boot).

***

### Finding the IP of Your Game Server

Flux runs on a decentralized network, meaning your application is deployed across **three instances**.\
For game servers, a **Primary/Standby** setup is used — your game runs on the primary instance, while others are on standby for redundancy.

To find your server's **primary IP address**:

1. Visit [**cloud.runonflux.com**](https://cloud.runonflux.com) and log in.
2. Go to **Applications → Management**.
3. Click the **Settings icon** on your Garry's Mod Server.
4. Open the **Instances** tab.
   * The **Primary IP address** is shown here.
   * You can also view geolocation details for all instances.

To connect to your server from the Garry's Mod client:

1. Launch **Garry's Mod** and open the **developer console** (enable it from `Options → Keyboard → Advanced → Enable developer console` if not already).
2. In the console, run:

    ```
    connect <Primary IP>:27015
    ```

3. Alternatively, add the server to your Steam favourites via **View → Game Servers → Favorites → Add a Server** and enter `<Primary IP>:27015`, then join from the in-game **Legacy Browser**.
4. Enter the server password if one has been configured (see below).

> 💡 **Tip:** Garry's Mod uses UDP port **27015** for gameplay traffic and UDP **27005** for the client-side connection.

#### Connecting via Domain Instead of IP

Every FluxCloud Marketplace game server is also reachable through its **application domain**. Flux's load balancer forwards UDP traffic over DNS and is already configured with the correct game port, so you keep a stable address even when the primary instance changes due to failover.

* Find your app domain under **Applications → Management → Information**.
* Use it in the Garry's Mod client in place of the IP address. The game port is already baked into the domain's DNS routing, so you do **not** need to append `:27015`:

    ```
    connect your-app-domain.app.runonflux.io
    ```

Using the domain means you never have to update your favourites entry when the primary switches.

***

### Adjusting Server Settings (`server.cfg`)

Garry's Mod reads its runtime configuration from `server.cfg`, which lets you customise the server name, password, RCON password, sv\_cheats, default gamemode options, and many other `cvar` values.

Settings are edited through the **Volume Browser**:

1. Go to **Applications → Management** on [cloud.runonflux.com](https://cloud.runonflux.com) and select your Garry's Mod app.
2. Click the **Settings icon**, open the **Secure Shell** tab and scroll to **Volume Browser**.
3. Open (or create) the server config file:

    ```
    /serverdata/serverfiles/garrysmod/cfg/server.cfg
    ```

4. Common fields you may want to set:

    ```
    hostname "My Flux GMod Server"
    sv_password ""
    rcon_password "change-me"
    sv_region 255
    sv_lan 0
    sv_loadingurl ""
    ```

5. Save your changes, then open the **Control** tab, select **Global**, and click **Restart Application** so the new settings take effect.

> ⚠️ **Important:** Keep your `rcon_password` secret. Anyone with it can issue server commands remotely.

#### Changing gamemode, map, and player count

The gamemode, starting map, and slot count are set on the **command line**, not in `server.cfg`. Edit them via the `GAME_PARAMS` environment variable:

1. Open your application settings and go to the **Specifications** tab, then click **Update**.
2. Go to the **Component** tab and edit `GAME_PARAMS`. For example:

    ```
    +maxplayers 32 +gamemode terrortown +map ttt_minecraft_b5
    ```

3. Click **Review** in the top-right corner, confirm, and allow several minutes for the update to propagate across the network.

Common gamemode identifiers: `sandbox`, `terrortown` (TTT), `prop_hunt`, `darkrp`, `zombiesurvival`.

***

### Installing Addons and Workshop Collections

Garry's Mod content lives on the persistent volume at:

```
/serverdata/serverfiles/garrysmod/
```

Useful subpaths:

| Path | Purpose |
| ---- | ------- |
| `garrysmod/addons/` | Server-side addons (SVN/manual drop-in) |
| `garrysmod/gamemodes/` | Installed gamemodes (TTT, DarkRP, …) |
| `garrysmod/maps/` | Custom `.bsp` map files |
| `garrysmod/cfg/` | `server.cfg` and other config scripts |
| `garrysmod/data/` | Persistent gamemode data (e.g. DarkRP jobs, ULX groups) |

#### Option 1 — Steam Workshop collection (recommended)

The cleanest way to distribute maps, gamemodes, and player-side assets is a Workshop collection. Clients auto-download required content on join.

1. Create a **Workshop Collection** at [steamcommunity.com/workshop](https://steamcommunity.com/workshop/) and copy its **collection ID** from the URL.
2. Generate a **Steam Web API key** at [steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey).
3. Edit `GAME_PARAMS` (see the previous section) and append:

    ```
    +host_workshop_collection <collection_id> -authkey <your_api_key>
    ```

4. Click **Review**, confirm, and wait for the redeploy. The server will download all collection items on next boot.

#### Option 2 — Manual addon upload (via Volume Browser)

1. Download the addon (usually a folder containing `addon.json`, `lua/`, `models/`, etc., or a `.gma` file).
2. In the **Volume Browser**, navigate to:

    ```
    /serverdata/serverfiles/garrysmod/addons/
    ```

3. Upload the addon folder (or `.gma`) there.
4. Restart the server from **Control → Global → Restart Application**.

> ⚠️ **Client-side content.** Mount packs and custom models shipped only as server-side files won't show up for players unless they also own them or you push them via a Workshop collection / FastDL. Use Option 1 whenever possible.

***

### Setting an Admin

Garry's Mod does not have a built-in admin system. The community standard is **ULX** (with ULib), installed as an addon:

1. Subscribe to **ULib** and **ULX** on the Workshop (or download their latest releases from [ulyssesmod.net](https://ulyssesmod.net)) and add them to your Workshop collection, or upload their folders to `garrysmod/addons/` via the Volume Browser.
2. Restart the server so they load.
3. Connect to your server in-game.
4. Open the developer console and look up your SteamID64 (or have a friend find it at [steamid.io](https://steamid.io)).
5. Use RCON from the console to promote yourself:

    ```
    rcon_password <your_rcon_password>
    rcon ulx adduserid <your_steamid64> superadmin
    ```

6. Once you are `superadmin`, you can use the `!menu` / `ulx` chat commands to manage the rest (kicks, bans, gamemode switches, etc.).

***

### Managing Save/World Data

Most gamemodes persist their state under `garrysmod/data/`. Notable examples:

* **DarkRP** — jobs, shipments, doors, and saved entities in `garrysmod/data/darkrp_*` folders.
* **TTT** — weapon loadouts and custom role configs under `garrysmod/data/ttt/`.
* **Sandbox** — saved maps, dupes, and advanced dupes.

You can download backups via the **Volume Browser**, or upload existing data from a previous server to seamlessly migrate. After uploading or replacing files, restart the application from the **Control** tab.

***

### Frequently Asked Questions

#### Why can't I connect right after deployment?

The first launch downloads the full Garry's Mod Dedicated Server via SteamCMD before opening the game port. This usually takes 5–15 minutes. Watch the container logs from **Applications → Management → Logs** and wait for the `Gameserver logged in to Steam` message before attempting to connect.

***

#### What port does Garry's Mod use?

Garry's Mod uses UDP port `27015` for gameplay and UDP `27005` for the client-side connection. FluxCloud exposes both automatically. When connecting by IP you must specify the port (`connect 1.2.3.4:27015`); when connecting by the app domain the port is resolved by DNS and you do not need to append it.

***

#### How do I change the server password?

Set `sv_password "yourpassword"` in `/serverdata/serverfiles/garrysmod/cfg/server.cfg` via the Volume Browser, save, then restart the application from **Control → Global → Restart Application**. Set it back to `""` to make the server public.

***

#### How do I change the gamemode or starting map?

Gamemode and map are set on the server command line, not in `server.cfg`. Update the `GAME_PARAMS` environment variable (see **Changing gamemode, map, and player count**) with `+gamemode <id> +map <mapname>`.

***

#### What happens if the primary server goes down?

If your current primary server becomes unavailable or experiences downtime, one of the standby instances automatically takes over as the new primary after a short delay. Your server files, addons, and configuration are preserved on the persistent volume, so the game resumes where you left off once the switch is complete. You can check which instance is currently the primary from your application's management panel under the **Instances** tab.

> 💡 **Tip:** If you connect via the app domain (`your-app-domain.app.runonflux.io`, no port suffix) instead of the raw IP, your client will keep reaching the correct primary automatically after a failover.

***

#### Can I run TTT / DarkRP / Prop Hunt?

Yes — any gamemode that ships as a Workshop item or addon folder will run on this image. Add the gamemode to your Workshop collection (or drop it into `garrysmod/gamemodes/`), then set `+gamemode <id>` in `GAME_PARAMS`. Many popular gamemodes (DarkRP, TTT) also require companion addons like ULX for admin tooling.

***

#### How can I update my game server to the latest version?

The `ich777/steamcmd:garrysmod` image pulls the latest Garry's Mod Dedicated Server build via SteamCMD on every startup (with `VALIDATE=true` to repair any corrupted files). To update immediately, open **Applications → Management**, select your Garry's Mod server, go to the **Control** tab, choose **Global**, and click **Restart Application**.
