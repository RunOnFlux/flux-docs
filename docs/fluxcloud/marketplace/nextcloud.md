# Nextcloud

This guide walks you through the process of **deploying, configuring, and running a Nextcloud server** on FluxCloud. Nextcloud is the open-source, self-hosted productivity platform from Nextcloud GmbH that turns a single application into your own private cloud — files, photos, calendars, contacts, notes, and tasks, synced across every device and shareable with anyone you choose. With one Marketplace deployment you get a complete Nextcloud Hub instance running on Flux's decentralised network, with a persistent volume that holds your installation, your apps, and every byte of user data, replicated to a standby instance for redundancy.

The FluxCloud Nextcloud templates are built on the upstream `nextcloud:33-apache` Docker image maintained by [Nextcloud GmbH](https://github.com/nextcloud/docker). The container exposes Nextcloud's HTTP listener (port `80` inside the container, mapped to public port `33080` for **Personal** or `33081` for **Lite**) and persists the entire web root — installation, configuration, apps, and the user data folder — to a Flux-backed persistent volume mounted at `/var/www/html`. The image bundles **SQLite** as the database, so there are no extra containers to deploy and no database credentials to manage.

For more information on **Nextcloud** visit: [https://nextcloud.com](https://nextcloud.com). The administration manual lives at [https://docs.nextcloud.com/server/latest/admin_manual/](https://docs.nextcloud.com/server/latest/admin_manual/), and the source code is at [https://github.com/nextcloud/server](https://github.com/nextcloud/server).

***

### Choosing Between Nextcloud Lite and Nextcloud Personal

The Marketplace ships **two preconfigured tiers** of the same Nextcloud image. They are identical in features and capabilities — only the resource envelope and price differ.

| Tier | Best for | CPU | RAM | Storage | Public port | Price |
| ---- | -------- | --- | --- | ------- | ----------- | ----- |
| **Nextcloud Lite** | A single user — phone photo backup, personal documents, calendar, contacts. | 1.0 core | 2 GB | 25 GB SSD | `33081` | $3.00 |
| **Nextcloud Personal** | Up to **5 users** — households or small teams who need shared storage and collaboration. | 2.5 cores | 4 GB | 100 GB SSD | `33080` | $5.02 |

Both tiers deploy on **2 instances** in a primary/standby layout, run the **same `nextcloud:33-apache` image**, and use the **same bundled SQLite database**. You can resize the app later from **Applications → Management** if you outgrow the tier you started on — your data is preserved across resizes.

> 💡 **Why two tiers?** Nextcloud's RAM and CPU footprint is dominated by the number of concurrent connected clients (desktop sync clients, mobile photo uploads, WebDAV polling, CalDAV/CardDAV refreshes). A single user with one phone and one laptop fits comfortably in 2 GB of RAM; a household of five with multiple devices each, sharing a photo library and calendars, needs the bigger envelope to keep PHP responsive.

> ⚠️ **SQLite has a single-writer model.** It is the right choice for personal and small-team use — fewer moving parts, no DB credentials, simpler backups — but if you plan to onboard ~10+ active users you should plan to migrate to MariaDB or PostgreSQL eventually. Nextcloud has a built-in [database migration tool](https://docs.nextcloud.com/server/latest/admin_manual/configuration_database/db_conversion.html) (`occ db:convert-type`) for when that day comes.

***

### What you can do with Nextcloud on FluxCloud

Once deployed, your Nextcloud instance gives you the same surface area as a self-hosted Nextcloud Hub, including:

* **File sync and storage** — drop files into a folder on your laptop, see them on your phone, browse them in the web UI, share a public link, or grant another user access. End-to-end encryption is available as an opt-in app for sensitive folders.
* **Photo backup from mobile** — the Nextcloud iOS and Android apps automatically upload your camera roll on Wi-Fi or cellular, with originals preserved (no recompression).
* **Calendar (CalDAV)** — create, share, and subscribe to calendars; reachable from Apple Calendar, Outlook, Thunderbird, and any CalDAV-compatible client.
* **Contacts (CardDAV)** — manage address books that sync to your phone's native Contacts app.
* **Notes** — Markdown notes with sync to the official Nextcloud Notes mobile app.
* **Tasks (CalDAV VTODO)** — task lists that round-trip with Apple Reminders and OpenTasks on Android.
* **File sharing** — internal shares between users, public links (with optional password and expiry), and federated shares to other Nextcloud servers.
* **Versioning and trash bin** — every file gets automatic versioning; deletes go to trash for 30 days by default.
* **Apps store** — extend the server from inside the admin UI: add Mail, Deck (Kanban), Forms, Talk (chat), News (RSS), Maps, Cookbook, Memories (photo timeline), and dozens more, all without redeploying.
* **WebDAV access** — mount your Nextcloud files as a network drive on Windows, macOS, Linux, or any tool that speaks WebDAV.
* **Web Office (optional)** — install the Nextcloud Office app to view and lightly edit documents in the browser. **Real-time collaborative editing** requires running a separate Collabora Online or OnlyOffice container, which is not part of this template.
* **Federated identity (optional)** — connect Nextcloud to LDAP, SAML, or OAuth2 providers via official apps for organisations that already use SSO.

Nextcloud is a **drop-in alternative** to Google Drive, iCloud, and Dropbox — your data lives on Flux's persistent volume, encrypted at rest by the underlying storage, and you control every account, share, and access policy.

> 💡 **What this template does not include.** Real-time collaborative document editing (Collabora/OnlyOffice), the Talk high-performance signalling backend, full-text search via Elasticsearch, Redis caching, and antivirus scanning all require additional containers and are out of scope for the bundled Marketplace template. They can still be added as separate Flux apps and pointed at Nextcloud — see the [upstream documentation](https://docs.nextcloud.com/server/latest/admin_manual/installation/system_requirements.html) for each component.

***

### How To Install Nextcloud

#### **Steps**

1. **Access FluxCloud**

* Visit [cloud.runonflux.com](https://cloud.runonflux.com) and sign in or create an account.


2. **Find Nextcloud**

* Navigate to the **Marketplace → Productivity** tab, then locate either the **Nextcloud Lite** or **Nextcloud Personal** tile depending on the tier you want, and click **View Details**.

3. **Review the Server Configuration**

* The Nextcloud templates ship with **fixed configurations** (see the [tier comparison](#choosing-between-nextcloud-lite-and-nextcloud-personal) above):
  * **Lite** — 1 CPU core, 2 GB RAM, 25 GB SSD, deployed on 2 instances in primary/standby.
  * **Personal** — 2.5 CPU cores, 4 GB RAM, 100 GB SSD, deployed on 2 instances in primary/standby.
* You can resize the app later from **Applications → Management** without losing data.
* Click **Install Now** to continue.

4. **No required user fields**

   Both Nextcloud templates deploy **without any user-supplied fields**. The image is preconfigured with two environment variables:

   | Variable | Value | What it does |
   | -------- | ----- | ------------ |
   | `OVERWRITEPROTOCOL` | `https` | Forces Nextcloud to generate `https://` URLs in emails, share links, and redirects, even though the request reaches the container as plain HTTP behind Flux's TLS gateway. |
   | `TRUSTED_PROXIES` | `172.16.0.0/12 10.0.0.0/8 192.168.0.0/16` | Tells Nextcloud to trust `X-Forwarded-*` headers from Flux's internal gateway IPs, so client IPs are logged correctly and HTTPS is detected. |

   You do not need to change either of these. They are set so the app works correctly behind Flux's HTTPS gateway out of the box.

5. **Choose Subscription**

* Select your desired **subscription duration**.
* Agree to the **Terms of Use** and **Privacy Policy**, and click the blue **Continue** arrow at the bottom.

6. **Deployment Location**

* Configure whether you want your Nextcloud instance to deploy in specific geographic regions:
  * **Global (Recommended):** No geographic restrictions for best availability and the lowest probability of every instance being affected by the same regional incident.
  * **Custom:** Restrict by continent or country — useful if all your users are in one region and you want to minimise round-trip latency on file sync.
* Click the blue **Continue** arrow to proceed.

7. **Email Notifications**

* Optionally enter your email address to receive notifications about your application, including:
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

Nextcloud's first boot is heavier than most marketplace apps because the image extracts the entire web root onto the persistent volume on first start:

1. **Image pull** (~600–800 MB) — Flux pulls `nextcloud:33-apache` onto the primary node. First deployment only.
2. **Web root population** — the image's entrypoint detects an empty `/var/www/html` and copies the bundled Nextcloud installation onto the persistent volume. **This step is the slow part** — expect 1–3 minutes.
3. **Installation wizard** — once the web root is in place, Apache starts and Nextcloud waits for you to complete the in-browser installation wizard (next section).

* Expect the **first boot to take 3–6 minutes** end-to-end on a fresh deployment. Subsequent restarts are fast — the web root is already on the volume, so Apache just starts.
* You can follow progress from **Applications → Management → Logs**. Key log lines to watch for:
  * `Initializing nextcloud 33.x.x ...` — the entrypoint is populating the web root.
  * `apache2 -D FOREGROUND` — Apache is up and the installer page is reachable.

***

### Completing the Installation Wizard (First-Time Setup)

The very first time you visit your Nextcloud URL, you are sent to the **installation wizard**, not the login screen. This is where you create the admin account and choose the database. Both choices are baked into the volume — so **take your time and get them right the first time**.

1. Open **Applications → Management → Information** and copy your application domain (it looks like `nextcloudpersonal_<id>.app.runonflux.io` or `nextcloudlite_<id>.app.runonflux.io`).
2. Visit `https://<your-app-domain>.app.runonflux.io` in a browser.
3. You will see the **"Create an admin account"** screen:

    | Field | What to enter |
    | ----- | ------------- |
    | **Admin username** | A name for your admin account. Avoid `admin` if you can — pick something less guessable. |
    | **Admin password** | A long, unique password. **Store it in your password manager before clicking Install** — there is no easy recovery for this account. |

4. Expand **Storage & database** at the bottom of the form. **Leave "Data folder" set to `/var/www/html/data`** (the default) and **leave "Configure the database" set to `SQLite`** — this is the bundled, no-extra-container option, and switching it later is non-trivial.
5. Click **Install**. Nextcloud will run the schema migrations against SQLite and reload to the recommended-apps screen.
6. On the **"Recommended apps"** screen, you can either:
    * Click **Install recommended apps** to enable Calendar, Contacts, Mail, Notes, Talk, and a few others up front. **This is the easiest path for a personal cloud.**
    * Click **Cancel** to start with a minimal install and add apps later from the App Store.

7. You arrive at the Files dashboard logged in as the admin user. You are done.

> 💡 **The data folder lives inside `/var/www/html/data`.** Because the entire web root is on the persistent volume, your user files, the SQLite database (`nextcloud.db`), and the Nextcloud installation all live on the same volume. That makes backup and restore simple — but it also means an aggressive cleanup of `/var/www/html` will erase your data. Do not edit files there directly unless you know exactly what you are doing.

> ⚠️ **The admin password is the keys to the kingdom.** Anyone with it can read every file, install every app, and disable every user. Use a unique, strong password and enable two-factor authentication (Settings → Security → Two-factor backup codes / TOTP) immediately after first login.

***

### Adding More Users

After the admin account is created, you can invite up to **4 additional users** on Nextcloud Personal (5 total including you), or stay at **1 user** on Nextcloud Lite — these are not technical limits enforced by the server, but they are the quotas the resource tier was sized for.

1. Log in as the admin user.
2. Click your initials in the top-right and choose **Users**.
3. Click **+ New user** at the top-left and fill in the username, display name, password, and (optionally) email and quota.
4. Click the blue checkmark to create. The user can log in immediately at the same URL with the credentials you set.

> 💡 **Set a per-user quota.** Open the new user's row and use the **Quota** column to cap their usage (e.g. `20 GB`) so a single user filling their phone backup does not exhaust the volume for everyone else.

***

### Setting the Trusted Domain

Nextcloud refuses to serve requests for hostnames it does not recognise. The first time you visit your app domain, Nextcloud auto-adds it to its `trusted_domains` array — so this usually just works. But if you ever attach a [custom domain](../register-new-app/custom-domain-setup.md), you must register it manually:

1. Open **Applications → Management** on [cloud.runonflux.com](https://cloud.runonflux.com) and select your Nextcloud app.
2. Click the **Settings icon**, open the **Secure Shell** tab and use the **Volume Browser**.
3. Navigate to `/var/www/html/config/` and edit `config.php`.
4. Find the `trusted_domains` array and add your domain on a new line:

    ```php
    'trusted_domains' =>
    array (
      0 => 'nextcloudpersonal_xxx.app.runonflux.io',
      1 => 'cloud.example.com',
    ),
    ```

5. Save the file. Nextcloud picks up the change on the next request — no restart needed.

> ⚠️ **Do not remove the original `*.app.runonflux.io` entry** even after you add your custom domain. The Flux gateway uses it for health checks; removing it can cause your app to be flagged as unreachable.

***

### Connecting Clients

#### Web (browser)

Just visit `https://<your-app-domain>.app.runonflux.io` in any modern browser and log in. The full Files, Photos, Calendar, Contacts, and Settings UI is available without installing anything.

#### Desktop sync (Windows / macOS / Linux)

The Nextcloud desktop client mirrors selected folders between your Nextcloud server and your local filesystem.

1. Download the desktop client from [nextcloud.com/install/#install-clients](https://nextcloud.com/install/#install-clients).
2. Launch it and click **Log in**.
3. Enter your Flux app URL: `https://<your-app-domain>.app.runonflux.io`
4. The client opens a browser tab — log in there and click **Grant access**. The client receives a long-lived token and finishes setup.
5. Pick which folders to sync. The default is your entire Nextcloud → a folder called `Nextcloud` in your home directory; you can use **Selective sync** or **Virtual files** (Windows / macOS) to keep most files cloud-only and download on demand.

#### Mobile (iOS / Android)

The Nextcloud mobile apps cover photo backup, file browsing, file uploads, and notifications.

1. Install **Nextcloud** from the [App Store](https://apps.apple.com/app/nextcloud/id1125420102) or [Google Play](https://play.google.com/store/apps/details?id=com.nextcloud.client) (or [F-Droid](https://f-droid.org/en/packages/com.nextcloud.client/) on Android).
2. Tap **Log in** and enter your server URL: `https://<your-app-domain>.app.runonflux.io`
3. Sign in via the embedded browser and approve the app.
4. To enable photo backup, open **Settings → Auto upload** and choose the camera folders to upload.

The companion apps **Notes** ([iOS](https://apps.apple.com/app/nextcloud-notes/id813973264) / [Android](https://play.google.com/store/apps/details?id=it.niedermann.owncloud.notes)) and **Talk** ([iOS](https://apps.apple.com/app/nextcloud-talk/id1296825574) / [Android](https://play.google.com/store/apps/details?id=com.nextcloud.talk2)) work the same way — install, enter your server URL, log in.

#### Calendar and Contacts (CalDAV / CardDAV)

Once the **Calendar** and **Contacts** apps are enabled (they are part of the recommended apps), you can subscribe from any standard client.

* **Apple (iOS / macOS):** Settings → Calendar / Contacts → Add Account → Other → Add CalDAV / CardDAV Account
  * Server: `your-app-domain.app.runonflux.io`
  * Username/Password: your Nextcloud credentials
* **Thunderbird:** Add a new calendar → On the network → CalDAV → URL `https://<your-app-domain>.app.runonflux.io/remote.php/dav/calendars/<your-username>/`
* **Android (DAVx⁵):** install [DAVx⁵](https://www.davx5.com/), add account with the URL above and your credentials. DAVx⁵ exposes Nextcloud calendars and contacts to the native Android Calendar and Contacts apps.
* **Outlook:** install the [Outlook CalDav Synchronizer](https://caldavsynchronizer.org/) add-in.

#### WebDAV (mount as a network drive)

Every file in your Nextcloud is reachable over WebDAV at:

```
https://<your-app-domain>.app.runonflux.io/remote.php/dav/files/<your-username>/
```

* **Windows:** File Explorer → This PC → Map network drive → enter the URL above. Use your Nextcloud username and password.
* **macOS:** Finder → Go → Connect to Server → enter the URL.
* **Linux (GNOME):** Files → + Other Locations → enter the URL.
* **rclone / cyberduck / any WebDAV tool:** point at the same URL.

> 💡 **Use an "app password" for non-browser clients.** Open **Personal settings → Security → Devices & sessions → Create new app password** in the Nextcloud web UI. The token it produces can be used in any client that asks for username/password and is revocable in one click — without needing to change your master password.

***

### Installing and Managing Apps

Nextcloud's real power comes from its **App Store**. The bundled `nextcloud:33-apache` image starts with a minimal set; everything else is one click away.

1. Log in as the admin user.
2. Click your initials → **+ Apps**.
3. Browse by category (Files, Multimedia, Office & text, Organization, Communication, etc.) or search by name.
4. Click **Download and enable** on any app you want.

Apps install into `/var/www/html/custom_apps/` on the persistent volume, so they survive restarts and updates of the underlying Nextcloud image.

#### Apps worth knowing about

| App | What it does | Notes |
| --- | ------------ | ----- |
| **Calendar** | CalDAV calendar UI in the browser. | In recommended apps. |
| **Contacts** | CardDAV address book UI. | In recommended apps. |
| **Notes** | Markdown notes synced to mobile. | In recommended apps. |
| **Mail** | Browser email client (IMAP). | Useful if you want a single tab for everything. |
| **Deck** | Kanban boards. | Trello-style task management. |
| **Tasks** | VTODO task lists. | Round-trips with Apple Reminders. |
| **Photos** | Photo timeline, albums, faces (basic). | Heavier face/object recognition needs the Memories app + a separate facial recognition container. |
| **Talk** | 1:1 and group chat, audio, and video calls. | Group calls beyond ~4 participants need a separate signalling server (HPB / Janus). |
| **News** | RSS reader. | Pairs nicely with mobile apps. |
| **Two-Factor TOTP / WebAuthn** | Adds 2FA via authenticator app or hardware key. | **Strongly recommended for the admin account.** |
| **External Storage** | Mount S3, SFTP, Dropbox, etc. as folders inside Nextcloud. | Lets you bring existing storage in without copying. |
| **End-to-End Encryption** | Per-folder client-side encryption. | Server cannot recover files if you lose the key. |

> 💡 **Apps that need extra services.** Some apps (Talk for big calls, Office for collaborative editing, Memories for face recognition, full-text-search) require a second container. The Marketplace template does not include those — you can deploy them as separate Flux apps and configure the relevant Nextcloud app to point at them, but it is well outside one-click setup.

***

### Resource and Capacity Notes

The two tiers are sized around different real-world workloads. Here is what each one can comfortably handle:

| Workload | Lite (1 user) | Personal (5 users) |
| -------- | ------------- | ------------------ |
| Documents, spreadsheets, notes (cumulative) | ✅ ~20 GB headroom | ✅ ~95 GB headroom |
| Phone photo backup (one device) | ✅ Plenty of room for years | ✅ Multiple devices |
| Large media library (movies / RAW photos) | ⚠️ 25 GB fills fast | ⚠️ 100 GB fills with multi-user RAW |
| Concurrent active users | 1 | Up to ~5 active at once |
| Calendar / Contacts sync | ✅ | ✅ |
| Real-time collaborative editing | ❌ Needs Collabora/OnlyOffice | ❌ Same |
| Talk video calls > 4 people | ❌ Needs HPB | ❌ Same |
| Full-text search across files | ⚠️ Slow on SQLite without Elasticsearch | ⚠️ Same |
| Face recognition / photo AI | ⚠️ CPU-bound, slow | ⚠️ Slow for 5 users |

If you outgrow the tier — at any time you feel the hardware specifications no longer reflect your needs — open **Applications → Management → Update App Specifications** and adjust CPU / RAM / storage on the **Components** tab. Persistent data on `/var/www/html` is preserved across the change, and you are billed according to the new specifications — but always take a fresh backup first (next section).

***

### Backups

Nextcloud stores **everything that matters** on a single volume — installation, apps, configuration, the SQLite database (`/var/www/html/data/nextcloud.db`), and every user file under `/var/www/html/data/<username>/`. That makes backups simple: snapshot the volume, you have everything.

FluxOS gives you two ways to protect that data: the **built-in Backup & Restore** tool (snapshot of the entire `/var/www/html`, recommended) and direct **Volume Browser** downloads (granular, file-by-file). Use the built-in tool for routine snapshots, and the Volume Browser when you only need to grab a single file or migrate a specific user.

#### Option A — FluxOS Backup & Restore (recommended)

FluxCloud has a **first-class backup mechanism** that snapshots an application component's persistent data without taking the app offline. Snapshots can be downloaded locally, kept on FluxDrive, restored from a remote URL, or uploaded back later — all from the management UI.

**To create a snapshot:**

1. Open **Applications → Management** on [cloud.runonflux.com](https://cloud.runonflux.com), click the **Settings icon** on your Nextcloud app, and open the **Backup & Restore** tab.
2. (Optional) Use the **FluxNode IP selector** at the top right to choose which instance to snapshot — by default it targets the current primary, which is usually what you want.
3. Tick the `nextcloudpersonal` (or `nextcloudlite`) component and click **Create Backup**. The snapshot appears in the table below with its **Created Date**, **Expiry Date**, **Size**, and download/remove actions.
4. Click **Download** on the new row to save the snapshot to your computer. **Do this before the expiry date** shown in the table — expired snapshots are removed automatically.

> ⚠️ **For SQLite consistency, put Nextcloud in maintenance mode first.** SQLite uses write-ahead logging (WAL), so a snapshot taken during a write may capture an inconsistent state. Before clicking **Create Backup**, open **Secure Shell → Terminal** and run:
>
> ```bash
> php /var/www/html/occ maintenance:mode --on
> ```
>
> Take the snapshot, then run:
>
> ```bash
> php /var/www/html/occ maintenance:mode --off
> ```
>
> Maintenance mode blocks user logins and sync clients for the ~30–60 seconds the snapshot takes — a fair price for a guaranteed-consistent backup.

**To restore a snapshot:**

1. Open the **Restore** tab in the same **Backup & Restore** section.
2. Pick a **Restore Method**:
   * **FluxDrive** — restore from a backup stored in your FluxDrive.
   * **Remote URL** — restore from a snapshot hosted at a URL you control.
   * **Upload File** — restore from a snapshot you previously downloaded to your computer.
3. Select the `nextcloudpersonal` (or `nextcloudlite`) component as the target.
4. Confirm. Restoring **overwrites** the current `/var/www/html` contents with the snapshot.

> ⚠️ **Restore overwrites everything.** Any files uploaded, calendars created, or settings changed since the snapshot was taken will be lost. If you are recovering from a partial loss, take a fresh snapshot of the current state **first** so you can fall back to it if the restore goes wrong.

The full reference for this UI is in [Backup & Restore](../applications/management/manage-app/backup-and-restore.md).

#### Option B — Volume Browser (granular, file-level)

The single source of truth lives at:

```
/var/www/html/
```

Files inside `/var/www/html` you may want to grab individually:

| Path | Contents | Why it matters |
| ---- | -------- | -------------- |
| `data/nextcloud.db` (and `.db-wal`, `.db-shm`) | The SQLite database — users, shares, share tokens, app metadata, file index. | The "structure" of your cloud. **Most important file.** |
| `data/<username>/files/` | Each user's actual file content. | Their documents and photos. |
| `data/appdata_*/` | Server-side caches and previews. | Safe to skip — Nextcloud rebuilds it. |
| `config/config.php` | All server settings (trusted domains, mail, sharing rules). | Needed to clone the server elsewhere. |
| `custom_apps/` | Apps installed from the App Store. | Apps will be re-downloaded if missing, but their settings live in the DB anyway. |
| `data/.htaccess`, `data/index.html` | Directory protection markers. | Do not delete. |

To take a file-level backup:

1. Put Nextcloud in maintenance mode (`occ maintenance:mode --on`).
2. Open the **Volume Browser** (Settings → Secure Shell → Volume Browser).
3. Navigate to `/var/www/html` and download `data/`, `config/`, and `custom_apps/`.
4. Turn maintenance mode off.

Storing a Nextcloud backup off-Flux is sensible — both for redundancy and so you can recover if your subscription ever lapses.

> 💡 **Test restoring at least once.** A backup that has never been restored is a hope, not a backup. Spin up a throwaway second Nextcloud app, restore your backup into it, and verify you can log in and see your files. Then delete the throwaway.

***

### Updating Nextcloud

You have two paths for updates: the in-app updater (changes the Nextcloud version inside the same image) or a Flux restart (which re-pulls the `nextcloud:33-apache` image and runs the entrypoint upgrade routine).

#### In-app updater (minor versions)

Nextcloud ships with a built-in Updater app that fetches new minor versions from the Nextcloud release server.

1. Log in as admin and open **Administration settings → Overview**. If a new version is available, you will see an **Open updater** button.
2. Click it, follow the wizard, and accept the maintenance mode toggles.
3. After the update, run `php occ upgrade` from **Secure Shell → Terminal** if the wizard prompts you to.

> ⚠️ **Always take a backup first.** The updater modifies `/var/www/html` in place. If anything goes wrong, the snapshot is your only way back.

#### Flux restart (image refresh)

To pick up new Docker image revisions (security patches in the underlying Apache, PHP, or system libraries):

1. Open **Applications → Management** and select your Nextcloud app.
2. Go to the **Control** tab, choose **Local**, and click **Restart Application**.
3. Flux re-pulls the `nextcloud:33-apache` image on restart and brings the container back up. The volume — and therefore your data and apps — is preserved.

> 💡 **Major-version upgrades.** When Nextcloud 34 ships, the image tag will change (`nextcloud:34-apache`). Major upgrades are best done through the in-app updater, **not** by switching the Flux image tag — the updater handles each schema migration step and refuses to skip versions, which is the behaviour you want for SQLite.

***

### Performance Tuning

The defaults are conservative and work for the bundled tier, but a few tweaks help once you have real users on it.

#### Background jobs (cron)

Nextcloud has a queue of background jobs (email, version cleanup, federated share sync, calendar reminders). By default it uses **AJAX cron**, which only runs when someone is logged in — fine for a single user, but unreliable for shared use.

Switch to system cron from **Administration settings → Basic settings → Background jobs** → **Cron (Recommended)**. The bundled `nextcloud:apache` image runs `cron.php` from `apache2-foreground`'s cron sidecar automatically when this is selected.

#### Memory caching

Nextcloud strongly recommends a memory cache for performance. The bundled image does **not** include APCu or Redis by default, so the admin overview page will show a warning. To silence it and speed up logins:

1. Edit `/var/www/html/config/config.php` via the Volume Browser.
2. Add inside the `$CONFIG` array:

    ```php
    'memcache.local' => '\OC\Memcache\APCu',
    ```

3. Save and restart from **Control → Local → Restart Application**. APCu ships with the official Nextcloud image but is disabled by default for compatibility — enabling it cuts page render times noticeably.

> 💡 **Redis is the next step up.** A real Redis container gives you distributed locking and is needed for high concurrency, but it is a separate Flux app and outside the scope of this template. APCu alone is enough for the user counts these tiers target.

#### File handling limits

PHP defaults limit upload size to 512 MB. To raise it (e.g. for large photo libraries or video):

1. Edit `/var/www/html/.htaccess` — Nextcloud manages PHP limits there.
2. Find the lines starting with `php_value upload_max_filesize` and `php_value post_max_size` and raise them (e.g. to `10G`).
3. Restart the app.

***

### Security Recommendations

A self-hosted cloud exposed on the public internet is a meaningful target. The Marketplace template gives you a sane baseline; the rest is on you:

1. **Use the HTTPS app domain everywhere.** Treat the raw IP+port as a debug-only endpoint.
2. **Enable two-factor authentication on the admin account first** — Personal settings → Security → Two-factor TOTP. Save the recovery codes somewhere offline.
3. **Use a strong, unique admin password** that is stored only in your password manager.
4. **Create a separate, non-admin daily-driver account** for yourself. Use the admin account only for administrative tasks.
5. **Set `trusted_domains` carefully** — only list the hostnames you actually use. Wildcards are not supported and would be unwise.
6. **Disable user registration** — Nextcloud does not allow public signups by default, but if you ever install a "guest registration" app, gate it behind invitations.
7. **Review the security & setup warnings** at **Administration settings → Overview** every few weeks. Nextcloud surfaces missing headers, outdated apps, and config drift there.
8. **Take regular backups** (see the previous section).
9. **Rotate app passwords** for any device you stop using — Personal settings → Security → Devices & sessions → revoke.

***

### Frequently Asked Questions

#### Why does Nextcloud Lite say "1 user" — can I add more?

There is no hard server-side limit. The "1 user" guidance reflects the resource envelope: 2 GB of RAM and 1 CPU core comfortably serves one person with a phone and a laptop. You can technically add more users from **Users → + New user**, but you should expect occasional slowness during concurrent sync, and you will fill 25 GB faster than you think. Upgrade to **Nextcloud Personal** if you need to share the cloud with anyone.

***

#### What happens if the primary instance goes down?

If your current primary becomes unavailable, one of the standby instances automatically takes over as the new primary after a short delay. The persistent volume is replicated in primary/standby mode (the `g:` prefix on the data path), so your installation, apps, configuration, and user files are preserved on the new primary. Clients connecting via the **app domain** keep working without any manual intervention. Clients pinned to the raw primary IP will need their server URL updated. You can check which instance is currently the primary from the application's management panel under the **Instances** tab.

***

#### Can I use a custom domain instead of the `*.app.runonflux.io` one?

Yes. Follow the [Custom Domain Setup](../register-new-app/custom-domain-setup.md) guide to point your own domain at the app, then **add the custom domain to `trusted_domains` in `/var/www/html/config/config.php`** as described in the [Setting the Trusted Domain](#setting-the-trusted-domain) section. The TLS certificate is provisioned automatically.

***

#### How do I migrate from another Nextcloud instance into this one?

The cleanest path is to copy `/var/www/html/data/`, `/var/www/html/config/config.php`, and `/var/www/html/custom_apps/` between the two hosts:

1. Put both apps in maintenance mode (`occ maintenance:mode --on`).
2. From the source, download the three folders/files above via the Volume Browser.
3. Upload them to the destination's `/var/www/html/`, overwriting.
4. Edit `config/config.php` on the destination so `trusted_domains` and `overwrite.cli.url` reflect the new URL.
5. Run `php occ upgrade` from the destination's terminal if the source was on a newer minor version.
6. Turn maintenance mode off on the destination.

If you only want to migrate one user's files, log into both servers and use the **Files → Download as zip** / **Upload** workflow inside the web UI — far simpler than touching the volume.

***

#### Why am I seeing "Internal Server Error" right after deployment?

The most common cause is that the entrypoint is still copying the web root onto the persistent volume. First boot can take 3–6 minutes (see [First Launch — What to Expect](#first-launch--what-to-expect)). Wait two minutes and refresh. If the error persists, check **Logs** for `Initializing nextcloud` lines — if they are still scrolling, give it more time. If they have stopped and you still see 500s, restart the app from **Control → Local → Restart Application**.

***

#### Can I install Collabora Online or OnlyOffice for collaborative editing?

Yes, but not as part of this template. You would deploy a separate Flux app running the Collabora `collabora/code` or OnlyOffice `onlyoffice/documentserver` image, and then install the **Nextcloud Office** (formerly Collabora Online) or **OnlyOffice** app inside Nextcloud and point it at the new container's URL. This is an advanced setup — see the [Nextcloud Office documentation](https://nextcloud.com/office/) for the configuration details.

***

#### Why does Administration → Overview complain about missing PHP modules or memory caching?

The bundled `nextcloud:33-apache` image is the official upstream build, but the security & setup checks page is intentionally strict and lists every recommended optimisation. Most warnings (memory cache, default phone region, server-side encryption) can be dismissed by editing `config/config.php`. Critical warnings (missing PHP modules, blocked HTTPS, write-protected config) are real bugs and should be investigated immediately. The most common one to fix is the memory cache warning — see [Memory caching](#memory-caching) above.

***

#### How do I run `occ` commands?

`occ` is Nextcloud's command-line admin tool. It must be run as the web server user (`www-data`).

1. Open **Applications → Management** on [cloud.runonflux.com](https://cloud.runonflux.com), select your Nextcloud app, click the **Settings icon**, open **Secure Shell → Terminal**.
2. SSH into the container.
3. Run any `occ` command via:

    ```bash
    sudo -u www-data php /var/www/html/occ <subcommand>
    ```

   For example:

    ```bash
    sudo -u www-data php /var/www/html/occ status
    sudo -u www-data php /var/www/html/occ user:list
    sudo -u www-data php /var/www/html/occ files:scan --all
    ```

***

#### What ports does Nextcloud use?

A single port: `80` inside the container, mapped to `33080` (Personal) or `33081` (Lite) on the public side. Apache serves both the web UI and the WebDAV/CalDAV/CardDAV endpoints on the same listener. When you connect through the app domain over HTTPS, Flux's gateway terminates TLS and forwards traffic to that port — which is why the `OVERWRITEPROTOCOL=https` and `TRUSTED_PROXIES=...` environment variables are baked into the template.
