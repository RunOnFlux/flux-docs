# Rust

This guide walks you through the process of **deploying, managing, and connecting to a Rust Dedicated Server** using FluxCloud. Whether you are running a short-wipe PvP box for a small crew or a long-running community server, this page covers every step from purchase through in-game connection and ongoing administration.

The FluxCloud Rust template is built on the `pfeiffermax/rust-game-server:latest` image. Unlike SteamCMD-at-runtime images, the Rust Dedicated Server (Steam app `258550`) is **baked into the Docker image at build time** — your server starts almost immediately on first boot, without waiting for a multi-gigabyte Steam download. The upstream image is rebuilt and republished shortly after every Facepunch update. This page describes the **Vanilla** template — if you want Oxide/uMod pre-installed, deploy the [Rust - Modded](rustmodded.md) template instead.

For more information on **Rust** visit: [https://rust.facepunch.com](https://rust.facepunch.com). For the container image, see: [https://github.com/max-pfeiffer/rust-game-server-docker](https://github.com/max-pfeiffer/rust-game-server-docker).

***

### How To Install a Rust Server

#### **Steps**

1. **Access FluxCloud**

* Visit [cloud.runonflux.com](https://cloud.runonflux.com) and sign in or create an account.


2. **Find the Rust Server**

* Navigate to the **Marketplace → Games** tab, then locate the **Rust** tile and click **View Details**.

3. **Select Server Configuration**

* Choose your preferred configuration based on expected player count:
  * **Vanilla - 50 Slots** — 8GB RAM, 2.5 CPU cores, 15GB SSD. Ideal for small groups of friends or a tight-knit community on a smaller map (worldsize ≤ 3500).
  * **Vanilla - 100 Slots** — 12GB RAM, 4 CPU cores, 25GB SSD. Balanced for mid-sized communities running standard-size maps with regular wipes.
  * **Vanilla - 200 Slots** — 24GB RAM, 6 CPU cores, 50GB SSD. Recommended for large public servers with big maps (worldsize 4000–4500) and heavy PvP / raid activity.
* Click **Install Now** to continue.

> 💡 **Rust is RAM-hungry.** The world, entities, and player state all live in memory. A 4000-worldsize map with full player activity can comfortably consume 10–15GB at peak. If you plan to raise `server.worldsize` above 3500 or expect full population, pick a larger tier than the slot count alone would suggest.

4. **Fill in the Server Fields**

   The Vanilla template exposes three required fields. These are baked into the server's launch arguments at deployment time:

   | Field | What it does | Example |
   | ----- | ------------ | ------- |
   | **SERVER\_HOSTNAME** | Server name shown in the in-game server browser. Keep it under ~64 characters and avoid leading whitespace. | `RunOnFlux.com – Monthly Wipes` |
   | **SERVER\_DESCRIPTION** | Short description shown on the server-info panel. Supports line breaks via `\n`. | `Powered by Flux Cloud – the decentralized Web3 network for unstoppable game servers` |
   | **RCON\_PASSWORD** | Password used to connect to WebRCON / remote admin on TCP 28016. **Pick a strong unique value** — this is the password you will use to run admin commands remotely. | `g7Nt-9kRa-PQ12-xM88` |

   > ⚠️ **Choose a strong RCON password now.** There is no default fallback — whatever you enter here becomes the permanent RCON password until you re-deploy the app with a new value. Treat it like the root password for the server.

5. **Choose Subscription**

* Select your desired **subscription duration**.
* Agree to the **Terms of Use** and **Privacy Policy**, and click the blue **Continue** arrow at the bottom.

6. **Deployment Location**

* Configure whether you want your Rust server to deploy in specific geographic regions:
  * **Global (Recommended):** No geographic restrictions for best availability.
  * **Custom:** Restrict by continent or country — useful if your community is concentrated in one region and you want to minimise latency.
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

### First Launch — What to Expect

Because the Rust Dedicated Server binaries ship **inside the Docker image**, there is no SteamCMD download on first boot. The container starts, reads your `+server.*` launch arguments, and immediately begins generating a procedural map:

1. **Image pull** (~3–6GB) – Flux pulls the `pfeiffermax/rust-game-server:latest` image onto the primary node. First deployment only.
2. **Map generation** – the server builds a procedural map from the seed and worldsize. This is the main thing you wait for on a fresh volume.
3. **Network port opens** – once map generation finishes and Steam servers acknowledge the heartbeat, the server accepts player connections.

* Expect the **first boot to take 5–15 minutes** on a default 4000 worldsize — much faster than SteamCMD-based images. Larger worldsizes (5000–6000) can push this to 15–25 minutes.
* During generation the server will not accept connections and will not appear in the in-game browser.
* You can follow progress from **Applications → Management → Logs**. Key log lines to watch for, in order:
  * `Generating procedural map…` – map generation in progress.
  * `Server startup complete` – the server finished loading the world.
  * `SteamServer: OnSteamServersConnected` – the server has registered with Steam and will appear in the browser shortly.
* Subsequent restarts are fast — the binaries live in the image and the world lives on the persistent volume, so only the world save has to reload.

> 💡 **Forced wipes on the first Thursday of each month.** Facepunch ships a mandatory monthly protocol update on the first Thursday of every month. The upstream image is rebuilt within hours of release; restart the app from **Control → Local → Restart Application** to pull the new image. Your world save from the previous protocol will fail to load after a forced wipe — that is standard Rust behaviour and applies to every host.

***

### Finding the IP of Your Game Server

Flux runs on a decentralized network, meaning your application is deployed across **three instances**.\
For game servers, a **Primary/Standby** setup is used — your game runs on the primary instance, while others are on standby for redundancy.

To find your server's **primary IP address**:

1. Visit [**cloud.runonflux.com**](https://cloud.runonflux.com) and log in.
2. Go to **Applications → Management**.
3. Click the **Settings icon** on your Rust Server.
4. Open the **Instances** tab.
   * The **Primary IP address** is shown here.
   * You can also view geolocation details for all instances.

To connect to your server from the Rust client:

1. Launch **Rust** from Steam.
2. From the main menu, press **F1** to open the in-game console.
3. Type the direct-connect command using your **Primary IP** and the game port `28015`:

    ```
    client.connect 1.2.3.4:28015
    ```

4. Press **Enter** to connect. If the server has a password, you will be prompted for it.

Alternatively, find the server in the in-game **Community** server browser by searching for the **SERVER\_HOSTNAME** you entered at deployment.

> 💡 **Tip:** Rust uses UDP port **28015** for gameplay traffic, TCP **28016** for RCON / WebRCON, and UDP **28017** for the Steam server-browser query port. All three are exposed by the FluxCloud template automatically.

#### Connecting via Domain Instead of IP

Every FluxCloud Marketplace game server is also reachable through its **application domain**. Flux's load balancer forwards UDP traffic over DNS and is already configured with the correct game port, so you keep a stable address even when the primary instance changes due to failover.

* Find your app domain under **Applications → Management → Information**.
* Use it in the Rust client in place of the IP address. The game port is already baked into the domain's DNS routing, so you do **not** need to append `:28015`:

    ```
    client.connect your-app-domain.app.runonflux.io
    ```

Using the domain means you never have to update your saved favourite when the primary switches after a failover.

***

### Launch Arguments Set by FluxCloud

The Vanilla Rust template sets the following arguments on the `RustDedicated` binary when your container starts. The bold ones pick up the values you entered at deployment:

| Argument | Value | What it does |
| -------- | ----- | ------------ |
| `+server.ip` | `0.0.0.0` | Bind on every interface inside the container. |
| `+server.port` | `28015` | UDP game port. |
| `+rcon.ip` | `0.0.0.0` | Bind RCON on every interface. |
| `+rcon.port` | `28016` | RCON / WebRCON TCP port. |
| `+rcon.password` | **`${RCON_PASSWORD}`** | The password you entered at deployment. |
| `+server.identity` | `rust` | Name of the server save folder. Files live under `/srv/rust/server/rust/`. |
| `+server.maxplayers` | `50` / `100` / `200` | Matches the slot count of the tier you selected. |
| `+server.saveinterval` | `600` | World is saved to disk every 600 seconds (10 minutes). |
| `+server.hostname` | **`${SERVER_HOSTNAME}`** | The name you entered at deployment. |
| `+server.description` | **`${SERVER_DESCRIPTION}`** | The description you entered at deployment. |
| `-queryport` | `28017` | UDP port used by the Steam server browser. |

All other server behaviour — map seed, worldsize, PvE flag, tickrate, decay, admin lists — defaults to Rust's built-in values. The next section covers how to override them through `server.cfg`.

> 💡 **Changing hostname, description, or RCON password after deployment.** The three values you entered at deployment are passed as launch arguments. You have two options to change them later:
>
> 1. **Update the app** (free on Flux) — open **Applications → Management → Update**, edit the user env fields, sign the update. The container restarts with the new values.
> 2. **Override via `server.cfg`** — add `server.hostname "New Name"` to `server.cfg`. Rust applies `server.cfg` after the launch args, so the cfg line wins for most cvars. The RCON password can only be changed through option 1.

***

### Adjusting Server Settings (`server.cfg`)

Most of Rust's runtime configuration lives in **`server.cfg`**, a plain-text file inside your server identity folder. Each line is a console command that is executed when the server boots — this is how you change the map seed, worldsize, tickrate, and all the other fine-grained settings that are not surfaced as deployment fields.

Settings are edited through the **Volume Browser**:

1. Go to **Applications → Management** on [cloud.runonflux.com](https://cloud.runonflux.com) and select your Rust app.
2. Click the **Settings icon**, open the **Secure Shell** tab and scroll to **Volume Browser**.
3. Open (or create) the server configuration file:

    ```
    /srv/rust/server/rust/cfg/server.cfg
    ```

    > The path segment `rust` is the **server identity** set via `+server.identity rust` in the launch arguments. It doubles as the save folder name. All world data, configs, and admin lists live under `/srv/rust/server/rust/`.

4. Common settings you may want to add (one per line):

    ```
    server.seed 1234567
    server.worldsize 4000
    server.tickrate 30
    server.globalchat true
    server.pve false
    server.stability true
    server.radiation true
    decay.scale 1.0
    ```

5. Save your changes, then open the **Control** tab, select **Local**, and click **Restart Application** so the new settings take effect.

#### Key `server.cfg` commands

| Command | Purpose |
| ------- | ------- |
| `server.hostname "<text>"` | Override the hostname you set at deployment (wrap multi-word names in quotes) |
| `server.description "<text>"` | Override the description (supports `\n` for line breaks) |
| `server.url "<url>"` | Website link shown in the server panel |
| `server.headerimage "<url>"` | 512 × 256 JPEG/PNG banner URL shown in the server browser |
| `server.seed <n>` | Procedural map seed (1–2147483647). Changing this regenerates the map on next wipe |
| `server.worldsize <n>` | Map edge length in metres (2000–6000, default 3000). Bigger = more RAM and generation time |
| `server.saveinterval <seconds>` | Override the default 10-minute world autosave |
| `server.tickrate <n>` | Network tickrate (default 16, can raise to 30 for competitive play — costs CPU) |
| `server.pve true\|false` | PvE flag (cosmetic — players still need mods/plugins to actually disable damage) |
| `server.radiation true\|false` | Toggle radiation damage |
| `decay.scale <n>` | Multiplier for building decay (0 disables, 1 is default) |

> ⚠️ **Important:** `server.cfg` is only read on server startup. Always restart the application after editing. A malformed line will be skipped silently — check the logs for `Unknown command` warnings if a setting does not seem to apply.

#### Wiping the map

A **wipe** removes the current map and all player-built structures. To wipe:

1. In the **Volume Browser**, navigate to `/srv/rust/server/rust/` and delete (or rename for backup) the world save files — the ones matching `*.sav`, `*.map`, and `proceduralmap.*`. Leave the `cfg/` folder alone unless you also want to reset config.
2. Optionally change `server.seed` in `server.cfg` to regenerate a brand-new map.
3. Restart the application from **Control → Local → Restart Application**. A fresh map will be generated on boot.

> 💡 **Tip:** To wipe player data (blueprints, inventories) without wiping the map, delete only the `player.blueprints.*.db` and `player.deaths.*.db` files in the same folder.

***

### Connecting to RCON / WebRCON

RCON is the remote console used by admin tools to run any `server.*` command without being in-game. The password is the **RCON\_PASSWORD** you entered at deployment — there is no default value, so there is nothing to "change" the way the old image required.

Connect via:

* **Facepunch WebRCON** – open [facepunch.com/rust/rcon](https://facepunch.com/rust/rcon), enter `<primary-ip>:28016` and your RCON password. Gives you a live console, player list, chat feed, and any `server.*` / `kick` / `ban` command.
* **RustAdmin Desktop** – a Windows GUI tool that wraps WebRCON with player lists, scheduled tasks, chat commands, and backups.
* **WebSocket URL** – if you script your own tools, the endpoint is:

    ```
    ws://<primary-ip>:28016/<your-rcon-password>
    ```

> 💡 **Prefer the app domain for RCON too.** Just like game traffic, `<your-app-domain>.app.runonflux.io:28016` points at the current primary, so your admin tooling keeps working after a failover.

If you ever need to rotate the RCON password:

1. Open your application settings and click **Update**.
2. Edit the `RCON_PASSWORD` field with a new value.
3. Click **Review** in the top-right corner, confirm, and **sign the update**. Updates to existing apps are **free of charge** on the Flux network.
4. Allow a minute or two for the update to propagate. The server restarts and the new password is active.

***

### Setting Server Admins, Moderators, and Bans

Rust uses two text files in the server identity folder for permissions, plus runtime RCON commands. The files are located on the persistent volume:

```
/srv/rust/server/rust/cfg/users.cfg
/srv/rust/server/rust/cfg/bans.cfg
```

Each file contains **one command per line**, using SteamID64s. To grant yourself owner-level access:

1. Look up your SteamID64 (e.g. via [steamid.io](https://steamid.io) — it's a 17-digit number starting with `7656119…`).
2. In the **Volume Browser**, open `users.cfg` (create it if it does not exist) and add a line:

    ```
    ownerid 76561198000000000 "YourName" "Server owner"
    ```

    Use `moderatorid` instead of `ownerid` for moderators (can kick/ban but cannot give items or change cvars).

3. Save the file and restart the application from **Control → Local → Restart Application**.
4. In-game, press **F1** to open the console — you now have access to commands like `kick`, `ban`, `noclip`, `teleport`, and `inventory.give`.

`bans.cfg` uses `banid <steamid64> "<name>" "<reason>"` entries. The in-game `ban` and `banid` commands update this file automatically; manual edits through the Volume Browser also work.

> 💡 **Tip:** If you prefer a single place for everything, you can drop the same `ownerid`/`moderatorid` lines into `server.cfg` — they will be executed on startup. Keep the list in one file only to avoid confusion.

***

### Managing Save/World Data

Rust persists the entire world (terrain, entities, player corpses, built structures, items, vehicles, heli/patrol state) inside your server identity folder:

```
/srv/rust/server/rust/
```

Key files to know:

| File/pattern | Contents |
| ------------ | -------- |
| `proceduralmap.<seed>.<worldsize>.<protocol>.sav` | Complete world save — the single most important file |
| `proceduralmap.<…>.map` | Generated terrain data (regenerated from seed if missing) |
| `player.blueprints.*.db` | Per-player learned blueprints (wiped separately from the map) |
| `player.deaths.*.db`, `player.identities.*.db`, `player.tokens.*.db` | Per-player state |
| `cfg/server.cfg`, `cfg/users.cfg`, `cfg/bans.cfg` | Configuration, admin list, ban list |

You can:

* **Download a backup** via the Volume Browser before forced wipes, map seed changes, or major game updates.
* **Upload an existing world** by replacing the `proceduralmap.*.sav` file and keeping the matching seed/worldsize in `server.cfg`.
* **Wipe** by deleting the save files (see the **Wiping the map** section above).

> ⚠️ **Important:** The protocol number in the filename increments on Rust's **monthly forced wipe** (first Thursday of each month). The server will be unable to load an older-protocol save after a forced wipe — this is intentional on Facepunch's side and affects every Rust host, not just Flux.

***

### Frequently Asked Questions

#### Why can't I connect right after deployment?

On first boot the container has to generate a procedural map before opening the game port. This usually takes 5–15 minutes for a default worldsize, longer on large maps. Watch the container logs from **Applications → Management → Logs** and wait for the `Server startup complete` and `SteamServer: OnSteamServersConnected` messages before attempting to connect.

***

#### What ports does Rust use?

Rust uses UDP port **28015** for gameplay traffic, TCP port **28016** for RCON / WebRCON, and UDP port **28017** for the Steam server-browser query. FluxCloud exposes all three automatically. When connecting by IP you must specify the game port (`client.connect 1.2.3.4:28015`); when connecting by the app domain the port is resolved by DNS and you do not need to append it.

***

#### How do I change the server name, description, or RCON password?

All three were set at deployment as user fields. Open **Applications → Management**, click **Update**, edit the field, click **Review**, and sign the update (free on Flux). The container restarts with the new value. As an alternative for hostname/description only, you can add `server.hostname "..."` / `server.description "..."` lines to `server.cfg` — `server.cfg` is loaded after the launch args, so it wins.

***

#### How do I change the map seed or worldsize?

Edit `server.seed` and `server.worldsize` in `/srv/rust/server/rust/cfg/server.cfg`. The change only takes effect on a **fresh map** — you will need to wipe the existing save files (see **Wiping the map**) and restart. Expect map generation to take several minutes; very large maps (6000) can take 10+ minutes and need more RAM.

***

#### How do I set up admins?

Add a line like `ownerid 76561198000000000 "YourName" "Owner"` to `/srv/rust/server/rust/cfg/users.cfg`, save, and restart the application. Owners have full access to all console commands in-game via the `F1` console.

***

#### Is RCON enabled? How do I connect?

Yes. WebRCON listens on TCP port 28016 and uses the `RCON_PASSWORD` you set at deployment. Connect via [facepunch.com/rust/rcon](https://facepunch.com/rust/rcon) or a desktop tool like RustAdmin using `<primary-ip>:28016` (or `<your-app-domain>.app.runonflux.io:28016`) and your password.

***

#### What happens if the primary server goes down?

If your current primary server becomes unavailable or experiences downtime, one of the standby instances automatically takes over as the new primary after a short delay. Your world save, configuration, admin/ban lists, and player data are preserved on the persistent volume, so the game resumes where you left off once the switch is complete. You can check which instance is currently the primary from your application's management panel under the **Instances** tab.

> 💡 **Tip:** If you connect via the app domain (`your-app-domain.app.runonflux.io`, no port suffix) instead of the raw IP, your client will keep reaching the correct primary automatically after a failover.

***

#### How can I update my game server to the latest version?

The `pfeiffermax/rust-game-server:latest` image is rebuilt upstream shortly after each Facepunch update — the Rust binaries are baked into the image rather than downloaded at runtime. To pick up the newest build, open **Applications → Management**, select your Rust server, go to the **Control** tab, choose **Local**, and click **Restart Application**. Flux re-pulls the latest image on restart.

***

#### Does Rust do forced wipes, and how does it affect me?

Yes. Facepunch ships a mandatory protocol update on the **first Thursday of every month** that invalidates the previous world save (the protocol number in the filename changes). After a forced wipe:

1. Restart the app so Flux pulls the freshly-rebuilt image.
2. Delete the old `proceduralmap.*.sav` and `proceduralmap.*.map` files from the Volume Browser.
3. Optionally rotate `server.seed` in `server.cfg` for a fresh map.
4. Restart again; the server regenerates the world.

Many community servers also wipe blueprints at the same time (delete the `player.blueprints.*.db` files).

***

#### Can I install mods or plugins on this (Vanilla) template?

No — this template runs a **pure vanilla** server. If you want Oxide/uMod plugins (Kits, ZLevels, BetterLoot, economy systems, custom maps, skin pickers, etc.), deploy the **Rust - Modded** template instead, which uses the `latest-oxide` image tag with Oxide pre-installed. See the [Rust - Modded guide](rustmodded.md) for the full plugin workflow. Migrating between the two later is possible — copy the world save into the other app's identity folder (`/srv/rust/server/rust/` ⇆ `/srv/rust/server/rustoxide/`).
