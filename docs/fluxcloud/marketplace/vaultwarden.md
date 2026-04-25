# Vaultwarden

This guide walks you through the process of **deploying, configuring, and running a Vaultwarden password manager** on FluxCloud. Vaultwarden is a Rust-based, resource-light reimplementation of the Bitwarden server API — fully compatible with every official Bitwarden client (browser extensions, mobile apps, desktop apps, and the `bw` CLI). With one Marketplace deployment you get a private, self-hosted password vault, organisation support, file attachments, Bitwarden Send, time-based one-time passwords (TOTP), and an admin panel — all running on Flux's decentralised network with primary/standby high availability.

The FluxCloud Vaultwarden template is built on the upstream `vaultwarden/server:latest` Docker image maintained by [dani-garcia](https://github.com/dani-garcia/vaultwarden). The container exposes Vaultwarden's HTTP listener (port `80` inside the container, mapped to public port `38080`) and persists everything that matters — the SQLite database, file attachments, Bitwarden Send blobs, the RSA signing keys used for JWTs, and the admin panel's `config.json` — to a Flux-backed persistent volume mounted at `/data`.

For more information on **Vaultwarden** visit: [https://github.com/dani-garcia/vaultwarden](https://github.com/dani-garcia/vaultwarden). For the wiki and configuration reference, see: [https://github.com/dani-garcia/vaultwarden/wiki](https://github.com/dani-garcia/vaultwarden/wiki).

***

### What you can do with Vaultwarden on FluxCloud

Once deployed, your Vaultwarden instance gives you the same surface area as a self-hosted Bitwarden, including:

* **Personal password vault** — store logins, secure notes, credit cards, and identities with end-to-end encryption (your master password never leaves the client).
* **Organisations and collections** — share vaults with family members, teammates, or trusted parties; create collections for grouped credentials.
* **All Bitwarden clients work unchanged** — the official browser extensions (Chrome, Firefox, Safari, Edge, Brave), iOS/Android apps, Windows/macOS/Linux desktop apps, and the `bw` CLI all point at your Flux app's URL instead of `bitwarden.com`.
* **TOTP / authenticator codes** — store 2FA seeds alongside the credential they protect; the clients will autofill the rolling code.
* **File attachments** — attach documents to vault entries (recovery codes PDFs, key files, etc.). Stored under `/data/attachments/` on the persistent volume.
* **Bitwarden Send** — share a one-time, expiring password or file with someone outside your vault.
* **Web Vault** — the same browser-based UI as `vault.bitwarden.com`, served straight from your Flux app.
* **Admin Panel** — gated by the `ADMIN_TOKEN` you set at deployment, exposed at `/admin`. From there you can manage users, invite or block accounts, browse organisations, view diagnostics, and edit runtime settings (SMTP, signups, domain, push notifications, etc.) without redeploying.

Vaultwarden is a **drop-in replacement** for the official Bitwarden server — the database schema and HTTP API are compatible, so your data is not locked into any vendor or hosting provider.

***

### How To Install Vaultwarden

#### **Steps**

1. **Access FluxCloud**

* Visit [cloud.runonflux.com](https://cloud.runonflux.com) and sign in or create an account.


2. **Find Vaultwarden**

* Navigate to the **Marketplace → Productivity** tab, then locate the **Vaultwarden** tile and click **View Details**.

3. **Review the Server Configuration**

* The Vaultwarden template ships with a **single, fixed configuration**:
  * **1 CPU core**, **500 MB RAM**, **10 GB SSD** persistent storage, deployed on **2 instances** in a primary/standby layout for redundancy.
* These resources are sufficient for a personal vault or a small organisation (dozens of users, thousands of items, modest attachment volume). If you plan to onboard a larger team or store many large attachments, you can resize the app later from **Applications → Management**.
* Click **Install Now** to continue.

> 💡 **Why so light?** Vaultwarden is written in Rust and uses SQLite by default, so a fully functional password server fits comfortably in 500 MB of RAM. The official Bitwarden self-hosted stack, by contrast, is a multi-container .NET deployment that easily needs 2 GB+.

4. **Fill in the Optional Field**

   The template exposes one optional, advanced field:

   | Field | What it does | Recommended value |
   | ----- | ------------ | ----------------- |
   | **ADMIN\_TOKEN** | Token that protects the `/admin` panel. **Leave empty to disable the admin panel entirely.** If set, anyone visiting `/admin` with this token can manage users and settings. | A long, random, hashed token — see [Generating an ADMIN\_TOKEN](#generating-an-admin_token) below. |

   > ⚠️ **The admin panel is powerful.** It can disable signups, invite/disable users, view organisation membership, and edit runtime config. **Never set `ADMIN_TOKEN` to a weak or reused value.** If you do not need the panel right now, leave the field blank — you can re-deploy or update the app later to enable it.

5. **Choose Subscription**

* Select your desired **subscription duration**.
* Agree to the **Terms of Use** and **Privacy Policy**, and click the blue **Continue** arrow at the bottom.

6. **Deployment Location**

* Configure whether you want your Vaultwarden instance to deploy in specific geographic regions:
  * **Global (Recommended):** No geographic restrictions for best availability and the lowest probability of every instance being affected by the same regional incident.
  * **Custom:** Restrict by continent or country — useful if your team is concentrated in one region and you want to minimise round-trip latency on vault syncs.
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

Vaultwarden boots quickly because the binary and the bundled web vault assets are baked into the Docker image — there is no asset download or migration step on a fresh volume:

1. **Image pull** (~150–250 MB) — Flux pulls `vaultwarden/server:latest` onto the primary node. First deployment only.
2. **Database initialisation** — on first start, Vaultwarden creates `db.sqlite3` inside `/data` and generates the RSA keypair (`rsa_key.pem`, `rsa_key.pub.pem`, `rsa_key.der`) used to sign JWT session tokens.
3. **HTTP listener opens** — Vaultwarden binds on port 80 inside the container (mapped to public port 38080).

* Expect the **first boot to take 30–90 seconds** end-to-end. Subsequent restarts are similar — there is no long migration or asset rebuild.
* You can follow progress from **Applications → Management → Logs**. Key log lines to watch for:
  * `Rocket has launched from http://0.0.0.0:80` — the server is accepting connections.
  * `[INFO] [vaultwarden::api::core::organizations]` lines start appearing once the first user signs up.

***

### Accessing the Web Vault

Flux deploys the app on **2 instances**, with one acting as the **primary** at any given time. There are two ways to reach the web vault from a browser, and you should almost always prefer the second one:

#### Option A — Via primary IP (HTTP, not recommended for daily use)

1. Visit [**cloud.runonflux.com**](https://cloud.runonflux.com), open **Applications → Management**, click the **Settings icon** on your Vaultwarden app, and open the **Instances** tab. The **Primary IP** is shown there.
2. Open `http://<primary-ip>:38080` in a browser.

> ⚠️ **Browser extensions and mobile clients refuse to save credentials over plain HTTP.** Use the app domain (HTTPS) for anything other than a quick smoke test.

#### Option B — Via the application domain (HTTPS, recommended)

Every FluxCloud Marketplace app is reachable through a stable HTTPS domain that Flux's gateway terminates TLS for and routes to the current primary automatically.

1. Open **Applications → Management → Information** and copy your application domain (it looks like `vaultwarden_<id>.app.runonflux.io`).
2. Visit `https://<your-app-domain>.app.runonflux.io` in a browser. You should see the Bitwarden web vault login screen branded as Vaultwarden.

Using the domain means:

* You get a valid TLS certificate automatically — no self-signed warnings.
* Browser extensions and mobile clients will accept the URL as a self-hosted server.
* You never have to update bookmarks or client config when the primary instance changes after a failover.

> 💡 **Use the domain in every Bitwarden client.** Configuring a Bitwarden client to point at the raw IP works for an HTTP test, but the clients will refuse to autofill, save, or sync passwords if they cannot establish HTTPS. Always configure the **Server URL** as `https://<your-app-domain>.app.runonflux.io`.

***

### Creating Your First Account

The first time you visit the web vault, signups are **enabled** by default. This is intentional — you need to be able to create the very first account before you can lock the door behind you.

1. From the login screen, click **Create account**.
2. Enter your **email address**, a **strong master password** (Bitwarden recommends 14+ characters with mixed character classes), and a **hint** (optional, shown to you if you forget the master password).
3. Tick the agreement boxes and click **Create account**.
4. Log in with your new credentials.

> ⚠️ **The master password is unrecoverable.** Vaultwarden — like Bitwarden — never sees your master password in plaintext; the entire vault is encrypted client-side with a key derived from it. If you forget it, your vault is permanently lost. Store the master password in a physically secure location (paper in a safe, hardware token, etc.) before you put real data in.

> 💡 **Set up two-factor authentication immediately.** From the web vault, open **Account settings → Security → Two-step login** and enable a TOTP authenticator (Aegis, 2FAS, or even Bitwarden Authenticator). This gates access to your vault even if your master password leaks.

#### Disabling signups after your first account

After every legitimate user has signed up, you should **lock down registration** so a leak of your domain does not let strangers create accounts on your server. There are two ways to do this:

* **Through the admin panel** (requires `ADMIN_TOKEN`) — open `https://<your-app-domain>.app.runonflux.io/admin`, paste your token, go to **General settings**, untick **Allow new signups**, and click **Save**. This writes to `/data/config.json` immediately, no restart required.
* **Through the Volume Browser** — see the [Per-setting reference](#advanced-configuration-via-configjson) section below.

> 💡 **If you want to keep signups closed but still onboard new users**, enable **Invitations** in the admin panel and use **Send invitation** to email a registration link to specific addresses.

***

### Connecting Bitwarden Clients

Every official Bitwarden client supports a self-hosted server URL. The procedure is the same on every platform: **set the server URL before logging in**, then sign in with the email and master password you chose at registration.

#### Browser extension (Chrome, Firefox, Edge, Safari, Brave)

1. Install the [Bitwarden browser extension](https://bitwarden.com/download/) from your browser's store.
2. Click the Bitwarden icon → **Region: Self-hosted** → **Settings** (the gear icon at top-left of the login screen).
3. In the **Server URL** field, enter your Flux app domain:

    ```
    https://<your-app-domain>.app.runonflux.io
    ```

4. Click **Save**, then log in with your master password.

#### Desktop app (Windows / macOS / Linux)

1. Download the desktop app from [bitwarden.com/download](https://bitwarden.com/download).
2. On the login screen, change the **Region** dropdown from **US/EU** to **Self-hosted**, then click **Settings**.
3. Set the **Server URL** to your Flux app domain (same as above) and click **Save**.
4. Log in.

#### Mobile app (iOS / Android)

1. Install **Bitwarden** from the App Store or Google Play.
2. On the first launch, before logging in, tap the **Region** dropdown → **Self-hosted**.
3. Tap the gear icon, set the **Server URL** to your Flux app domain, and tap **Save**.
4. Log in.

#### Bitwarden CLI (`bw`)

```sh
bw config server https://<your-app-domain>.app.runonflux.io
bw login your-email@example.com
```

The CLI persists the server URL per-session in `~/.config/Bitwarden\ CLI/data.json`.

> 💡 **Live sync uses WebSockets.** When you change a credential on one device, others should update within a couple of seconds. Vaultwarden serves WebSocket traffic on the same port as HTTP — no extra port to forward — but it must reach the clients over `wss://`, which is why HTTPS via the Flux app domain is required.

***

### The Admin Panel

The admin panel is a separate, single-page web UI for operators (you), gated by the `ADMIN_TOKEN` you set at deployment. It is **not** linked from the user-facing web vault — you have to know the URL.

* **URL:** `https://<your-app-domain>.app.runonflux.io/admin`
* **Authentication:** paste the value of `ADMIN_TOKEN` and click **Enter**.

What you can do from the admin panel:

| Tab | What it does |
| --- | ------------ |
| **Users** | List, disable, delete, or invite users. Force-verify an email address. |
| **Organisations** | Inspect organisations and their members. |
| **General settings** | Toggle signups, invitations, password hints, sends, and more — at runtime, no redeploy. |
| **Mail / SMTP** | Configure outgoing email for invitations, password hints, 2FA recovery. |
| **Domain settings** | Set the canonical `DOMAIN` URL Vaultwarden announces in tokens, emails, and push registration. |
| **Diagnostics** | Check Vaultwarden version, DNS resolution, time skew, and other health markers. |

Edits made in the admin panel are written to `/data/config.json` and applied immediately — Vaultwarden re-reads the file without a restart.

#### Generating an `ADMIN_TOKEN`

Modern Vaultwarden (1.30+) accepts two formats for `ADMIN_TOKEN`:

* **Plain text** — works, but logs a warning every startup. Acceptable for a private deployment if you treat the value like any other long-lived secret.
* **Argon2 hash** (recommended) — generated locally, never round-trips through the server.

To generate a plain token, run on any Linux/macOS machine:

```sh
openssl rand -base64 48
```

To generate the recommended Argon2-hashed form, run:

```sh
docker run --rm -it vaultwarden/server /vaultwarden hash
```

It will prompt you for a password twice, then print a string starting with `$argon2id$...`. Paste **that whole string, including the leading `$argon2id$`,** into the `ADMIN_TOKEN` field. To log in to the admin panel afterwards, use the **plaintext** password you typed into the prompt — not the hash.

If you ever need to rotate the token:

1. Generate a new value (plain or hashed).
2. Open **Applications → Management → Update**, paste the new value into `ADMIN_TOKEN`, click **Review**, and **sign the update**. Updates to existing apps are **free of charge** on the Flux network.
3. The container restarts and the new token is active within a minute or two.

***

### Setting `DOMAIN` Correctly

Vaultwarden uses the `DOMAIN` config value to:

* Build URLs in invitation and recovery emails.
* Validate the origin of incoming requests for CORS-sensitive routes.
* Generate WebAuthn (passkey) registrations bound to a specific origin.

The **first time you visit the admin panel**, set this:

1. Open `https://<your-app-domain>.app.runonflux.io/admin`.
2. Go to the **General settings** tab.
3. In the **Domain URL** field, paste your full HTTPS app domain, **without a trailing slash**:

    ```
    https://<your-app-domain>.app.runonflux.io
    ```

4. Click **Save**.

If `DOMAIN` does not match what users actually use to reach the server, invitation links may resolve to a wrong host, and WebAuthn / passkey registrations will fail. You only need to do this once.

***

### Configuring Outbound Email (SMTP)

Vaultwarden uses SMTP to send invitations to new organisation members, password hints, and 2FA recovery codes. SMTP is **optional** — if you do not configure it, invitations and hint emails are silently disabled, but the rest of the vault works fine.

Configure from the admin panel → **SMTP Email Settings**:

| Setting | Example | Notes |
| ------- | ------- | ----- |
| **SMTP Host** | `smtp.gmail.com`, `smtp.fastmail.com`, `smtp.sendgrid.net` | Use any provider that accepts SMTP submission. |
| **SMTP Port** | `587` (STARTTLS) or `465` (SMTPS) | 587 with STARTTLS is the modern default. |
| **SMTP Security** | `Force TLS` for 465, `Use STARTTLS` for 587 | Never use `None` over the public internet. |
| **SMTP Username** | Your provider's submission username (often your full email address) | |
| **SMTP Password** | An **app password**, not your account password | Required for Gmail/iCloud; recommended elsewhere. |
| **SMTP From** | `vault@yourdomain.example` | Must match the authenticated identity on most providers. |
| **SMTP From Name** | `Vaultwarden` | Shown to recipients. |

Click **Save** when done, then click **Send test email** in the same panel to verify the credentials before you start inviting users.

> 💡 **Gmail and iCloud both require app-specific passwords.** Generate one at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) (Google) or in **Settings → Sign-In and Security** (Apple). Your normal account password will not work.

***

### Advanced Configuration via `config.json`

Anything you set in the admin panel is persisted to `/data/config.json` on the volume. You can also edit this file directly through the Volume Browser if you want to change a setting without exposing the admin panel — useful if you deployed with `ADMIN_TOKEN` empty.

1. Go to **Applications → Management** on [cloud.runonflux.com](https://cloud.runonflux.com) and select your Vaultwarden app.
2. Click the **Settings icon**, open the **Secure Shell** tab and scroll to **Volume Browser**.
3. Open `/data/config.json` (create it if it does not exist).

A minimal `config.json` to disable signups looks like this:

```json
{
  "domain": "https://<your-app-domain>.app.runonflux.io",
  "signups_allowed": false,
  "invitations_allowed": true,
  "show_password_hint": false,
  "web_vault_enabled": true
}
```

After saving, open the **Control** tab, select **Local**, and click **Restart Application** so Vaultwarden picks up the new file.

#### Commonly tuned settings

| Key | Default | What it does |
| --- | ------- | ------------ |
| `domain` | (none) | Public URL of your server. **Set this.** |
| `signups_allowed` | `true` | Allow public signups. **Set to `false` after registering yourself.** |
| `invitations_allowed` | `true` | Allow admins to invite specific users by email. |
| `signups_verify` | `false` | Require email verification before activation. Needs SMTP. |
| `signups_domains_whitelist` | `""` | Comma-separated list of email domains that are allowed to sign up. |
| `web_vault_enabled` | `true` | Serve the bundled web vault. Disable if you only use clients. |
| `password_iterations` | `600000` | KDF iterations for new accounts. Existing accounts are unaffected. |
| `show_password_hint` | `true` | Show the master-password hint after a failed login. Disable to remove an info-leak vector. |

A full reference is in the [upstream wiki](https://github.com/dani-garcia/vaultwarden/wiki/Configuration-overview).

***

### Backups

A password manager is **only as good as its backups**. Losing your Vaultwarden volume means losing every credential, every Send, every attachment, and the JWT signing keys (which would invalidate every active session and force every user to re-login from scratch).

FluxOS gives you two complementary ways to protect that data: the **built-in Backup & Restore** tool (snapshot of the entire `/data` container, recommended) and direct **Volume Browser** downloads (granular, file-by-file). Use the built-in tool for routine snapshots, and the Volume Browser when you only need to grab a single file or migrate a specific piece of data.

#### Option A — FluxOS Backup & Restore (recommended)

FluxCloud has a **first-class backup mechanism** that snapshots an application component's persistent data without taking the app offline. Snapshots can be downloaded locally, kept on FluxDrive, restored from a remote URL, or uploaded back later — all from the management UI.

**To create a snapshot:**

1. Open **Applications → Management** on [cloud.runonflux.com](https://cloud.runonflux.com), click the **Settings icon** on your Vaultwarden app, and open the **Backup & Restore** tab.
2. (Optional) Use the **FluxNode IP selector** at the top right to choose which instance to snapshot — by default it targets the current primary, which is usually what you want.
3. Tick the **`vaultwarden`** component and click **Create Backup**. The snapshot appears in the table below with its **Created Date**, **Expiry Date**, **Size**, and download/remove actions.
4. Click **Download** on the new row to save the snapshot to your computer. **Do this before the expiry date** shown in the table — expired snapshots are removed automatically.

Backup creation is **non-disruptive** — Vaultwarden keeps serving requests while the snapshot is taken — but for a guaranteed-consistent SQLite copy, you can briefly stop the app from **Control → Local → Stop Application** before clicking **Create Backup** and start it again afterwards.

**To restore a snapshot:**

1. Open the **Restore** tab in the same **Backup & Restore** section.
2. Pick a **Restore Method**:
   * **FluxDrive** — restore from a backup stored in your FluxDrive.
   * **Remote URL** — restore from a snapshot hosted at a URL you control.
   * **Upload File** — restore from a snapshot you previously downloaded to your computer.
3. Select the **`vaultwarden`** component as the target.
4. Confirm. Restoring **overwrites** the current `/data` contents with the snapshot.

> ⚠️ **Restore overwrites everything.** Any vault changes made since the snapshot was taken will be lost. If you are recovering from a partial loss, take a fresh snapshot of the current state **first** so you can fall back to it if the restore goes wrong.

The full reference for this UI is in [Backup & Restore](../applications/management/manage-app/backup-and-restore.md).

> 💡 **Pre-flight checklist for risky operations.** Always create a fresh snapshot via **Backup & Restore** before: rotating `ADMIN_TOKEN`, editing `/data/config.json` by hand, restarting after a long gap to pull a new image, cancelling a subscription, or migrating to a different FluxNode.

#### Option B — Volume Browser (granular, file-level)

The single source of truth lives at:

```
/data/
```

Files inside `/data` you may want to grab individually:

| File / pattern | Contents | Why it matters |
| -------------- | -------- | -------------- |
| `db.sqlite3` (and `db.sqlite3-wal`, `db.sqlite3-shm`) | The primary database — users, ciphers, organisations, collections, attachments metadata. | The vault itself. **Most important file.** |
| `attachments/` | Encrypted file attachments referenced by the database. | Without these, attachment entries become broken pointers. |
| `sends/` | Bitwarden Send blobs. | Loses pending Sends if missing. |
| `rsa_key.pem`, `rsa_key.pub.pem`, `rsa_key.der` | RSA keys used to sign JWT session tokens. | Replacing these forces every user to re-login. **Always back up.** |
| `config.json` | Admin-panel runtime settings (signups, SMTP, domain, etc.). | Lets you restore behaviour without re-clicking through the admin UI. |
| `icon_cache/` | Cached favicons for vault entries. | Safe to skip — Vaultwarden will rebuild it. |

To take a file-level backup:

1. Open the **Volume Browser** (Settings → Secure Shell → Volume Browser).
2. Navigate to `/data` and download the files listed above. SQLite databases are safe to copy while Vaultwarden is running thanks to write-ahead logging — but for a guaranteed-consistent snapshot, stop the app first or copy the WAL files alongside the database.
3. Store the files somewhere encrypted and off-network (e.g. your existing personal-backup target). The vault is encrypted with each user's master password, so a stolen backup is not catastrophic — but treat it as sensitive anyway.

To restore at file level:

1. Stop the Vaultwarden app from **Control → Local → Stop Application** (or simply replace files while running — Vaultwarden will pick up the database on the next request).
2. Upload your backup files into `/data/` via the Volume Browser, overwriting the existing files.
3. Start the app again. Existing client sessions should work seamlessly because the RSA keys are unchanged.

> ⚠️ **Test restoring at least once.** A backup that has never been restored is a hope, not a backup. Either run a snapshot through the Restore tab on a throwaway second deployment, or drop the Volume-Browser files into `/data` on a test app and verify a client can log in.

***

### Updating Vaultwarden

The `vaultwarden/server:latest` tag is rebuilt by the upstream maintainers on every release. To pull the newest version:

1. Open **Applications → Management** and select your Vaultwarden app.
2. Go to the **Control** tab, choose **Local**, and click **Restart Application**.
3. Flux re-pulls the `latest` image on restart and brings the container back up. The volume — and therefore your data — is preserved.

> 💡 **Check the [release notes](https://github.com/dani-garcia/vaultwarden/releases) before restarting** if you have not updated in a long time. Vaultwarden's database schema is forward-compatible, but major releases occasionally change defaults (for example KDF iteration counts) and the changelog is the authoritative source.

***

### Security Recommendations

A self-hosted password manager exposed on the public internet is, by definition, a high-value target. The Marketplace template gives you a secure baseline, but a few one-time hardening steps are essential:

1. **Use the HTTPS app domain everywhere.** Treat the raw IP+port as a debug-only endpoint.
2. **Disable signups** as soon as every legitimate user has registered. Set `signups_allowed: false` in `config.json` or untick the box in the admin panel.
3. **Set a strong, hashed `ADMIN_TOKEN`** if you enable the admin panel — or leave it empty to disable the panel altogether.
4. **Enable 2FA on your own account** in **Account settings → Security → Two-step login** in the web vault.
5. **Set `DOMAIN`** in the admin panel so invitation links and WebAuthn registrations are bound to the right origin.
6. **Take regular backups** of `/data` (see the previous section).
7. **Disable password hints** (`show_password_hint: false`) if you are running for friends/family — hints are an information leak that does not benefit a careful user.
8. **Rotate the `ADMIN_TOKEN`** if you suspect it has been exposed. The procedure is the same as setting it for the first time — open **Update**, change the field, sign.

***

### Frequently Asked Questions

#### Is Vaultwarden compatible with my existing Bitwarden vault?

Yes. Vaultwarden implements the same HTTP API as the official Bitwarden server, so the official clients work without modification — you only change the **Server URL**. To migrate from another Bitwarden instance, export your vault from the old server (**Tools → Export vault** in any Bitwarden client) and import the file into Vaultwarden after logging in to your new account (**Tools → Import data**).

***

#### Why is the admin panel asking me for a token I do not have?

The `ADMIN_TOKEN` was either set during deployment (if you typed something into the optional field) or is empty. If it is empty, the admin panel is completely disabled — `/admin` returns a notice instead of a login form. To enable it, open **Applications → Management → Update**, set `ADMIN_TOKEN` to a strong value, and sign the update.

***

#### Can browser extensions save passwords on this server?

Yes, **as long as you connect via the HTTPS app domain**. Browser extensions and mobile clients refuse to autofill or save credentials if the connection is plain HTTP. Use `https://<your-app-domain>.app.runonflux.io` in every client.

***

#### Where is my data stored, and is it encrypted?

Your vault entries are encrypted **client-side**, with a key derived from your master password using PBKDF2 (default 600 000 iterations) or Argon2id depending on your account settings. The encrypted blobs are stored in `/data/db.sqlite3` on Flux's persistent volume. Vaultwarden — and Flux — never see your master password or the decrypted contents of your vault. File attachments are similarly encrypted client-side before being uploaded.

***

#### What ports does Vaultwarden use?

Vaultwarden listens on a single port — `80` inside the container, mapped to public port `38080`. This port handles HTTP, the bundled web vault, and the WebSocket connection used for live sync. There is no separate WebSocket port; the same listener upgrades HTTP connections to WebSockets when clients ask for it. When you connect through the app domain over HTTPS, Flux's gateway terminates TLS and forwards traffic to that single port.

***

#### How do I invite someone to my organisation without enabling open signups?

1. In the admin panel, make sure **Allow invitations** is enabled but **Allow new signups** is disabled.
2. Configure SMTP (see the [SMTP section](#configuring-outbound-email-smtp)) so Vaultwarden can send the invitation email.
3. From the **web vault**, open the organisation, go to **Members → Invite member**, enter the email address, and click **Save**.
4. Vaultwarden emails the invitee a registration link valid for 5 days.

***

#### What happens if the primary instance goes down?

If your current primary becomes unavailable, one of the standby instances automatically takes over as the new primary after a short delay. Your database, attachments, and signing keys are preserved on the persistent volume, so clients connecting via the **app domain** keep working without any manual intervention. Clients pinned to the raw primary IP will need their server URL updated. You can check which instance is currently the primary from the application's management panel under the **Instances** tab.

***

#### Can I use a custom domain instead of the `*.app.runonflux.io` one?

Yes, in the same way as any other FluxCloud app. Follow the [Custom Domain Setup](../register-new-app/custom-domain-setup.md) guide to point your own domain at the app, then update the **Domain URL** in the admin panel and re-configure your Bitwarden clients with the new URL. The TLS certificate is provisioned automatically.

***

#### How can I move my vault to or from another Vaultwarden host?

The cleanest path is to copy the contents of `/data/` between the two hosts:

1. Stop both apps.
2. From the source, download `db.sqlite3*`, `attachments/`, `sends/`, `rsa_key.*`, and `config.json` via the Volume Browser.
3. Upload the same files to the destination's `/data/`.
4. Start the destination, update its `DOMAIN` setting in `config.json` to match its actual URL.
5. Re-point your clients at the new URL — sessions remain valid because the RSA keys came along.

If you only want to migrate a single user's vault, use the per-user **Export vault** / **Import data** tools in any Bitwarden client instead.

***

#### Why does the Bitwarden mobile app sometimes log me out?

Bitwarden mobile clients refresh JWTs frequently. If clock skew between your phone and the Vaultwarden server exceeds a few minutes, JWT validation fails and the client logs out. Verify the **Diagnostics** tab in the admin panel — it shows the server's perceived time and warns if it drifts. Flux nodes are NTP-synced, so this should not happen, but it is the first thing to check if mobile sign-ins randomly fail while desktop is fine.
