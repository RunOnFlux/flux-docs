# Satisfactory

This guide walks you through the process of **deploying, managing, and connecting to a Satisfactory Dedicated Server** using FluxCloud. Whether you're kicking off a new factory or expanding an existing save, this page provides step-by-step instructions and key details for a seamless experience.

The FluxCloud Satisfactory template is built on the popular `wolveix/satisfactory-server` image, which bundles SteamCMD and keeps the Coffee Stain dedicated server binaries up to date on every restart.

For more information on **Satisfactory** visit: [https://www.satisfactorygame.com](https://www.satisfactorygame.com). For the server image documentation, see: [https://github.com/wolveix/satisfactory-server](https://github.com/wolveix/satisfactory-server).

***

### How To Install a Satisfactory Server

#### **Steps**

1. **Access FluxCloud**

* Visit [cloud.runonflux.com](https://cloud.runonflux.com) and sign in or create an account.


2. **Find the Satisfactory Server**

* Navigate to the **Marketplace → Games** tab, then locate the **Satisfactory** tile and click **View Details**.

3. **Select Server Configuration**

* Choose your preferred configuration based on expected player count:
  * **Satisfactory 6GB** — 6GB RAM, 2 CPU cores, 60GB SSD, up to **4 players**. Ideal for small groups of friends.
  * **Satisfactory 8GB** — 8GB RAM, 2 CPU cores, 80GB SSD, up to **12 players**. Balanced for medium-sized groups.
  * **Satisfactory 12GB** — 12GB RAM, 2 CPU cores, 90GB SSD, up to **24 players**. Recommended for larger communities or heavily modded saves.
* Click **Install Now** to continue.

4. **Choose Subscription**

* Select your desired **subscription duration**.
* Agree to the **Terms of Use** and **Privacy Policy**, and click the blue **Continue** arrow at the bottom.

5. **Deployment Location**

* Configure whether you want your Satisfactory server to deploy in specific geographic regions:
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

### First Launch — Allow Time for the Server Download

When your Satisfactory server starts for the very first time, the container uses **SteamCMD to download the full dedicated server binaries** (several gigabytes) before the game port is opened. This is normal and only happens on the first boot.

* Expect the initial download and extraction to take **10–20 minutes** depending on node bandwidth and disk speed.
* During this time the server will not accept player connections.
* You can follow progress from **Applications → Management → Logs** in FluxCloud. Once you see `Game server started` / `Server is ready` in the log, the server is accepting connections.
* Subsequent restarts are fast — the binaries are persisted on the volume and only patched when Coffee Stain releases an update.

***

### Finding the IP of Your Game Server

Flux runs on a decentralized network, meaning your application is deployed across **three instances**.\
For game servers, a **Primary/Standby** setup is used — your game runs on the primary instance, while others are on standby for redundancy.

To find your server's **primary IP address**:

1. Visit [**cloud.runonflux.com**](https://cloud.runonflux.com) and log in.
2. Go to **Applications → Management**.
3. Click the **Settings icon** on your Satisfactory Server.
4. Open the **Instances** tab.
   * The **Primary IP address** is shown here.
   * You can also view geolocation details for all instances.

To connect to your server from the Satisfactory client:

1. Launch **Satisfactory** and open the **Server Manager** from the main menu.
2. Click **Add Server**.
3. Enter your **Primary IP address** followed by the game port — for example:

    ```
    1.2.3.4:7777
    ```

4. Give the server a local nickname and click **Confirm**.
5. Once the server appears as **Online**, select it and claim it (see **Claiming the Server** below) or join an existing session.

> 💡 **Tip:** Satisfactory 1.0 dedicated servers use UDP port **7777** for gameplay traffic.

#### Connecting via Domain Instead of IP

Every FluxCloud Marketplace game server is also reachable through its **application domain**. Flux's load balancer forwards traffic over DNS and is already configured with the correct game port, so you keep a stable address even when the primary instance changes due to failover.

* Find your app domain under **Applications → Management → Information**.
* Use it in the Satisfactory client in place of the IP address. The game port is already baked into the domain's DNS routing, so you do **not** need to append `:7777`:

    ```
    your-app-domain.app.runonflux.io
    ```

Using the domain means you never have to update your saved server entry when the primary switches.

***

### Claiming the Server (Admin Setup)

Satisfactory dedicated servers use a **first-connect claim flow** to assign the server administrator — there is no admin chat command or superuser file.

1. Add and connect to your server from the client as described above.
2. When the server is **unclaimed**, the client automatically prompts you to set an **Admin Password**.
3. Enter a strong password and confirm. You are now the administrator.
4. From the **Server Manager**, you can:
   * Rename the server (visible in the in-game browser).
   * Create a new game session or load an existing save.
   * Upload save files, change tick rate, toggle auto-pause, and manage other server settings — all from the built-in UI.

> ⚠️ **Keep your Admin Password safe.** Anyone with it can modify or wipe the world. If you forget it, you can reset it by removing `/config/gamefiles/FactoryGame/Saved/SaveGames/server/Server.sav` via the Volume Browser and re-claiming on next connect (this will also clear server-side settings, not your world saves).

***

### Adjusting Server Settings

Most settings (server name, admin password, max players, auto-pause, tick rate, session management) are edited **directly from the in-game Server Manager UI** after you've claimed the server — no file editing required.

For advanced tuning (engine flags, network parameters), you can edit the Unreal Engine config files through the **Volume Browser**:

1. Go to **Applications → Management** on [cloud.runonflux.com](https://cloud.runonflux.com) and select your Satisfactory app.
2. Click the **Settings icon**, open the **Secure Shell** tab and scroll to **Volume Browser**.
3. Config files live under:

    ```
    /config/gamefiles/FactoryGame/Saved/Config/LinuxServer/
    ```

    Common files: `Game.ini`, `Engine.ini`, `Scalability.ini`.
4. Save your changes, then open the **Control** tab, select **Local**, and click **Restart Application** so the new settings take effect.

> ⚠️ **Important:** Invalid config values can prevent the server from starting. Back up any file before editing and revert if the server fails to boot.

***

### Managing Save Files

Your world saves live on the persistent volume at:

```
/config/gamesaves/
```

Each save is a `.sav` file. You can:

* **Download a backup** via the Volume Browser before risky changes or major game updates.
* **Upload an existing save** from a single-player game (or another server) to continue your adventure — drop the `.sav` file into `/config/gamesaves/` and load it from the in-game Server Manager.
* **Roll back** by replacing the current save file with a backup and restarting the application from the **Control** tab.

***

### Installing Mods

Mods are installed into the persistent volume and survive restarts. There are two supported workflows on FluxCloud.

> 💡 **Key paths inside the container**
>
> | Path | Purpose |
> | ---- | ------- |
> | `/config/gamefiles/` | Satisfactory dedicated server installation |
> | `/config/gamefiles/FactoryGame/Mods/` | Mod files live here |
> | `/config/gamesaves/` | World save files |

#### Option 1 — `ficsit-cli` (recommended, via SSH)

`ficsit-cli` is the official command-line tool from the Satisfactory modding team. It resolves dependencies and version-matches mods automatically, and is the most reliable option in an SSH-only environment.

1. Open **Applications → Management** on [cloud.runonflux.com](https://cloud.runonflux.com), select your Satisfactory app, click the **Settings icon** and open the **Secure Shell** tab.
2. Download `ficsit-cli` inside the container:

    ```bash
    curl -L https://github.com/satisfactorymodding/ficsit-cli/releases/latest/download/ficsit_linux_amd64 -o /tmp/ficsit
    chmod +x /tmp/ficsit
    ```

3. Register your server installation:

    ```bash
    /tmp/ficsit installation add /config/gamefiles
    ```

4. Find and install a mod (use the mod reference from its page on [ficsit.app](https://ficsit.app)):

    ```bash
    /tmp/ficsit search <mod-name>
    /tmp/ficsit install <mod-reference>
    ```

5. Apply the changes — this downloads and places mod files into `/config/gamefiles/FactoryGame/Mods/`:

    ```bash
    /tmp/ficsit apply
    ```

6. Restart the server from **Control → Local → Restart Application**.

#### Option 2 — Manual upload (via Volume Browser)

Best if you prefer a graphical workflow or already have mod files downloaded.

1. Go to [ficsit.app](https://ficsit.app) and download the mod(s) — each mod ships as a `.smod` file, which is a zip archive.
2. Unzip locally to extract the `.pak`, `.utoc` and `.ucas` files (and any folder structure they come in).
3. In the **Volume Browser**, navigate to:

    ```
    /config/gamefiles/FactoryGame/Mods/
    ```

4. Upload the extracted mod folder(s) there.
5. Restart the server from **Control → Local → Restart Application**.

> ⚠️ **Dependencies must be uploaded manually too.** Each mod page on ficsit.app lists its required dependencies — download and upload them the same way. Missing dependencies will prevent mods from loading.

#### Option 3 — Satisfactory Mod Manager (not supported)

Satisfactory Mod Manager (SMM) can manage remote servers over SFTP, but FluxCloud containers do not expose SFTP. Use **Option 1** or **Option 2** instead.

#### Important notes for players connecting to a modded server

* **Client mods must match server mods.** Every player connecting must install the same mods (and versions) locally using SMM ([smm.ficsit.app](https://smm.ficsit.app)).
* Some mods are **server-side only** or **client-side only** — check the label on each mod's ficsit.app page.
* After any mod change, **restart the server** for it to take effect.
* Mods may break after a Satisfactory game update. Wait for mod authors to release compatible versions before updating the server, or pin to a previous game version via the server config.

***

### Frequently Asked Questions

#### Why can't I connect right after deployment?

The first launch downloads the full Satisfactory dedicated server (several gigabytes) via SteamCMD before opening the game port. This usually takes 10–20 minutes. Watch the container logs from **Applications → Management → Logs** and wait for the `Server is ready` message before attempting to connect.

***

#### What port does Satisfactory use?

The Satisfactory dedicated server uses UDP port `7777` for gameplay. FluxCloud exposes this port automatically. When connecting by IP you must specify the port (`1.2.3.4:7777`); when connecting by the app domain the port is resolved by DNS and you do not need to append it.

***

#### How do I change the admin password?

Change it directly from the in-game **Server Manager** while connected as the current administrator. There is no config file to edit for this.

***

#### What happens if the primary server goes down?

If your current primary server becomes unavailable or experiences downtime, one of the standby instances automatically takes over as the new primary after a short delay. Your world saves, mods, and server settings are preserved on the persistent volume, so the game resumes where you left off once the switch is complete. You can check which instance is currently the primary from your application's management panel under the **Instances** tab.

> 💡 **Tip:** If you connect via the app domain (`your-app-domain.app.runonflux.io`, no port suffix) instead of the raw IP, your client will keep reaching the correct primary automatically after a failover.

***

#### Can I use my own save file?

Yes. Upload your `.sav` file to `/config/gamesaves/` via the Volume Browser, then load it from the in-game **Server Manager → Manage Saves** tab.

***

#### Can I install mods?

Yes — see the **Installing Mods** section above for the two supported workflows (`ficsit-cli` over SSH or manual upload via Volume Browser).

***

#### How can I update my game server to the latest version?

The `wolveix/satisfactory-server` image pulls the latest Satisfactory dedicated server build via SteamCMD on every startup. To update immediately, open **Applications → Management**, select your Satisfactory server, go to the **Control** tab, choose **Local**, and click **Restart Application**.
