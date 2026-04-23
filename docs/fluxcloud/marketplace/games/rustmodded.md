# Rust - Modded

This guide walks you through the process of **deploying, managing, and connecting to a Modded Rust Dedicated Server** using FluxCloud. The Modded template ships with **Oxide/uMod pre-installed** directly in the Docker image, so you can drop plugins onto the persistent volume and immediately tune gather rates, loot, kits, economy, PvP rules, and everything else the vanilla server will not let you touch.

The FluxCloud Rust - Modded template is built on the `pfeiffermax/rust-game-server:latest-oxide` image. Both the Rust Dedicated Server (Steam app `258550`) **and** the Oxide/uMod runtime are baked into the image at build time — there is no SteamCMD download and no Oxide installer run at startup. The upstream image is rebuilt and republished shortly after each Oxide or Facepunch release, so restarting your app on Flux is enough to pick up updates.

For more information on **Rust** visit: [https://rust.facepunch.com](https://rust.facepunch.com). For the **uMod plugin catalogue** visit: [https://umod.org/plugins/rust](https://umod.org/plugins/rust). For the container image, see: [https://github.com/max-pfeiffer/rust-game-server-docker](https://github.com/max-pfeiffer/rust-game-server-docker).

> 💡 **Vanilla vs. Modded:** If you want an unmodded server, deploy the [Rust (Vanilla)](rust.md) template instead. Everything else — tiers, pricing, ports, and persistence layout — is identical between the two templates, except that Modded uses the `rustoxide` server identity while Vanilla uses `rust`. You can migrate between them by moving your save files onto the other app's volume.

***

### How To Install a Rust - Modded Server

#### **Steps**

1. **Access FluxCloud**

* Visit [cloud.runonflux.com](https://cloud.runonflux.com) and sign in or create an account.


2. **Find the Rust - Modded Server**

* Navigate to the **Marketplace → Games** tab, then locate the **Rust - Modded** tile and click **View Details**.

3. **Select Server Configuration**

* Choose your preferred configuration based on expected player count **and plugin load**:
  * **Modded - 50 Slots** — 8GB RAM, 2.5 CPU cores, 15GB SSD. Suitable for a small community with a light plugin stack (kits, permissions, quality-of-life plugins).
  * **Modded - 100 Slots** — 12GB RAM, 4 CPU cores, 25GB SSD. Balanced for mid-sized communities with a moderate plugin stack, larger maps, and economy plugins.
  * **Modded - 200 Slots** — 24GB RAM, 6 CPU cores, 50GB SSD. Recommended for large public servers running the full plugin treatment — custom maps, zone managers, raid protection, backpacks, skin systems, and so on.
* Click **Install Now** to continue.

> 💡 **Plugins eat RAM and CPU.** Every Oxide plugin loads into the Rust server process and runs hooks on every game event. Heavy plugins like map generators, economy systems, backpacks, and zone managers can easily double base RAM usage. If you plan to run 20+ plugins or a custom map over 4000 worldsize, size up one tier.

4. **Fill in the Server Fields**

   The Modded template exposes three required fields. These are baked into the server's launch arguments at deployment time:

   | Field | What it does | Example |
   | ----- | ------------ | ------- |
   | **SERVER\_HOSTNAME** | Server name shown in the in-game server browser. Oxide-enabled servers show up in the **Modded** tab automatically. | `RunOnFlux.com – x3 Modded` |
   | **SERVER\_DESCRIPTION** | Short description shown on the server-info panel. Supports line breaks via `\n`. | `Modded Rust on Flux Cloud – x3 gather, kits, clans, monthly wipes` |
   | **RCON\_PASSWORD** | Password used to connect to WebRCON / remote admin on TCP 28016. **Pick a strong unique value** — this is also how you run `oxide.*` commands remotely. | `g7Nt-9kRa-PQ12-xM88` |

   > ⚠️ **Choose a strong RCON password now.** There is no default fallback. Whoever holds this password can run `oxide.grant user <steamid> *` and give themselves every plugin permission — treat it like the root password for the server.

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

Because both the Rust Dedicated Server and Oxide are shipped **inside the Docker image**, there is no SteamCMD download and no Oxide installer step on first boot. The container starts, loads Oxide on top of Rust, reads your `+server.*` launch arguments, and immediately begins generating a procedural map:

1. **Image pull** (~3–6GB) – Flux pulls the `pfeiffermax/rust-game-server:latest-oxide` image onto the primary node. First deployment only.
2. **Oxide loads** – the Oxide runtime attaches to the server process. Core extensions are loaded.
3. **Map generation** – the server builds a procedural map from the seed and worldsize.
4. **Network port opens** – once map generation finishes and Steam servers acknowledge the heartbeat, the server accepts player connections. The server is tagged `modded` automatically because Oxide is loaded.

* Expect the **first boot to take 5–15 minutes** on a default 4000 worldsize. Larger worldsizes (5000–6000) can push this to 15–25 minutes.
* During generation the server will not accept connections and will not appear in the in-game browser.
* You can follow progress from **Applications → Management → Logs**. Key log lines to watch for, in order:
  * `Loaded extension Oxide vX.Y.Z…` — Oxide is active.
  * `Generating procedural map…` — map generation in progress.
  * `Server startup complete` and `SteamServer: OnSteamServersConnected` — the server is ready.
* Subsequent restarts are fast — the binaries and Oxide live in the image; your world, plugins, configs, and data live on the persistent volume.

> 💡 **Oxide and Rust move together.** The upstream `latest-oxide` image is rebuilt whenever either Rust or Oxide releases. Restarting your app pulls the latest combined build. If a freshly-rebuilt image breaks one of your plugins, check `oxide/logs/` after the restart — the compile error is usually printed there.

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

Alternatively, find your server in the **Modded** tab of the in-game server browser by searching for the **SERVER\_HOSTNAME** you entered at deployment — Oxide-enabled servers are automatically tagged `modded`, which moves them into the Modded browser.

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

The Modded Rust template sets the following arguments on the `RustDedicated` binary when your container starts. The bold ones pick up the values you entered at deployment:

| Argument | Value | What it does |
| -------- | ----- | ------------ |
| `+server.ip` | `0.0.0.0` | Bind on every interface inside the container. |
| `+server.port` | `28015` | UDP game port. |
| `+rcon.ip` | `0.0.0.0` | Bind RCON on every interface. |
| `+rcon.port` | `28016` | RCON / WebRCON TCP port. |
| `+rcon.password` | **`${RCON_PASSWORD}`** | The password you entered at deployment. |
| `+server.identity` | `rustoxide` | Name of the server save folder. Files live under `/srv/rust/server/rustoxide/`. |
| `+server.maxplayers` | `50` / `100` / `200` | Matches the slot count of the tier you selected. |
| `+server.saveinterval` | `600` | World is saved to disk every 600 seconds (10 minutes). |
| `+server.hostname` | **`${SERVER_HOSTNAME}`** | The name you entered at deployment. |
| `+server.description` | **`${SERVER_DESCRIPTION}`** | The description you entered at deployment. |
| `-queryport` | `28017` | UDP port used by the Steam server browser. |

Oxide is active because you picked the `latest-oxide` image tag — there is no env var to toggle it, and no installer running at boot. The next section covers how to drop plugins onto the volume.

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
    /srv/rust/server/rustoxide/cfg/server.cfg
    ```

    > The path segment `rustoxide` is the **server identity** set via `+server.identity rustoxide` in the launch arguments. It doubles as the save folder name — all world data, configs, admin lists, and Oxide state live under `/srv/rust/server/rustoxide/`.

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

See the [Rust (Vanilla) guide](rust.md#key-servercfg-commands) for the full `server.cfg` command reference — it is identical for vanilla and modded.

***

### Installing Oxide / uMod Plugins

This is the main reason to pick the Modded template. Oxide plugins are single `.cs` files you drop onto the persistent volume — the server picks them up automatically without a restart.

#### The plugin folder layout

All Oxide files live under the persistent volume at `/srv/rust/server/rustoxide/oxide/`:

| Path | Contents |
| ---- | -------- |
| `oxide/plugins/` | Drop `.cs` plugin files here. Oxide hot-loads them within seconds. |
| `oxide/config/` | Per-plugin JSON configuration files. Auto-generated on first load of each plugin. |
| `oxide/data/` | Per-plugin runtime data (player saves, zones, quests, economy balances). |
| `oxide/lang/` | Per-plugin language/translation files. |
| `oxide/logs/` | Per-plugin log output. First place to check when a plugin misbehaves. |

#### Step-by-step: install your first plugin

1. Browse [umod.org/plugins/rust](https://umod.org/plugins/rust) and pick a plugin. Popular starters: **Kits**, **ZLevelsRemastered**, **BetterLoot**, **Clans**, **BackpackSystem**, **NoEscape**, **GodMode**, **SkinBox**.
2. On the plugin page, click **Download**. You will get a `<PluginName>.cs` file.
3. In FluxCloud, open **Applications → Management**, select your Rust app, click the **Settings icon** and open the **Secure Shell** tab. Scroll to the **Volume Browser**.
4. Navigate into:

    ```
    /srv/rust/server/rustoxide/oxide/plugins/
    ```

5. Upload the `.cs` file. Oxide will hot-load it within a few seconds — you will see a `Loaded plugin <Name> vX.Y.Z by <Author>` line in the server log.
6. Oxide auto-generates the plugin's config under `oxide/config/<PluginName>.json` on first load. Open that file in the Volume Browser to tune the plugin.
7. After editing the config, reload the plugin without restarting the whole server. From WebRCON or the in-game admin console:

    ```
    oxide.reload <PluginName>
    ```

    (`o.reload <PluginName>` is accepted as a short alias.)

#### Managing plugin permissions

Most plugins use Oxide's permission system. Use these console commands (via WebRCON or the in-game F1 console as an admin):

```
oxide.group add vip                  # create a "vip" group
oxide.group perm vip kits.vipkit     # grant the "kits.vipkit" permission to the group
oxide.usergroup add 76561198000000000 vip   # add a player (SteamID64) to the group
oxide.grant user 76561198000000000 kits.admin    # grant a permission directly to a player
```

Oxide's permission state is persisted under `oxide/data/oxide.groups.data` and `oxide/data/oxide.users.data`.

> 💡 **Tip:** When a plugin fails to load, open `oxide/logs/<date>/oxide_<date>.txt` in the Volume Browser — the compile error is usually printed there. The two most common causes are (a) the plugin targets a newer Oxide API than the currently-installed version, and (b) a required **dependency plugin** (often `ImageLibrary`, `Economics`, or `Clans`) is missing.

#### Updating or removing a plugin

* **Update**: overwrite the existing `.cs` file in `oxide/plugins/` with the newer version. Oxide will reload it automatically.
* **Remove**: delete the `.cs` file from `oxide/plugins/`. Oxide unloads it on the fly. The plugin's config and data files stay in `oxide/config/` and `oxide/data/` in case you re-add the plugin later — delete them manually if you want a clean slate.

> ⚠️ **Monthly forced wipes can break plugins.** Facepunch's first-Thursday protocol update often changes internal API signatures. Expect some portion of your plugin stack to need updates or replacements after each forced wipe. Check uMod or the plugin author's page for a post-update release.

***

### Connecting to RCON / WebRCON

RCON is the remote console used by admin tools and gives you the ability to run any `server.*` or `oxide.*` command without being in-game. The password is the **RCON\_PASSWORD** you entered at deployment — there is no default value, so there is nothing to "change" the way the old image required.

Connect via:

* **Facepunch WebRCON** – open [facepunch.com/rust/rcon](https://facepunch.com/rust/rcon), enter `<primary-ip>:28016` and your RCON password. Gives you a live console, player list, chat feed, and any `server.*` / `oxide.*` / `kick` / `ban` command.
* **RustAdmin Desktop** – a Windows GUI tool that wraps WebRCON with player lists, scheduled tasks, chat commands, and backups. Especially handy for managing a modded server because you can run `o.plugins`, `o.reload`, and `oxide.grant`/`oxide.revoke` without logging into the game.
* **WebSocket URL** – if you script your own tools, the endpoint is:

    ```
    ws://<primary-ip>:28016/<your-rcon-password>
    ```

> 💡 **Prefer the app domain for RCON too.** Just like game traffic, `<your-app-domain>.app.runonflux.io:28016` points at the current primary, so your admin tooling keeps working after a failover.

If you ever need to rotate the RCON password, open your application settings, click **Update**, edit the `RCON_PASSWORD` field, click **Review**, and sign the update. Updates to existing apps are **free of charge** on the Flux network.

***

### Setting Server Admins, Moderators, and Bans

Rust uses two text files in the server identity folder for permissions, plus runtime RCON commands. The files are located on the persistent volume:

```
/srv/rust/server/rustoxide/cfg/users.cfg
/srv/rust/server/rustoxide/cfg/bans.cfg
```

Each file contains **one command per line**, using SteamID64s. To grant yourself owner-level access:

1. Look up your SteamID64 (e.g. via [steamid.io](https://steamid.io) — it's a 17-digit number starting with `7656119…`).
2. In the **Volume Browser**, open `users.cfg` (create it if it does not exist) and add a line:

    ```
    ownerid 76561198000000000 "YourName" "Server owner"
    ```

    Use `moderatorid` instead of `ownerid` for moderators (can kick/ban but cannot give items or change cvars).

3. Save the file and restart the application from **Control → Local → Restart Application**.
4. In-game, press **F1** to open the console — you now have access to all `server.*`, `oxide.*`, and plugin admin commands.

> 💡 **Tip:** Oxide permissions are separate from `ownerid`/`moderatorid`. Being an owner gives you the built-in Rust admin commands, but many Oxide plugins gate their features behind *their own* permissions — you still need to `oxide.grant user <steamid> <plugin.permission>` to use them. The `*` wildcard works: `oxide.grant user 76561198000000000 *` gives a single player every plugin permission.

***

### Managing Save/World Data

Rust persists the entire world inside your server identity folder. For a modded server, **Oxide plugin state is part of your server's valuable data** — back it up alongside the world save.

```
/srv/rust/server/rustoxide/
├── proceduralmap.<seed>.<worldsize>.<protocol>.sav   ← the world
├── player.blueprints.*.db                             ← per-player blueprints
├── player.deaths.*.db                                 ← per-player death log
├── player.identities.*.db                             ← steamid ↔ user mapping
├── cfg/
│   ├── server.cfg
│   ├── users.cfg
│   └── bans.cfg
└── oxide/
    ├── plugins/        ← .cs files
    ├── config/         ← plugin JSON configs
    ├── data/           ← plugin runtime state
    ├── lang/           ← translations
    └── logs/           ← plugin log output
```

You can:

* **Download a backup** via the Volume Browser before forced wipes, plugin updates, or major game updates.
* **Migrate from another host** by uploading both the `proceduralmap.*.sav` and the `oxide/data/` + `oxide/config/` folders.
* **Wipe the map but keep your plugin stack** by deleting only the `proceduralmap.*.sav` + `proceduralmap.*.map` + `player.*.db` files and leaving the `oxide/` folder untouched.

> ⚠️ **Protocol wipes**: The filename protocol segment changes on the **first Thursday of each month**. A save from an older protocol cannot be loaded — this is standard Rust behaviour, not Flux-specific. Plan your wipe schedule around it.

***

### Frequently Asked Questions

#### Why can't I connect right after deployment?

On first boot the container loads Oxide and generates a procedural map before opening the game port. This usually takes 5–15 minutes for a default worldsize. Watch the container logs from **Applications → Management → Logs** and wait for both the `Loaded extension Oxide` and `Server startup complete` messages before attempting to connect.

***

#### Where do I drop plugin `.cs` files?

`/srv/rust/server/rustoxide/oxide/plugins/`. Upload via **Applications → Management → Settings → Secure Shell → Volume Browser**. Oxide hot-loads the plugin within seconds — no restart required. Plugin configs are auto-generated in `oxide/config/` on first load.

***

#### A plugin is not loading — how do I debug it?

Check `/srv/rust/server/rustoxide/oxide/logs/<date>/oxide_<date>.txt` in the Volume Browser. Compile errors are printed there. The most common causes are (a) a newer Oxide API than the plugin supports, (b) a missing dependency plugin (e.g. `ImageLibrary`, `Economics`, `Clans`), or (c) an invalid config file JSON. Fix the issue and run `oxide.reload <PluginName>` in WebRCON.

***

#### How do I give myself or a player admin permissions on plugins?

Use Oxide's permission commands via WebRCON or the in-game console:

```
oxide.grant user <steamid64> <plugin.permission>
oxide.usergroup add <steamid64> <group>
```

To grant all permissions to a single player: `oxide.grant user <steamid64> *`. The built-in Rust admin commands (`ownerid` / `moderatorid`) are separate from Oxide permissions — you need both for plugins that check Oxide perms.

***

#### What ports does Rust use?

Rust uses UDP port **28015** for gameplay traffic, TCP port **28016** for RCON / WebRCON, and UDP port **28017** for the Steam server-browser query. FluxCloud exposes all three automatically. When connecting by IP you must specify the game port (`client.connect 1.2.3.4:28015`); when connecting by the app domain the port is resolved by DNS and you do not need to append it.

***

#### How do I change the server name, description, or RCON password?

All three were set at deployment as user fields. Open **Applications → Management**, click **Update**, edit the field, click **Review**, and sign the update (free on Flux). The container restarts with the new value. As an alternative for hostname/description only, you can add `server.hostname "..."` / `server.description "..."` lines to `server.cfg` — `server.cfg` is loaded after the launch args, so it wins.

***

#### Is RCON enabled? How do I connect?

Yes. WebRCON listens on TCP port 28016 and uses the `RCON_PASSWORD` you set at deployment. Connect via [facepunch.com/rust/rcon](https://facepunch.com/rust/rcon) or a desktop tool like RustAdmin using `<primary-ip>:28016` (or `<your-app-domain>.app.runonflux.io:28016`) and your password. On a modded server RCON is especially useful because you can run all `oxide.*` commands remotely.

***

#### What happens if the primary server goes down?

If your current primary server becomes unavailable or experiences downtime, one of the standby instances automatically takes over as the new primary after a short delay. Your world save, configuration, admin/ban lists, plugin files, plugin configs, and plugin data are all preserved on the persistent volume, so the game resumes where you left off once the switch is complete. You can check which instance is currently the primary from your application's management panel under the **Instances** tab.

> 💡 **Tip:** If you connect via the app domain (`your-app-domain.app.runonflux.io`, no port suffix) instead of the raw IP, your client will keep reaching the correct primary automatically after a failover.

***

#### How can I update my game server and Oxide?

The `pfeiffermax/rust-game-server:latest-oxide` image is rebuilt upstream shortly after each Rust or Oxide release — both components are baked into the image rather than downloaded at runtime. To pick up the newest combined build, open **Applications → Management**, select your Rust server, go to the **Control** tab, choose **Local**, and click **Restart Application**. Flux re-pulls the latest image on restart. Your plugins are **not** auto-updated — you need to download newer `.cs` files from uMod and drop them in `oxide/plugins/` yourself.

***

#### Does Rust do forced wipes, and how does it affect plugins?

Yes — the **first Thursday of each month** brings a mandatory protocol update that invalidates the previous world save and frequently breaks plugins that hook into internal APIs. After a forced wipe, expect to:

1. Restart the app so Flux pulls the freshly-rebuilt image with the new Rust + Oxide versions.
2. Generate a fresh map (delete old `proceduralmap.*.sav` / `.map` and restart).
3. Check `oxide/logs/` for plugin compile errors.
4. Update broken plugins by grabbing the latest `.cs` from uMod.

Many community servers wipe blueprints and plugin data (kits, economy balances) at the same time for a clean slate.

***

#### Can I migrate a modded server from another host?

Yes. Upload:

* The `proceduralmap.*.sav` file (the world).
* `oxide/plugins/` (the plugin `.cs` files).
* `oxide/config/` (plugin configs).
* `oxide/data/` (plugin runtime state — **critical** for kits, zones, economy, clans).

...to the corresponding paths under `/srv/rust/server/rustoxide/` via the Volume Browser, then restart the application.

***

#### Can I pin Oxide to a specific version if a new release breaks my plugins?

Not with the `latest-oxide` tag — it always tracks the freshest combined Rust + Oxide build. The upstream repo does publish pinned tags of the form `oxide-build-<id>`, but the FluxCloud Marketplace template is hard-wired to `latest-oxide`. If you need a pinned version, redeploy using a custom app rather than the Marketplace template, or simply wait for plugin authors to ship an updated `.cs` file (this usually happens within a day or two of a forced wipe).
