# Windrose

This guide walks you through the process of **deploying, managing, and connecting to a Windrose Dedicated Server** using FluxCloud. Windrose is an Early Access co-op survival adventure from Kraken Express / Pocketpair Publishing where small crews sail the skies, raid procedurally-generated islands, and build out their airship together — running it on Flux means the crew's island is **always online**, even when the captain is offline.

The FluxCloud Windrose template is built on the `indifferentbroccoli/windrose-server-docker:latest` image, which bundles SteamCMD and keeps the Windrose Dedicated Server up to date on every restart. The template is preconfigured for **direct connection** (`USE_DIRECT_CONNECTION=true`) on UDP/TCP port `7777`, so your players join with an IP and port instead of an invite code.

> ⚠️ **AVX2-capable CPU required.** Windrose's server binary will refuse to start on hosts that do not expose AVX2. FluxCloud nodes that match the marketplace tier requirements already meet this — but if you ever migrate the world to your own host or a custom Flux app, make sure the underlying CPU supports AVX2.

For more information on **Windrose** visit: [https://playwindrose.com](https://playwindrose.com). For the container image, see: [https://github.com/indifferentbroccoli/windrose-server-docker](https://github.com/indifferentbroccoli/windrose-server-docker).

***

### How To Install a Windrose Server

#### **Steps**

1. **Access FluxCloud**

* Visit [cloud.runonflux.com](https://cloud.runonflux.com) and sign in or create an account.


2. **Find the Windrose Server**

* Navigate to the **Marketplace → Games** tab, then locate the **Windrose** tile and click **View Details**.

3. **Select Server Configuration**

* Choose your preferred configuration based on expected crew size:
  * **2 Slots** — 8GB RAM, 2 CPU cores, 35GB SSD. Ideal for a captain and one crewmate doing a relaxed run together.
  * **4 Slots** — 12GB RAM, 2 CPU cores, 35GB SSD. Balanced for a small group of friends sharing one airship and a couple of outposts.
  * **10 Slots** — 16GB RAM, 2 CPU cores, 40GB SSD. Recommended for full crews, multi-ship setups, or a small community server with rotating players.
* Click **Install Now** to continue.

> 💡 **Windrose is RAM-hungry per player.** The procedural world, ship state, dungeon entities, and per-player inventories all live in memory. The default 10-slot tier targets full lobbies on a normal-sized world; if you only ever play with two or three friends, the 2- or 4-slot tier is plenty.

4. **Fill in the Server Fields**

   The Windrose template exposes two user fields. These are baked into the server's environment at deployment time:

   | Field | What it does | Example |
   | ----- | ------------ | ------- |
   | **SERVER\_NAME** *(required)* | Display name shown in the in-game server list and on the join screen. Avoid leading whitespace and apostrophes — the upstream image has a known issue where an `'` in the name breaks startup. | `Skybound Crew` |
   | **SERVER\_PASSWORD** *(optional)* | Password required to join. Leave blank to make the server public (anyone with the IP can connect). | `windrose123` |

5. **Choose Subscription**

* Select your desired **subscription duration**.
* Agree to the **Terms of Use** and **Privacy Policy**, and click the blue **Continue** arrow at the bottom.

6. **Deployment Location**

* Configure whether you want your Windrose server to deploy in specific geographic regions:
  * **Global (Recommended):** No geographic restrictions for best availability.
  * **Custom:** Restrict by continent or country — useful if your crew is concentrated in one region and you want to minimise latency.
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

When your Windrose server starts for the very first time, the container uses **SteamCMD to download the full Windrose Dedicated Server** before the game port is opened. This is normal and only happens on the first boot.

* Expect the initial download and validation to take **5–15 minutes** depending on node bandwidth and disk speed.
* During this time the server will not accept player connections and will not appear reachable from the client.
* You can follow progress from **Applications → Management → Logs** in FluxCloud. Once you see lines mentioning `Server is now ready` / `LogServerProxy: Listening on port 7777`, the server is ready.
* Subsequent restarts are fast — the binaries are persisted on the volume. Because the template runs with `UPDATE_ON_START=true`, SteamCMD validates files and pulls any new build on every restart, so a simple **Restart Application** is enough to apply game updates.

***

### Finding the IP of Your Game Server

Flux runs on a decentralized network, meaning your application is deployed across **two instances**.\
For game servers, a **Primary/Standby** setup is used — your game runs on the primary instance, while the other is on standby for redundancy.

To find your server's **primary IP address**:

1. Visit [**cloud.runonflux.com**](https://cloud.runonflux.com) and log in.
2. Go to **Applications → Management**.
3. Click the **Settings icon** on your Windrose Server.
4. Open the **Instances** tab.
   * The **Primary IP address** is shown here.
   * You can also view geolocation details for both instances.

To connect to your server from the Windrose client:

1. Launch **Windrose** from Steam.
2. From the main menu, choose **Multiplayer → Join Server → Direct Connection** (sometimes labelled **Connect by IP**).
3. Enter your **Primary IP address** and the game port `7777`, for example:

    ```
    1.2.3.4:7777
    ```

4. Enter the **SERVER\_PASSWORD** if one was set at deployment, then click **Join**.

> 💡 **Tip:** Windrose uses port **7777** for direct connection and the FluxCloud template exposes both **TCP and UDP** on that port. Both protocols are required — gameplay traffic flows over UDP and the proxy uses TCP for the handshake.

#### Connecting via Domain Instead of IP

Every FluxCloud Marketplace game server is also reachable through its **application domain**. Flux's load balancer forwards UDP and TCP traffic over DNS and is already configured with the correct game port, so you keep a stable address even when the primary instance changes due to failover.

* Find your app domain under **Applications → Management → Information**.
* Use it in the Windrose client in place of the IP address. The game port is already baked into the domain's DNS routing, so you do **not** need to append `:7777`:

    ```
    your-app-domain.app.runonflux.io
    ```

Using the domain means you never have to update your saved server entry when the primary switches after a failover — useful for community servers where players save the address as a favourite.

***

### Adjusting Server Settings (`ServerDescription.json`)

Windrose's main server configuration lives in **`ServerDescription.json`**, a plain-text JSON file on the persistent volume. The container generates this file on first boot using the env vars you supplied at deployment, but every field can be hand-edited afterwards.

Settings are edited through the **Volume Browser**:

1. Go to **Applications → Management** on [cloud.runonflux.com](https://cloud.runonflux.com) and select your Windrose app.
2. Click the **Settings icon**, open the **Secure Shell** tab and scroll to **Volume Browser**.
3. Open the server description file:

    ```
    /home/steam/server-files/R5/ServerDescription.json
    ```

4. Common fields you may want to change:

    | Field | Purpose |
    | ----- | ------- |
    | `ServerName` | Display name shown to clients on the join screen |
    | `IsPasswordProtected` | `true` to require a password, `false` for a public server |
    | `Password` | The password itself when `IsPasswordProtected` is `true` |
    | `MaxPlayerCount` | Concurrent player cap — keep this **at or below your tier's slot count** |
    | `UseDirectConnection` | Leave at `true` on FluxCloud; the alternative invite-code mode is not used by this template |
    | `WorldIslandId` | The world to load on boot — must match the folder name of an existing `WorldDescription.json` (see below) |

5. Save your changes, then open the **Control** tab, select **Local**, and click **Restart Application** so the new settings take effect.

> ⚠️ **Important:** `ServerDescription.json` must remain valid JSON. Back the file up before editing — a missing comma or unbalanced brace will prevent the server from starting, and you will only see the parse error in **Applications → Management → Logs**. The file is regenerated from environment variables only when it does not exist, so once you've edited it the volume copy is what wins on subsequent boots.

> 💡 **Updating SERVER\_NAME or SERVER\_PASSWORD after deployment.** Two options:
>
> 1. **Update the app** (free on Flux) — open **Applications → Management → Update**, edit the user env fields, sign the update. The container restarts; if the JSON file already exists on the volume it will not be overwritten, so prefer option 2 for an existing server.
> 2. **Edit `ServerDescription.json` directly** — change `ServerName` / `Password` / `IsPasswordProtected` and restart the application from **Control → Local → Restart Application**.

#### World-specific tuning (`WorldDescription.json`)

Each world generated by the server has its own `WorldDescription.json` with the seed, difficulty, and gameplay multipliers used by that island. Find it under:

```
/home/steam/server-files/R5/Saved/SaveProfiles/Default/RocksDB/<version>/Worlds/<world-id>/WorldDescription.json
```

Edit the file, save it, and restart the application from **Control → Local → Restart Application** for the changes to load.

***

### Managing Save/World Data

Windrose persists the entire world (terrain, ship state, player inventories, built structures, dungeon clears) inside the save profile folder on the persistent volume:

```
/home/steam/server-files/R5/Saved/SaveProfiles/Default/
```

You can:

* **Download a backup** via the Volume Browser before risky edits, version updates, or major in-game milestones.
* **Upload an existing world** by replacing the `RocksDB/<version>/Worlds/<world-id>/` folder, then updating `WorldIslandId` in `ServerDescription.json` to match the world ID and restarting.
* **Wipe the server** by renaming or deleting the matching `Worlds/<world-id>/` folder and restarting — the server will generate a fresh world on the next boot using the seed in `WorldDescription.json` (or a new one if the file is also removed).

> ⚠️ **Early Access caveat.** Windrose is in Early Access. The dev team occasionally ships world-format changes that mark older saves as incompatible. When that happens the server log will refuse to load the world and ask for a fresh one — back up the `Worlds/` folder before every game update so you can roll back to the previous game build if needed.

***

### Updating the Game Server

The FluxCloud template runs with `UPDATE_ON_START=true`, which means SteamCMD validates and pulls the latest Windrose build on **every** container start. To apply a new game release:

1. Open **Applications → Management** on [cloud.runonflux.com](https://cloud.runonflux.com) and select your Windrose server.
2. Open the **Control** tab, select **Local**, and click **Restart Application**.
3. Wait for the SteamCMD update to complete (visible in **Logs**) — this is usually a minute or two unless a major patch dropped.
4. Players can rejoin once you see the `Server is now ready` line in the log.

If a patch broke compatibility with an existing world, restore the most recent backup from the Volume Browser before letting players reconnect.

***

### Frequently Asked Questions

#### Why can't I connect right after deployment?

The first launch downloads the full Windrose Dedicated Server via SteamCMD before opening the game port. This usually takes 5–15 minutes. Watch the container logs from **Applications → Management → Logs** and wait for the `Server is now ready` message before attempting to connect.

***

#### What ports does Windrose use?

The FluxCloud template uses port **7777** in **direct-connection mode**, exposed on both **TCP and UDP**. Both protocols are required: gameplay traffic flows over UDP and the connection proxy uses TCP for the handshake. When connecting by IP you must specify the port (`1.2.3.4:7777`); when connecting by the app domain the port is resolved by DNS and you do not need to append it.

***

#### How do I change the server name or password?

The fastest path is to edit `/home/steam/server-files/R5/ServerDescription.json` via the Volume Browser — change `ServerName`, `Password`, and `IsPasswordProtected`, save, then restart the application from **Control → Local → Restart Application**. Alternatively, open **Applications → Management → Update** and edit the `SERVER_NAME` / `SERVER_PASSWORD` fields, then sign the update — useful for a fresh deployment but the JSON file on disk will keep the older values once it exists.

***

#### How do I make the server public (no password)?

Open `ServerDescription.json` and set `"IsPasswordProtected": false` (you can blank out `Password` while you're there). Save, then restart from **Control → Local → Restart Application**.

***

#### How do I reset / wipe the world?

In the Volume Browser, navigate to `/home/steam/server-files/R5/Saved/SaveProfiles/Default/RocksDB/<version>/Worlds/` and delete (or rename for backup) the world folder for the island ID listed in `ServerDescription.json`. Restart the application — the server will regenerate a fresh world on boot. To switch to a brand-new map without losing the old one, instead change `WorldIslandId` in `ServerDescription.json` to a new identifier and restart; the previous world stays in place under its old folder.

***

#### My server says it can't start — "AVX2 not supported"

The Windrose binary requires an AVX2-capable CPU. The marketplace template is sized to land on Flux nodes that meet this requirement, but if your primary instance ends up on a host without AVX2 the server will not start. Restart the application from **Control → Local → Restart Application** so Flux re-schedules onto a different node, or check the **Instances** tab and trigger a primary failover.

***

#### What happens if the primary server goes down?

If your current primary server becomes unavailable or experiences downtime, the standby instance automatically takes over as the new primary after a short delay. Your world saves, server configuration, and player data are preserved on the persistent volume, so the game resumes where you left off once the switch is complete. You can check which instance is currently the primary from your application's management panel under the **Instances** tab.

> 💡 **Tip:** If you connect via the app domain (`your-app-domain.app.runonflux.io`, no port suffix) instead of the raw IP, your client will keep reaching the correct primary automatically after a failover.

***

#### How can I update my game server to the latest version?

The `indifferentbroccoli/windrose-server-docker:latest` image runs SteamCMD with `UPDATE_ON_START=true` on every startup, so the server pulls the latest Windrose build on each boot. To update immediately, open **Applications → Management**, select your Windrose server, go to the **Control** tab, choose **Local**, and click **Restart Application**.

***

#### Are admin commands or RCON available?

The base Windrose dedicated server does not expose a built-in RCON or in-game admin command system at this stage of Early Access — moderation is currently limited to setting a server password and curating who you share it with. A third-party server enhancement called **Windrose+** adds a web RCON dashboard, multipliers, and Lua mods, but it is **not enabled** in the FluxCloud Marketplace template. As Windrose's official server tooling matures the template will be updated to expose any new admin features.
