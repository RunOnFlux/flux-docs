# FiveM

This guide walks you through the process of **deploying, managing, and connecting to a FiveM (GTA V) Roleplay Server** using FluxCloud. FiveM is the Cfx.re multiplayer modification for Grand Theft Auto V — it lets you run your own custom roleplay (RP) city with frameworks like **qbcore**, **ESX**, or **Qbox**, your own resources, jobs, economy, and rules.

The FluxCloud FiveM template is built on the `spritsail/fivem:latest` image and ships with **txAdmin** (the official web management panel) built in. It is a **three-component** deployment — the FiveM server itself, a **MariaDB** database, and the **Flux-Shared-DB Operator** that keeps the database synced across all three instances of your app for redundancy.

For more information on **FiveM** visit: [https://fivem.net](https://fivem.net). For the container image, see: [https://github.com/spritsail/fivem](https://github.com/spritsail/fivem).

***

### Before You Begin — Get Your Cfx.re Server Key

FiveM dedicated servers must be registered with Cfx.re using a free **server key** (also called a license key). The key string starts with `cfxk_`. You'll paste it into txAdmin after the server boots, so generate it first:

1. Visit [https://portal.cfx.re](https://portal.cfx.re) and sign in (or create a free Cfx.re account).
2. Open the **Server Keys** section and click **+ New**.
3. Choose **Use IP address-based authentication** is **not** required — leave it as a standard key so it works regardless of which Flux node is primary.
4. Give the key a label (e.g. `Flux RP Server`) and create it.
5. Copy the full `cfxk_...` string — you'll paste it into the txAdmin setup wizard later.

> ⚠️ **Keep your server key private.** Anyone with this key can run a server as you, and abuse can get the key (and your Cfx.re account) suspended. You can revoke and regenerate keys anytime from the same portal page.

> 💡 **A legal copy of GTA V is required for players.** Everyone connecting to your server — including you — needs GTA V (PC) installed plus the free FiveM client from [fivem.net](https://fivem.net). The server itself does **not** need a copy of the game.

***

### How To Install a FiveM Server

#### **Steps**

1. **Access FluxCloud**

* Visit [cloud.runonflux.com](https://cloud.runonflux.com) and sign in or create an account.


2. **Find the FiveM Server**

* Navigate to the **Marketplace → Games** tab, then locate the **FiveM** tile and click **View Details**.

3. **Select Server Configuration**

* Choose your preferred configuration based on expected player count and how heavy your resource pack is:
  * **32 Slots** — FiveM 6GB RAM + MySQL 1GB + Shared-DB 1GB · 3.5 CPU · 25GB SSD. Good for a small private RP community or a server with a light resource list.
  * **48 Slots** — FiveM 8GB RAM + MySQL 2GB + Shared-DB 1GB · 5.5 CPU · 35GB SSD. Balanced for a mid-sized RP server running a full framework (qbcore/ESX) plus common resources.
  * **64 Slots** — FiveM 12GB RAM + MySQL 2GB + Shared-DB 2GB · 6.5 CPU · 50GB SSD. Recommended for large public RP cities with heavy resource packs, MLOs, and high player counts.
* Click **Install Now** to continue.

> 💡 **FiveM is CPU-bound, and resources are RAM-hungry.** RP frameworks run a lot of server-side scripting on a single main thread. A big resource list (custom MLOs, lots of jobs, AI scripts) will use far more CPU and RAM than the slot count alone suggests. If you plan to run a heavy framework build, pick a larger tier than your player count would imply.

4. **Provide Server Configuration Values**

   The template deploys three components. Two of them ask for a value at deployment time — and **they must match each other**:

   | Field | Component | What it does |
   | ----- | --------- | ------------ |
   | **MYSQL\_ROOT\_PASSWORD** | `mariadb` | The MySQL root password. Your RP framework and the Shared-DB Operator both authenticate with it. Use a strong random value (16+ characters). |
   | **DB\_INIT\_PASS** | `operator` | The Shared-DB Operator's password to MySQL. **Must be the exact same value** you entered for `MYSQL_ROOT_PASSWORD`. |

   > ⚠️ **`MYSQL_ROOT_PASSWORD` and `DB_INIT_PASS` must be identical.** The Operator authenticates to MariaDB with `DB_INIT_PASS`; if it doesn't match the database's root password, the Operator can't connect and txAdmin will never reach the database. Set both fields to the same strong random string and save it somewhere safe — you'll also need it in the txAdmin setup wizard.

5. **Choose Subscription**

* Select your desired **subscription duration**.
* Agree to the **Terms of Use** and **Privacy Policy**, and click the blue **Continue** arrow at the bottom.

6. **Deployment Location**

* Configure whether you want your FiveM server to deploy in specific geographic regions:
  * **Global (Recommended):** No geographic restrictions for best availability.
  * **Custom:** Restrict by continent or country — useful if your RP community is concentrated in one region and you want to minimise latency.
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

### How the Three Components Fit Together

Unlike most game templates, FiveM deploys as **three components** that work together. It helps to know what each one does before you start configuring:

| Component | Image | Role |
| --------- | ----- | ---- |
| **fivem** | `spritsail/fivem:latest` | The FiveM server itself, with **txAdmin** built in. Exposes port **30120** (game traffic, TCP+UDP) and **40120** (txAdmin web UI). |
| **mariadb** | `mariadb:10.6` | The MySQL database that stores all persistent RP data — characters, inventories, vehicles, money, jobs. Pinned to **10.6**; it is never contacted directly. |
| **operator** | `runonflux/shared-db:latest` | The **Flux-Shared-DB Operator**. It sits in front of MariaDB and replicates every write across all three instances of your app, so your database survives a failover. txAdmin connects here, not to MariaDB directly. |

The important takeaway: **txAdmin and your framework talk to the `operator` component, never to `mariadb` directly.** The Operator's job is to keep the database identical on every instance so that when the primary changes, no RP data is lost.

> ⚠️ **MariaDB is pinned to 10.6 on purpose.** MariaDB 10.10+ introduced UCA1400 collations that break the `mysql2` driver used by `oxmysql` (the database resource every major framework relies on). Do **not** change the `mariadb` image tag.

***

### First Launch — What to Expect

When your FiveM app starts for the first time:

1. **Image pull** — Flux pulls the three component images onto the primary node. First deployment only.
2. **Database initialisation** — MariaDB creates the empty `fivem` database, and the Shared-DB Operator connects and begins syncing. This takes a minute or two.
3. **txAdmin starts** — the FiveM component boots txAdmin and opens the web UI on port **40120**. The game server itself (port 30120) stays **offline** until you finish the txAdmin setup wizard.

* Expect the first boot to take **a few minutes** while images are pulled and the database initialises.
* The game server will **not** appear in the FiveM server list yet — that's expected. It only comes online after you complete the setup wizard and deploy a server build.
* You can follow progress from **Applications → Management → Logs**. Watch the `fivem` component for the txAdmin startup banner and the `operator` component for a successful database connection.

***

### Configuring Your Server in txAdmin

txAdmin is where almost all FiveM configuration happens. The first time you open it, it runs a **setup wizard**.

#### 1. Open the txAdmin Web UI

txAdmin listens on port **40120**, and Flux gives that port its own dedicated domain — no IP needed:

1. Go to **Applications → Management** on [cloud.runonflux.com](https://cloud.runonflux.com) and select your FiveM app.
2. Open the **Information** tab — each exposed port has its own domain, in the format `<app-name>_<port>.app.runonflux.io`.
3. Open the **port 40120** domain in your browser. It looks like this:

    ```
    https://<your-app-name>_40120.app.runonflux.io
    ```

> 💡 **Use the domain, not the IP.** The port-`40120` domain always points at the current primary instance, so the txAdmin link keeps working even after a failover. You *can* reach txAdmin at `http://<primary-ip>:40120` (find the primary IP under the **Instances** tab), but you'd have to update it every time the primary changes.

#### 2. Create the txAdmin Admin Account

On first load txAdmin asks you to create a **master admin** account — a username and password used to log into the panel itself. This is **not** the same as your Cfx.re account or your MySQL password. Store it safely.

#### 3. Link Your Cfx.re Account and Server Key

The wizard will ask you to link your Cfx.re account and provide a **server key**. Paste the `cfxk_...` key you generated earlier. The template sets `NO_LICENSE_KEY=1` specifically so that the key is supplied here through txAdmin rather than baked into the deployment.

#### 4. Configure the Database Connection

This is the step that connects FiveM to the database stack. In the txAdmin **Database** screen, enter the connection details **manually** — txAdmin's auto-detect will not find the Operator:

| Field | Value |
| ----- | ----- |
| **Host** | `operator` |
| **Port** | `3307` |
| **Username** | `root` |
| **Password** | the `MYSQL_ROOT_PASSWORD` you set at deployment |
| **Database** | `fivem` |

> 💡 **Why `operator` and port `3307`?** You connect through the Flux-Shared-DB Operator, not MariaDB directly. The Operator presents MySQL on hostname `operator` port `3307` inside your app's private network, and replicates writes across all instances. Pointing txAdmin at MariaDB directly would break sync and you'd lose data on a failover.

#### 5. Choose a Server Build / Recipe

Finally, the wizard lets you pick how to populate the server:

* **Popular recipe** — txAdmin can deploy a ready-made build such as a **qbcore**, **ESX**, or **Qbox** framework starter. This is the fastest way to get a working RP server; the recipe downloads the framework, its resources, and imports the base SQL schema into your database automatically.
* **Local folder / blank** — start with an empty `server.cfg` and add resources yourself (for experienced server owners migrating an existing build).

Once you confirm, txAdmin downloads the FiveM server artifact and the chosen resources, writes `server.cfg`, and starts the game server. After this completes, port **30120** goes live and your server becomes connectable.

***

### Connecting to Your Game Server

Flux runs on a decentralized network, meaning your application is deployed across **three instances**.\
For game servers, a **Primary/Standby** setup is used — your game runs on the primary instance, while others are on standby for redundancy.

Once you've completed the txAdmin setup wizard and the server is online, it **registers with Cfx.re and appears in the FiveM in-game server list** under the `sv_hostname` you set in `server.cfg`.

To connect:

1. Launch **FiveM** (you must have GTA V installed).
2. Open the **Players / Servers** browser and use the **search/filter box** to type your server name (`sv_hostname`).
3. Click your server in the results and press **Connect**.

That's the easiest route for you and your players — no IP or port to remember, just the server name.

#### Connecting Directly by Domain or IP

You can also connect directly without searching the list:

* **By app domain (recommended)** — Flux's load balancer forwards game traffic over DNS with the correct port already baked in, so you do **not** append `:30120`. Find your app domain under **Applications → Management → Information**, then in the FiveM **F8 console** type:

    ```
    connect <your-app-domain>.app.runonflux.io
    ```

  Using the domain means you never have to update a saved favourite when the primary switches after a failover.

* **By primary IP** — find the **Primary IP address** under **Applications → Management → Instances**, then connect with the game port `30120`:

    ```
    connect <primary-ip>:30120
    ```

  You can also enter `<primary-ip>:30120` in the FiveM **Direct Connect** tab. Note the IP changes if the primary instance fails over — the domain does not.

> 💡 **Tip:** FiveM uses port **30120** for game traffic (both TCP and UDP) and port **40120** for the txAdmin web UI. Both are exposed by the FluxCloud template automatically.

***

### Adjusting Server Settings (`server.cfg`)

FiveM's main configuration file is **`server.cfg`**. It sets your server name, slot count, tags, the resources that load (`ensure <resource>`), convars, and admin principals. You can edit it two ways:

* **Through txAdmin (recommended)** — open the txAdmin panel, go to **Settings → CFG Editor**. Edit, save, and txAdmin will prompt you to restart the server. This is the safest route because txAdmin validates the file.
* **Through the Volume Browser** — `server.cfg` and the rest of the server data live on the persistent volume mounted at `/config` inside the `fivem` component. Open **Settings icon → Secure Shell → Volume Browser**, navigate into `/config`, and edit the file directly. Restart the app from the **Control** tab afterwards.

Common `server.cfg` settings you may want to change:

| Setting | Purpose |
| ------- | ------- |
| `sv_hostname "<text>"` | Server name shown in the FiveM server browser |
| `sv_maxclients <n>` | Maximum player slots — keep this at or below the tier you purchased (32 / 48 / 64) |
| `sv_projectName "<text>"` / `sv_projectDesc "<text>"` | Project name and description shown on the connect screen |
| `ensure <resource>` | Loads a resource on startup — one line per resource |
| `set steam_webApiKey "<key>"` | A Steam Web API key, if your framework uses Steam identifiers |
| `add_principal identifier.fivem:<id> group.admin` | Grants in-game admin to a player |
| `sv_endpointprivacy true` | Hides player IPs from the server list |

> ⚠️ **Important:** Always restart the server after editing `server.cfg` — it is only read on startup. A bad line (a missing resource in an `ensure`, an unbalanced quote) can prevent the server from booting. If that happens, check the `fivem` component logs, fix the offending line, and restart.

> 💡 **Keep `sv_maxclients` within your tier.** Setting it higher than the slots you paid for won't add capacity — the server will still run out of CPU and RAM. If you need more headroom, update the app to a larger configuration instead.

***

### Installing Resources and Frameworks

Resources are the scripts, maps, and assets that make up your RP server. They live in the `resources/` folder on the `/config` volume.

To add a resource:

1. Open **Settings icon → Secure Shell → Volume Browser** and navigate to `/config/resources/`.
2. Upload the resource folder (or use txAdmin's built-in resource management if the resource is part of a recipe).
3. Add an `ensure <resource-name>` line to `server.cfg` (via the txAdmin CFG Editor or the Volume Browser).
4. Restart the server, or use the txAdmin live console command `ensure <resource-name>` / `restart <resource-name>` to load it without a full restart.

> 💡 **Frameworks (qbcore / ESX / Qbox) usually ship a SQL schema.** When you add a framework manually, import its `.sql` file into the `fivem` database. You can do this from txAdmin's database tools, or by connecting a MySQL client to the Operator at `operator:3307` (user `root`, your `MYSQL_ROOT_PASSWORD`). If you deployed a framework through the txAdmin setup wizard recipe, the schema was already imported for you.

***

### Managing Data and Persistence

Your FiveM deployment keeps state in two places on the persistent volumes:

| Location | Component | Contents |
| -------- | --------- | -------- |
| `/config` | `fivem` | `server.cfg`, the FiveM server artifact, all `resources/`, txAdmin's `txData` (admin accounts, recipes, scheduled restarts, settings) |
| MariaDB data | `mariadb` | All persistent RP gameplay data — characters, inventories, vehicles, money, properties, jobs |

* **Back up before big changes.** Before swapping frameworks, doing a major resource update, or wiping characters, download a copy of `server.cfg` and your `resources/` folder from the Volume Browser, and export the database via a MySQL client connected to `operator:3307`.
* **The database is replicated automatically.** The Shared-DB Operator keeps MariaDB in sync across all three instances, so a failover does not lose RP data — but it is **not** a substitute for your own backups against accidental deletion or a bad SQL migration.
* **Wiping characters** is done at the database level — truncate or drop the relevant framework tables (e.g. `players`, `characters`) through a MySQL client. Always back up first.

***

### Frequently Asked Questions

#### Why isn't my server showing up in the FiveM server list right after deployment?

The game server (port 30120) stays offline until you complete the **txAdmin setup wizard** and deploy a server build. Open txAdmin on port `40120`, create your admin account, link your Cfx.re server key, configure the database connection, and pick a recipe. Once txAdmin finishes downloading the artifact and resources, the server comes online and registers with Cfx.re.

***

#### txAdmin says it can't connect to the database. What's wrong?

Almost always a password mismatch. The `MYSQL_ROOT_PASSWORD` (on the `mariadb` component) and `DB_INIT_PASS` (on the `operator` component) **must be identical**, and the password you type into the txAdmin Database screen must be that same value. Also confirm the Database screen uses **Host `operator`, Port `3307`, User `root`, Database `fivem`** — not `localhost` or `mariadb`. Check the `operator` component logs from **Applications → Management → Logs** for authentication errors.

***

#### Do I need a Cfx.re server key? Can I skip it?

The key is **required** for your server to stay online for more than a few minutes and to appear in the public server list. It's free — generate one at [portal.cfx.re](https://portal.cfx.re) under **Server Keys** and paste it into the txAdmin setup wizard. The template sets `NO_LICENSE_KEY=1` so the key is supplied through txAdmin.

***

#### How do I access txAdmin again after the initial setup?

Open the port-`40120` domain — `https://<your-app-name>_40120.app.runonflux.io` (or `http://<primary-ip>:40120`) — and log in with the **master admin** username and password you created during the setup wizard. From there you get the live console, player management, CFG editor, resource controls, and scheduled restarts.

***

#### How do I change the server name or slot count?

Edit `sv_hostname` and `sv_maxclients` in `server.cfg` — either through the txAdmin **CFG Editor** or the Volume Browser at `/config/server.cfg` — then restart the server. Keep `sv_maxclients` at or below the tier you purchased (32 / 48 / 64).

***

#### How do I install qbcore / ESX / Qbox?

The easiest way is to pick the framework as a **recipe** in the txAdmin setup wizard — it downloads the framework and imports its database schema automatically. To add one manually later, upload the framework's resources to `/config/resources/`, import its `.sql` schema into the `fivem` database, add the `ensure` lines to `server.cfg`, and restart.

***

#### What happens if the primary server goes down?

If your current primary server becomes unavailable or experiences downtime, one of the standby instances automatically takes over as the new primary after a short delay. Your `server.cfg`, resources, and txAdmin data are preserved on the persistent volume, and the **Flux-Shared-DB Operator** keeps the MariaDB database synced across instances — so RP data (characters, money, vehicles) is preserved and the server resumes where it left off once the switch completes. You can check which instance is currently primary from your application's management panel under the **Instances** tab.

> 💡 **Tip:** Connect via the app domain (`your-app-domain.app.runonflux.io`, no port suffix) instead of the raw IP, and use the port-`40120` domain (`https://<your-app-name>_40120.app.runonflux.io`) for txAdmin — both keep reaching the correct primary automatically after a failover.

***

#### How can I update my game server to the latest version?

The FiveM server artifact is managed by txAdmin — open the txAdmin panel and use its built-in **update** prompt to pull the latest server build, then restart. To update the underlying container images, open **Applications → Management**, select your FiveM server, go to the **Control** tab, choose **Local**, and click **Restart Application** — Flux re-pulls the latest images on restart.

***

#### Can I edit MariaDB directly?

You should connect through the **Operator** (`operator:3307`), not MariaDB directly. The Operator replicates every write across all three instances; writing straight to one MariaDB instance would desync your data and risk losing it on a failover. Use a MySQL client pointed at `operator:3307` with user `root` and your `MYSQL_ROOT_PASSWORD`.
