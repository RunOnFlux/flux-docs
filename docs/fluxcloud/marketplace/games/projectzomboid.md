# Project Zomboid

This guide walks you through the process of **deploying, managing, and connecting to a Project Zomboid (Build 41) Dedicated Server** using FluxCloud. Whether you're starting a fresh outbreak in Knox Country or migrating an existing world, this page provides step-by-step instructions and key details for a seamless experience.

The FluxCloud Project Zomboid template is built on the `danixu86/project-zomboid-dedicated-server` image, which handles SteamCMD installation, automatic configuration from environment variables, and Steam Workshop mod support.

For more information on **Project Zomboid** visit: [https://projectzomboid.com](https://projectzomboid.com). For the server image documentation, see: [https://github.com/Danixu/project-zomboid-server-docker](https://github.com/Danixu/project-zomboid-server-docker).

***

### How To Install a Project Zomboid Server

#### **Steps**

1. **Access FluxCloud**

* Visit [cloud.runonflux.com](https://cloud.runonflux.com) and sign in or create an account.


2. **Find the Project Zomboid Server**

* Navigate to the **Marketplace → Games** tab, then locate the **Project Zomboid** tile and click **View Details**.

3. **Select Server Configuration**

* Choose your preferred configuration based on expected player count:
  * **8 Slots** — 4GB RAM, 2 CPU cores, 15GB SSD. Ideal for a small group of friends.
  * **16 Slots** — 6GB RAM, 2.5 CPU cores, 20GB SSD. Balanced for medium communities.
  * **32 Slots** — 10GB RAM, 4 CPU cores, 30GB SSD. Recommended for large groups or heavily modded servers.
* Click **Install Now** to continue.

4. **Provide Server Configuration Values**

* Fill in the required fields:
  * **SERVERNAME** — the internal server identifier (no spaces or special characters). All of your server's files — config, world save, player database — are named after this value. **Changing it later effectively creates a brand-new world**, so pick it carefully.
  * **DISPLAYNAME** — the name shown in the in-game public server browser. This can contain spaces and can be changed later.
  * **SERVERPRESET** — the game difficulty preset used to generate your world's sandbox settings: `Apocalypse` (default), `Beginner`, `Builder`, `FirstWeek`, `SixMonthsLater`, `Survival`, or `Survivor`. The preset is applied **only on first launch** — choose before deploying, as changing it afterwards requires resetting your sandbox settings.
  * **ADMINPASSWORD** — the password for the server's admin account. **Required** — the server will not start without it. Use a strong password.
* Optionally fill in:
  * **PASSWORD** — a join password players must enter to connect. Leave empty for no join password. *(Applied after the first restart — see below.)*
* Optionally expand **Advanced Settings** to configure:
  * **ADMINUSERNAME** — the admin account username. Choose from `admin` (default), `serveradmin`, or `owner`.

5. **Choose Subscription**

* Select your desired **subscription duration**.
* Agree to the **Terms of Use** and **Privacy Policy**, and click the blue **Continue** arrow at the bottom.

6. **Deployment Location**

* Configure whether you want your Project Zomboid server to deploy in specific geographic regions:
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

When your Project Zomboid server starts for the very first time, the container downloads the full **dedicated server files from Steam** via SteamCMD and generates your world configuration before it can accept connections. This is normal and only happens on first launch (or after a major game update).

* Expect the initial download and setup to take **several minutes** (typically 5–15 minutes depending on network conditions and node performance).
* You can follow progress by opening **Applications → Management → Logs** in FluxCloud and watching the container output. Once you see `*** SERVER STARTED ***` / `Server Steam ID` messages, the server is up.
* Subsequent restarts are much faster — the server files are cached on the persistent volume.

***

### Required: Restart Once After First Launch

The server generates its configuration file (`<SERVERNAME>.ini`) during the **first** boot. Because that file does not exist yet when the container applies your settings, three of your values cannot be written on the very first launch:

* The **join password** (`PASSWORD`)
* The **public server browser listing** and your **DISPLAYNAME**

These are applied automatically on the **next** start. After your server finishes its first launch:

1. Go to **Applications → Management** on [cloud.runonflux.com](https://cloud.runonflux.com) and select your Project Zomboid app.
2. Click the **Settings icon**, open the **Control** tab, select **Local**, and click **Restart Application**.

After this one restart, your server name appears in the in-game browser and the join password (if you set one) is enforced. You do not need to repeat this on later restarts.

> ⚠️ Until this restart is done, your server is joinable **without** a password and is **not listed** in the public server browser.

***

### Finding the IP of Your Game Server

Flux runs on a decentralized network, meaning your application is deployed across multiple instances.\
For game servers, a **Primary/Standby** setup is used — your game runs on the primary instance, while the other instance is on standby for redundancy.

To find your server's **primary IP address**:

1. Visit [**cloud.runonflux.com**](https://cloud.runonflux.com) and log in.
2. Go to **Applications → Management**.
3. Click the **Settings icon** on your Project Zomboid Server.
4. Open the **Instances** tab.
   * The **Primary IP address** is shown here.
   * You can also view geolocation details for all instances.

To connect to your server from the Project Zomboid client:

1. Launch **Project Zomboid** and click **Join**.
2. Open the **Favorites** tab and add your server:
   * **IP:** your Primary IP address
   * **Port:** `36261`
3. Alternatively, find your server in the **Internet** tab of the server browser by searching for your `DISPLAYNAME` (available after the post-deploy restart), or join through a **Steam friend invite**.
4. Enter an **Account Username** and **Account Password** of your choice — Project Zomboid creates a per-server character account for each player on first join. Remember these credentials; you'll need them to log back in as the same character.
5. If you configured a join password, enter it in the **Server Password** field.

> 💡 **Tip:** Your server uses UDP ports `36261` (main game port) and `36262` (direct-connection port). Both are exposed automatically by FluxCloud — players only ever need to enter `36261`.

#### Connecting via Domain Instead of IP

Every FluxCloud Marketplace game server is also reachable through its **application domain**. Flux's load balancer forwards UDP traffic over DNS and is already configured with the correct game port, so you keep a stable address even when the primary instance changes due to failover.

* Find your app domain under **Applications → Management → Information**.
* Use it in the **IP field** of the Favorites tab in place of the IP address. The game port is already baked into the domain's DNS routing, so you do **not** need to append `:36261`:

    ```
    your-app-domain.app.runonflux.io
    ```

Using the domain means you never have to update your saved server entry when the primary switches.

***

### Becoming Admin In-Game

Your server has a built-in admin account, created from the `ADMINUSERNAME` and `ADMINPASSWORD` you provided at deployment.

1. Join your server and, at the login screen, enter your **ADMINUSERNAME** (default `admin`) as the Account Username and your **ADMINPASSWORD** as the Account Password.
2. Once in-game, an **Admin** icon appears on the left side of the screen — click it to open the **Admin Panel**, where you can edit server options, manage players, spawn items and vehicles, and teleport.
3. You can also run admin commands from the chat (press **T**), for example:
   * `/setaccesslevel "PlayerName" admin` — promote another player (levels: `admin`, `moderator`, `overseer`, `gamemaster`, `observer`).
   * `/players` — list connected players.
   * `/kickuser "PlayerName" -r "reason"` / `/banuser "PlayerName" -r "reason"` — moderation.
   * `/servermsg "Server restarting in 5 minutes"` — broadcast a message.
   * `/save` — force a world save.
   * `/help` — list all available commands.

> ⚠️ Only share the admin credentials with people you trust — the admin account has full control over the server and the world.

***

### Adjusting Server Settings

#### Changing deployment values (environment variables)

The values you provided at deployment (`DISPLAYNAME`, `PASSWORD`, `ADMINPASSWORD`, etc.) can be changed later:

1. Go to **Applications → Management** on [cloud.runonflux.com](https://cloud.runonflux.com) and select your Project Zomboid app.
2. Click the **Settings icon** and open the **Specifications** tab, then click **Update**.
3. Navigate to the **Component** tab — here you will find the environment variables. Edit the values you want to change.
4. Click **Review** in the top-right corner to review your changes.
5. Confirm and **sign the update** — the update is registered on the network **free of charge**.
6. Allow **several minutes** for the update to propagate across the Flux network. Your server will restart with the new settings.

> ⚠️ **Important:** Do **not** modify the pre-set `PORT`, `PUBLIC`, or `MEMORY` variables. In particular, `PORT` intentionally contains `36261 -udpport 36262` to configure both game ports natively — changing it will break connectivity. Also avoid changing `SERVERNAME` unless you intend to start a brand-new world (see FAQ).

#### Editing the server configuration file

All other server options live in the server's `.ini` file on the persistent volume, named after your `SERVERNAME`:

1. Click the **Settings icon**, open the **Secure Shell** tab and scroll to **Volume Browser**.
2. Open the file:

    ```
    /home/steam/Zomboid/Server/<SERVERNAME>.ini
    ```

3. Common settings you may want to change:
   * `MaxPlayers=` — the player cap. The game's default is `32`; set this to match your plan (e.g. `8` or `16`) to keep performance consistent.
   * `PVP=` — enable/disable player-versus-player (default `true`).
   * `PauseEmpty=` — pause the world simulation when no players are online (default `true`).
   * `Open=` — set to `false` to switch the server to whitelist mode (players must be pre-created with `/adduser`).
   * `PublicDescription=` — the description shown in the server browser.
4. Save your changes, then open the **Control** tab, select **Local**, and click **Restart Application** so the new settings take effect.

> ⚠️ **Important:** Some `.ini` values (`Password`, `Public`, `PublicName`, `Mods`, `WorkshopItems`) are re-applied from environment variables on every start and will be **overwritten** at boot. Change those through the **Specifications → Component** update flow instead.

#### Tuning gameplay difficulty (Sandbox settings)

Zombie population and behaviour, loot rarity, day length, XP multipliers, water/electricity shutoff and similar gameplay rules are stored separately, in:

```
/home/steam/Zomboid/Server/<SERVERNAME>_SandboxVars.lua
```

This file is generated from your `SERVERPRESET` on first launch. You can fine-tune individual values via the Volume Browser, save, and restart the application to apply.

> ⚠️ **Important:** Invalid configuration values can prevent the server from starting. Back up any file before editing and revert if the server fails to boot. Note that many sandbox settings (like zombie population) only fully affect **newly explored** map areas — already-visited areas keep their existing state.

***

### Managing the World Save

Your world data lives on the persistent volume, named after your `SERVERNAME`:

| Path | Contents |
| ---- | -------- |
| `/home/steam/Zomboid/Saves/Multiplayer/<SERVERNAME>/` | The world save — map state, buildings, loot, player positions |
| `/home/steam/Zomboid/db/<SERVERNAME>.db` | The player database — accounts, whitelist, admin access levels |
| `/home/steam/Zomboid/Server/` | Server configuration files |

#### Download a backup

Use the **Volume Browser** to download the world save folder and the `.db` file before risky changes (mod installs, game updates, sandbox edits). Saved files can be re-uploaded later using the procedure below.

#### Roll back to a previous backup / Upload an existing world

Simply dropping save files onto a running server is unreliable: the server holds the world files open and writes autosaves on a timer, so a copy that overlaps with an autosave can leave the world in a half-written state. Pause the container first:

1. Open **Applications → Management**, select your Project Zomboid app, and switch to **Control → Local → Pause Container**. Pausing stops the server from writing to the world while you upload.
2. Open the **Volume Browser** and upload your world folder into:

    ```
    /home/steam/Zomboid/Saves/Multiplayer/<SERVERNAME>/
    ```

    Also upload the matching player database to `/home/steam/Zomboid/db/<SERVERNAME>.db` if you want to keep player accounts and characters.
3. Return to **Control → Local → Restart Container**. The server starts with the uploaded world.

> 💡 **Tip:** When migrating a world from another host, the save folder and database must be renamed to match **your** `SERVERNAME` exactly — Project Zomboid finds them by name.

***

### Installing Mods (Steam Workshop)

The server image has built-in support for **Steam Workshop** mods through two environment variables. Mods are downloaded by the server itself — no manual file uploads required.

1. Find the mods you want on the [Project Zomboid Steam Workshop](https://steamcommunity.com/app/108600/workshop/). For each mod, note from its Workshop page:
   * The **Workshop ID** (the number at the end of the page URL).
   * The **Mod ID** (listed in the mod's description).
2. In FluxCloud, open your application settings, go to the **Specifications** tab, click **Update**, and open the **Component** tab.
3. Add two new environment variables (semicolon-separated lists, no spaces):

    ```
    WORKSHOP_IDS=2169435993;2392709985
    MOD_IDS=tsarslib;BetterSorting
    ```

4. Click **Review**, confirm, and sign the update. Allow several minutes for the change to propagate; the server restarts automatically.
5. Mods are downloaded on the next start and **activated on the start after that** — map mods can take one additional restart while the server detects and registers the new map. If mods don't appear active immediately, restart the application once more from **Control → Local → Restart Application**.

> ⚠️ **Important:** All players connecting to a modded server must subscribe to the same Workshop mods locally. Allow extra startup time after adding large mods — they are downloaded through Steam on the server's next boot. Mods may break after a game update; remove a problematic mod from both lists to disable it.

***

### Frequently Asked Questions

#### Why can't I see my server in the in-game browser, and why is my join password not working?

Both are applied on the **second** server start. The configuration file the password and browser listing are written into is only generated during the first launch, so they cannot take effect until the next boot. Restart your application once from **Control → Local → Restart Application** after the first deployment — see [Required: Restart Once After First Launch](#required-restart-once-after-first-launch).

***

#### What ports does Project Zomboid use?

The server uses UDP port `36261` as the main game port and UDP port `36262` as the direct-connection port. FluxCloud exposes both automatically. When connecting by IP, players enter port `36261`; when connecting via the app domain, the port is resolved by DNS and does not need to be specified.

***

#### Players are asked for a username and password when joining — what are these?

That's normal Project Zomboid behaviour, not a Flux setting. Each player creates a personal account (username + password) on your server when they first join; it stores their character. These accounts live in the server's player database (`db/<SERVERNAME>.db`) and are unrelated to the server **join password**, which is the shared `PASSWORD` you optionally set at deployment.

***

#### Can I change the difficulty preset after deployment?

The `SERVERPRESET` only generates your sandbox settings file on the **first** launch — changing the variable later has no effect on an existing world. To adjust difficulty afterwards, edit individual values in `/home/steam/Zomboid/Server/<SERVERNAME>_SandboxVars.lua` via the Volume Browser, or use the in-game **Admin Panel → Sandbox Options** as the admin account. Keep in mind many settings only affect newly explored areas.

***

#### What happens if I change SERVERNAME?

Project Zomboid names every server file — configuration, sandbox settings, world save, and player database — after the `SERVERNAME`. Changing it makes the server generate a **fresh world with default settings** under the new name. Your old world is not deleted; reverting `SERVERNAME` to the previous value brings it back.

***

#### What happens if the primary server goes down?

If your current primary server becomes unavailable or experiences downtime, the standby instance automatically takes over as the new primary after a short delay. Your world save, player database, and configuration are preserved on the persistent volume, so the game resumes where you left off once the switch is complete. You can check which instance is currently the primary from your application's management panel under the **Instances** tab.

> 💡 **Tip:** If you connect via the app domain (`your-app-domain.app.runonflux.io`, no port suffix) instead of the raw IP, your client will keep reaching the correct primary automatically after a failover.

***

#### How can I update my game server to the latest version?

The server checks for updates from Steam during startup. To update immediately, open **Applications → Management**, select your Project Zomboid server, go to the **Control** tab, choose **Local**, and click **Restart Application**. The latest Build 41 dedicated server files are pulled on the next boot.

***

#### The server feels sluggish with many players — what can I do?

* Set `MaxPlayers=` in the `.ini` to match the plan you purchased (8/16/32) instead of leaving the game default of 32 on a smaller plan.
* Keep `PauseEmpty=true` so the simulation rests while nobody is online.
* Heavy mod lists (especially map mods) increase RAM usage significantly — consider upgrading to a larger configuration if you run many mods.
