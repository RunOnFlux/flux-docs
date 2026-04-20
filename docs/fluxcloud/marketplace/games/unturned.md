# Unturned

This guide walks you through the process of **deploying, managing, and connecting to an Unturned Dedicated Server** using FluxCloud. Whether you're building a small survival camp with friends or running a large PvP community with custom maps and workshop mods, this page provides step-by-step instructions and key details for a seamless experience.

The FluxCloud Unturned template is built on the `ich777/steamcmd:unturned` image, which bundles SteamCMD and keeps the Unturned Dedicated Server (Steam app `1110390`) up to date on every restart.

For more information on **Unturned** visit: [https://smartlydressedgames.com](https://smartlydressedgames.com). For server documentation, see: [https://docs.smartlydressedgames.com/en/latest/servers/server-hosting.html](https://docs.smartlydressedgames.com/en/latest/servers/server-hosting.html). For the container image, see: [https://github.com/ich777/docker-steamcmd-server](https://github.com/ich777/docker-steamcmd-server).

***

### How To Install an Unturned Server

#### **Steps**

1. **Access FluxCloud**

* Visit [cloud.runonflux.com](https://cloud.runonflux.com) and sign in or create an account.


2. **Find the Unturned Server**

* Navigate to the **Marketplace → Games** tab, then locate the **Unturned** tile and click **View Details**.

3. **Select Server Configuration**

* Choose your preferred configuration based on expected player count:
  * **12 Slots** — 2GB RAM, 1 CPU core, 8GB SSD. Ideal for small groups of friends running the default PEI map.
  * **24 Slots** — 3GB RAM, 2 CPU cores, 10GB SSD. Balanced for medium-sized communities on larger maps like Washington or Russia.
  * **32 Slots** — 4GB RAM, 2.5 CPU cores, 10GB SSD. Recommended for large communities, PvP servers, and workshop-heavy setups with custom maps and mods.
* Click **Install Now** to continue.

4. **Choose Subscription**

* Select your desired **subscription duration**.
* Agree to the **Terms of Use** and **Privacy Policy**, and click the blue **Continue** arrow at the bottom.

5. **Deployment Location**

* Configure whether you want your Unturned server to deploy in specific geographic regions:
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

### First Launch — Allow Time for the Server to Download

When your Unturned server starts for the very first time, the container uses **SteamCMD to download the full Unturned Dedicated Server** before the game port is opened. This is normal and only happens on the first boot.

* Expect the initial download and validation to take **5–15 minutes** depending on node bandwidth and disk speed.
* During this time the server will not accept player connections and will not appear in the in-game server browser.
* You can follow progress from **Applications → Management → Logs** in FluxCloud. Once you see `Loading level` / `Server startup complete` in the log, the server is ready.
* Subsequent restarts are fast — the binaries are persisted on the volume and only patched when Smartly Dressed Games releases an update (SteamCMD `VALIDATE=true` is enabled, so files are verified on every boot).

***

### Finding the IP of Your Game Server

Flux runs on a decentralized network, meaning your application is deployed across **three instances**.\
For game servers, a **Primary/Standby** setup is used — your game runs on the primary instance, while others are on standby for redundancy.

To find your server's **primary IP address**:

1. Visit [**cloud.runonflux.com**](https://cloud.runonflux.com) and log in.
2. Go to **Applications → Management**.
3. Click the **Settings icon** on your Unturned Server.
4. Open the **Instances** tab.
   * The **Primary IP address** is shown here.
   * You can also view geolocation details for all instances.

To connect to your server from the Unturned client:

1. Launch **Unturned** and click **Play → Connect**.
2. Enter your **Primary IP address** and the game port — for example:

    ```
    IP:   1.2.3.4
    Port: 27015
    ```

3. Enter the server password if one has been configured (see below), then click **Connect**.
4. Alternatively, add the server to your favourites from the **Servers** browser using the same IP and port.

> 💡 **Tip:** Unturned uses UDP port **27015** for gameplay traffic and UDP **27016** for the Steam query port. Both are exposed by the FluxCloud template automatically.

#### Connecting via Domain Instead of IP

Every FluxCloud Marketplace game server is also reachable through its **application domain**. Flux's load balancer forwards UDP traffic over DNS and is already configured with the correct game port, so you keep a stable address even when the primary instance changes due to failover.

* Find your app domain under **Applications → Management → Information**.
* Use it in the Unturned client in place of the IP address. The game port is already baked into the domain's DNS routing, so you do **not** need to append `:27015`:

    ```
    your-app-domain.app.runonflux.io
    ```

Using the domain means you never have to update your saved server entry when the primary switches.

***

### Adjusting Server Settings (`Commands.dat`)

Unturned's primary server configuration lives in **`Commands.dat`**, a plain-text file on the persistent volume. Each line is a startup command that is executed when the server boots — this is how you set the server name, password, map, player cap, game mode, perspective, and more.

Settings are edited through the **Volume Browser**:

1. Go to **Applications → Management** on [cloud.runonflux.com](https://cloud.runonflux.com) and select your Unturned app.
2. Click the **Settings icon**, open the **Secure Shell** tab and scroll to **Volume Browser**.
3. Open (or create) the server commands file:

    ```
    /serverdata/serverfiles/Servers/Default/Server/Commands.dat
    ```

4. Common commands you may want to add (one per line):

    ```
    Name My Flux Unturned Server
    Password mySecretPassword
    Welcome Welcome to my Flux-hosted Unturned server!
    Map PEI
    MaxPlayers 24
    Mode Normal
    PvP
    Perspective Both
    Cheats off
    Save 1200
    ```

5. Save your changes, then open the **Control** tab, select **Global**, and click **Restart Application** so the new settings take effect.

Useful command reference:

| Command | Purpose |
| ------- | ------- |
| `Name <text>` | Server name shown in the browser |
| `Password <text>` | Password required to join (remove the line to make the server public) |
| `Map <name>` | Starting map (`PEI`, `Washington`, `Yukon`, `Russia`, `Germany`, `Hawaii`, `Arid`, `Kuwait`, or a workshop map) |
| `MaxPlayers <n>` | Concurrent player cap (match your plan's slot count) |
| `Mode <Easy|Normal|Hard>` | Overall difficulty |
| `PvP` / `PvE` | Combat mode |
| `Perspective <First|Third|Both|Vehicle>` | Allowed camera perspectives |
| `Welcome <text>` | Message of the day shown on join |
| `Gold` | Restrict the server to players who own the Gold Upgrade |
| `Cheats <on|off>` | Enable or disable cheat commands |
| `Save <seconds>` | Auto-save interval |
| `Port <n>` | Advanced — change the game port (leave at `27015` unless you know what you're doing) |

> ⚠️ **Important:** Lines in `Commands.dat` are case-sensitive for command names. The server only re-reads the file on startup, so always restart the application after editing.

#### Deeper gameplay rules (`Config.json`)

For finer-grained tuning — loot tables, stat modifiers, animal spawns, structure decay, vehicle respawn timers, zombie behaviour — edit:

```
/serverdata/serverfiles/Servers/Default/Server/Config.json
```

This file must remain valid JSON. Back it up before editing and restart the application from the **Control** tab after saving.

***

### Listing Your Server Publicly (Game Server Login Token)

Since Unturned `3.21.31.0`, the dedicated server requires a **Steam Game Server Login Token (GSLT)** to appear on the public **Internet** server list. Without one, your server still runs and accepts connections — **your players can join and play online via the Primary IP or the app domain** — but it will be hidden from the in-game server browser and your join code will be regenerated every restart.

If you just want to play with friends using direct connect (IP or app domain), you can skip this section. If you want your server to appear in the public browser and keep a stable join code, add a GSLT.

#### 1. Generate a GSLT on Steam

1. Visit [steamcommunity.com/dev/managegameservers](https://steamcommunity.com/dev/managegameservers) and log in with the Steam account you want to tie the server to. Your account must:
   * Not be limited, banned, or community-banned.
   * Have a **qualifying registered phone number** attached.
   * Own Unturned on Steam (the game is free on app ID `304930`).
2. In **Create a new game server account**, set:
   * **App ID:** `304930`
   * **Memo:** a short label to remind you which server this token is for (e.g. `Flux Unturned PEI`).
3. Click **Create** and copy the **Login Token** string that appears.

> ⚠️ **Treat the token like a password.** Anyone with it can impersonate your server on Steam. Don't paste it into public channels and regenerate it if it leaks.

#### 2. Add the Token to `Commands.dat`

1. Open **Applications → Management → Settings → Secure Shell → Volume Browser** and edit:

    ```
    /serverdata/serverfiles/Servers/Default/Server/Commands.dat
    ```

2. Add the `GSLT` line on its own line (replace `your_token_here` with the string from Steam):

    ```
    GSLT your_token_here
    ```

3. Save the file, then restart the application from **Control → Global → Restart Application**.

Alternatively, the token can be set in `/serverdata/serverfiles/Servers/Default/Server/Config.json` under the `Browser` section as `Login_Token` — either location works, but do not set it in both.

Once the server restarts with a valid GSLT, it will be listed on the Internet server browser and your **server join code** will remain stable across restarts.

***

### Setting Server Admins, Bans, and Whitelists

Unturned uses simple text files in the server folder for moderation. Each file contains **one SteamID64 per line**.

```
/serverdata/serverfiles/Servers/Default/Server/Adminlist.dat
/serverdata/serverfiles/Servers/Default/Server/Banned.dat
/serverdata/serverfiles/Servers/Default/Server/Whitelist.dat
```

To grant yourself admin:

1. Look up your SteamID64 (e.g. via [steamid.io](https://steamid.io)).
2. In the **Volume Browser**, edit `Adminlist.dat` and add your SteamID64 on a new line. You can use `Owner <steamid64>` in `Commands.dat` instead to make yourself a server owner with full permissions (including the ability to grant admin in-game).
3. Save the file and restart the application from **Control → Global → Restart Application**.
4. In-game, open the chat with `/` and run admin commands such as `/kick`, `/ban`, `/admin <player>`, `/give <item>`, `/vehicle <id>`, etc.

`Banned.dat` and `Whitelist.dat` behave the same way — one SteamID64 per line. In-game `/ban` and `/unban` commands update `Banned.dat` automatically, but manual edits through the Volume Browser also work.

> 💡 **Tip:** Set `Whitelist` in `Commands.dat` to enable whitelist-only mode — only Steam IDs listed in `Whitelist.dat` will be allowed to join. Useful for private friend groups.

***

### Managing Save/World Data

Unturned persists the entire world (player positions, built structures, dropped items, vehicles, NPC states) inside the server instance's `Level/` folder:

```
/serverdata/serverfiles/Servers/Default/Level/<MapName>/
```

For example, a PEI server saves to `Servers/Default/Level/PEI/`. You can:

* **Download a backup** via the Volume Browser before risky changes, map swaps, or major game updates.
* **Upload a world** from another Unturned server by replacing the `Level/<MapName>/` folder, then restarting the application.
* **Wipe the server** by deleting the `Level/<MapName>/` folder and restarting — the server will regenerate a fresh world on the next boot.

> ⚠️ **Important:** Changing the `Map` command in `Commands.dat` causes the server to load a different `Level/<MapName>/` folder on next start. Your old save is not deleted — switching back to the original map will load the previous world intact.

***

### Installing Workshop Mods and Custom Maps

Unturned has full Steam Workshop integration. The dedicated server can subscribe to workshop items via a config file, and SteamCMD will download them on boot.

#### Option 1 — Workshop subscriptions (recommended)

1. Browse the Unturned Workshop at [steamcommunity.com/app/304930/workshop](https://steamcommunity.com/app/304930/workshop/) and copy the **File ID** from each item's URL (the number after `?id=`).
2. In the **Volume Browser**, open (or create) the workshop config file:

    ```
    /serverdata/serverfiles/Servers/Default/WorkshopDownloadConfig.json
    ```

3. Add the IDs as a JSON array:

    ```json
    {
      "File_IDs": [
        1234567890,
        2345678901
      ]
    }
    ```

4. If a workshop item is a **custom map**, set `Map <map_folder_name>` in `Commands.dat` to match the folder the map ships under.
5. Restart the application from **Control → Global → Restart Application**. SteamCMD will download or update the workshop items on boot.

#### Option 2 — Manual mod upload

For vehicle packs, weapon packs, or asset overrides distributed outside the Workshop:

1. Download the mod package.
2. Upload its contents to the relevant subfolder under the server install — typically:

    ```
    /serverdata/serverfiles/Bundles/Workshop/
    ```

3. Restart the server.

> ⚠️ **Client-side content.** Maps and asset mods must also be installed (or auto-downloaded via Workshop) on every player's client. Workshop subscriptions are the cleanest way to keep clients in sync — players who don't already own the item will be prompted to download it on first connect.

***

### Frequently Asked Questions

#### Why can't I connect right after deployment?

The first launch downloads the full Unturned Dedicated Server via SteamCMD before opening the game port. This usually takes 5–15 minutes. Watch the container logs from **Applications → Management → Logs** and wait for the `Server startup complete` message before attempting to connect.

***

#### What ports does Unturned use?

Unturned uses UDP port `27015` for gameplay traffic and UDP `27016` for the Steam query port. FluxCloud exposes both automatically. When connecting by IP you must specify the game port (`1.2.3.4` on port `27015`); when connecting by the app domain the port is resolved by DNS and you do not need to append it.

***

#### How do I change the server name or password?

Edit `/serverdata/serverfiles/Servers/Default/Server/Commands.dat` via the Volume Browser. Set (or add) the `Name <text>` and `Password <text>` lines to the values you want. Save, then restart the application from **Control → Global → Restart Application**. Remove the `Password` line entirely to make the server public.

***

#### How do I change the map or game mode?

Edit `Commands.dat` and update the `Map <name>` and `Mode <Easy|Normal|Hard>` / `PvP` / `PvE` lines. Save and restart the application. Note that each map has its own `Level/<MapName>/` save folder — switching maps does not delete the old world; switching back loads it again.

***

#### What happens if the primary server goes down?

If your current primary server becomes unavailable or experiences downtime, one of the standby instances automatically takes over as the new primary after a short delay. Your world saves, admin lists, workshop items, and server configuration are preserved on the persistent volume, so the game resumes where you left off once the switch is complete. You can check which instance is currently the primary from your application's management panel under the **Instances** tab.

> 💡 **Tip:** If you connect via the app domain (`your-app-domain.app.runonflux.io`, no port suffix) instead of the raw IP, your client will keep reaching the correct primary automatically after a failover.

***

#### Do I need a Steam Game Server Login Token (GSLT) to play?

No — players can join and play online without a GSLT using the Primary IP or the app domain (direct connect). A GSLT is only required if you want your server to appear in the in-game **Internet** server browser and to keep a stable server join code between restarts. See the **Listing Your Server Publicly** section for how to generate one at [steamcommunity.com/dev/managegameservers](https://steamcommunity.com/dev/managegameservers) and add it to `Commands.dat` with `GSLT <token>`.

***

#### Can I run a whitelist-only / private server?

Yes. Add `Whitelist` to `Commands.dat` to enable whitelist mode, then list the allowed SteamID64s (one per line) in `Whitelist.dat`. Only whitelisted players will be allowed to join. Combine with a `Password` for an extra layer of access control.

***

#### Can I install workshop mods and custom maps?

Yes — see the **Installing Workshop Mods and Custom Maps** section above. Add workshop File IDs to `/serverdata/serverfiles/Servers/Default/WorkshopDownloadConfig.json` and restart the server. Players connecting to a modded server must subscribe to the same workshop items locally (Steam will prompt them on first connect).

***

#### How can I update my game server to the latest version?

The `ich777/steamcmd:unturned` image pulls the latest Unturned Dedicated Server build via SteamCMD on every startup (with `VALIDATE=true` to repair any corrupted files). To update immediately, open **Applications → Management**, select your Unturned server, go to the **Control** tab, choose **Global**, and click **Restart Application**.
