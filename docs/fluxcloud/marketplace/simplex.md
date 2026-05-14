# SimpleX

This guide walks you through the process of **deploying, configuring, and running your own SimpleX servers** on FluxCloud. [SimpleX Chat](https://simplex.chat) is a federated, end-to-end-encrypted messaging network that — unlike Signal, WhatsApp, Matrix, or XMPP — uses **no user identifiers at all**: no phone numbers, no email addresses, no usernames, no random IDs assigned at sign-up. Messages and files are relayed through pluggable **SMP servers** (for messaging) and **xFTP servers** (for files). The protocol is built so that operators of one server can't see who is talking to whom, and operators of the other server can't see the message contents. Running your own relays means **you (and the friends/family/team you share them with) stop depending on the public preset servers** and become a fully independent node on the SimpleX network.

The FluxCloud Marketplace ships **three SimpleX templates**, all maintained at `runonflux/simplex-smp-server:latest`, `runonflux/simplex-xftp-server:latest`, and the Tor sidecar `wirewrex/hiddenonion:latest`. Together they let you host a public SMP relay, a password-protected (private) SMP relay, or an xFTP file relay — each with a stable IP address **and** a stable Tor `.onion` address (for the SMP variants), all behind FluxCloud's primary/standby high-availability layout.

For more information on **SimpleX** visit: [https://simplex.chat](https://simplex.chat). The protocol and server reference is at [https://github.com/simplex-chat/simplexmq](https://github.com/simplex-chat/simplexmq), and the hosting guide is at [https://simplex.chat/docs/server.html](https://simplex.chat/docs/server.html).

***

### Choosing Between the Three SimpleX Templates

The Marketplace has **three separate SimpleX tiles**. They are not alternatives in the "small vs. large" sense — they serve different roles, and many operators run **two or three of them side by side**.

| Tile | Role | Container layout | Public port | User input | Price |
| ---- | ---- | ---------------- | ----------- | ---------- | ----- |
| **SimpleX SMP Server** | Public messaging relay — anyone can register their SimpleX address on it. | `smpsimplex` + `onion` Tor sidecar | `5223` | None | $3.06 |
| **Private SimpleX SMP Server** | Password-protected messaging relay — only clients that present your `PASS` can register. | `smpsimplex` + `onion` Tor sidecar | `5223` | `PASS` (server password) | $3.06 |
| **SimpleX xFTP Server** | File-transfer relay with a 40 GB quota — handles encrypted file blobs for the SimpleX clients that already use your SMP relay. | `xftpsimplex` (no onion sidecar in the bundled template) | `34443` | None | $3.06 |

All three tiles deploy on **2 instances** in primary/standby, use the **same Flux-backed global storage** (volume prefix `g:` — keys persist across instance migrations and failovers), and are marked as **encrypted enterprise apps** (`isAutoEnterprise: true`), which means any user-supplied secret (like `PASS` on the Private SMP) is PGP-encrypted in the app spec and never visible on-chain.

> 💡 **What's the difference between SMP and xFTP?** SMP (Simple Messaging Protocol) is the **message relay** — short, encrypted blobs that route a 1:1 or group conversation between SimpleX clients. xFTP (X File Transfer Protocol) is a **separate file relay** for the encrypted file blobs the same clients exchange. The two protocols deliberately use different servers so that a single operator never sees both halves of a conversation. If you want a fully self-hosted stack, deploy **one SMP** (public or private) **and one xFTP**.

> 💡 **Public vs. Private SMP — which one do I want?** Pick **Public SMP** if you want to contribute capacity to the SimpleX network and let anyone use your relay. Pick **Private SMP** if you only want yourself (or a closed group) to use it — the `PASS` value gates registration. Either way, your conversation contents are still end-to-end encrypted; the password just controls who is allowed to register new addresses on the relay.

> ⚠️ **`PASS` is not message encryption.** The `PASS` value on the Private SMP gates **registration** on your relay (who can create addresses there). It does not encrypt message content — SimpleX clients already do that end-to-end, with keys the server never sees. Treat `PASS` as a join-code, not a secret that protects your messages.

***

### How Self-Hosting SimpleX Servers Works on Flux

When you deploy any of the three tiles, the container starts the corresponding SimpleX server binary against the persistent volume mounted under `/etc/opt/simplex` (SMP) or `/etc/opt/simplex-xftp` (xFTP). On **first boot**, the server generates:

* A long-term **CA / identity key pair**.
* A short-lived **server certificate** signed by that CA.
* The **server fingerprint** — a Base64URL hash of the CA certificate, embedded in the address that clients use to reach your server.

These files live on the Flux global storage volume, so the **fingerprint stays the same across restarts, primary failovers, and even cross-node migrations**. That stability is critical: every contact you (or your users) make through your relay encodes the fingerprint in their SimpleX address — if you lose it, those contacts can never reach the relay again.

The two SMP tiles additionally launch the `onion` sidecar — a Tor hidden-service container that wraps the SMP listener and publishes it at a permanent `.onion` address. Its private key lives at `/var/lib/tor` on global storage, so the `.onion` address is also stable across migrations.

***

### How To Install a SimpleX Server

The deployment flow is **identical for all three tiles** — the only difference is the optional `PASS` field on the Private SMP. The steps below cover the common path; deviations are called out where they appear.

#### **Steps**

1. **Access FluxCloud**

* Visit [cloud.runonflux.com](https://cloud.runonflux.com) and sign in or create an account.

2. **Find the SimpleX tile**

* Navigate to the **Marketplace → Hosting** tab, then locate one of the three tiles — **SimpleX SMP Server**, **Private SimpleX SMP Server**, or **SimpleX xFTP Server** — and click **View Details**.

3. **Review the Server Configuration**

* Each tile ships with a **fixed configuration** appropriate for its role:

  | Tile | CPU | RAM | Storage | Instances |
  | ---- | --- | --- | ------- | --------- |
  | SimpleX SMP Server | 1.0 core (0.9 SMP + 0.1 onion) | 2.5 GB (2 GB SMP + 0.5 GB onion) | 21 GB (20 GB SMP + 1 GB onion) | 2 |
  | Private SimpleX SMP Server | 1.0 core (0.9 SMP + 0.1 onion) | 2.5 GB (2 GB SMP + 0.5 GB onion) | 21 GB (20 GB SMP + 1 GB onion) | 2 |
  | SimpleX xFTP Server | 0.9 core | 2 GB | 40 GB (with a 40 GB upload quota) | 2 |

* You can resize the app later from **Applications → Management** without losing data. Click **Install Now** to continue.

4. **Fill in the input fields**

* **SimpleX SMP Server** and **SimpleX xFTP Server** have **no user-supplied fields** — both are preconfigured (the xFTP server bakes `QUOTA=40gb` into the container environment).

* **Private SimpleX SMP Server** exposes **one required field**:

   | Field | What it does | Recommended value |
   | ----- | ------------ | ----------------- |
   | **PASS** | Server password. Clients must present this value when registering an address on your relay. The value is PGP-encrypted in the spec (because the template is `isAutoEnterprise`), so it never appears in plaintext on-chain. | A long, random string — `openssl rand -base64 32` is a good starting point. |

   > ⚠️ **Treat `PASS` like an SSH key, not a username.** Once a client has registered through your relay, the address embeds the password (in encrypted form) and the relay accepts subsequent traffic on that address. Rotating `PASS` does **not** invalidate already-registered addresses, but it does prevent **new** registrations from clients that don't have the new value.

5. **Choose Subscription**

* Select your desired **subscription duration**.
* Agree to the **Terms of Use** and **Privacy Policy**, and click the blue **Continue** arrow at the bottom.

6. **Deployment Location**

* Configure whether you want your SimpleX server to deploy in specific geographic regions:
  * **Global (Recommended):** No geographic restrictions for best availability and the lowest probability of every instance being affected by the same regional incident.
  * **Custom:** Restrict by continent or country — useful if your users are concentrated in one region and you want to minimise latency, or if you have data-residency constraints.
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
* Payment is monitored automatically. Once confirmed, your application will be deployed, and a blue **Manage** button will appear — directing you to your application's management panel.

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

SimpleX servers boot quickly because the binaries are baked into the Docker image. On a fresh volume there are **no migrations or asset downloads** — the only first-boot work is generating the CA and server keys.

1. **Image pull** — Flux pulls `runonflux/simplex-smp-server:latest` (or `runonflux/simplex-xftp-server:latest`) onto the primary node. The SMP tiles additionally pull `wirewrex/hiddenonion:latest` for the Tor sidecar. First deployment only.
2. **Key generation** — on first start, the SMP / xFTP server creates its CA certificate, server certificate, and identity key under `/etc/opt/simplex` or `/etc/opt/simplex-xftp`. The Tor sidecar generates the `.onion` private key under `/var/lib/tor`.
3. **Listeners open** — the SMP server binds on TCP `5223`, the xFTP server on TCP `34443`. Both then print their **server address** (containing the fingerprint) to the logs.

* Expect the **first boot to take 30–90 seconds** end-to-end.
* You can follow progress from **Applications → Management → Logs**. The key line to copy is the one that starts with `Server address:` — that's the connect string you'll hand to a SimpleX client.

***

### Finding Your Server Address

Every SimpleX server, on every boot, prints the address that clients use to reach it. The address format embeds the **fingerprint of the server's CA certificate** so clients can pin the connection — there is no DNS-based or PKI-based trust here, the address **is** the trust.

#### SMP server address

The line in the logs looks like:

```
Server address: smp://<fingerprint-base64url>@<hostname-or-ip>
```

For the **Private SMP**, the address embeds the password:

```
Server address: smp://<fingerprint-base64url>:<password>@<hostname-or-ip>
```

#### xFTP server address

The line in the logs looks like:

```
Server address: xftp://<fingerprint-base64url>@<hostname-or-ip>:34443
```

The `:34443` is appended because the xFTP container listens on a non-default port — clients need it explicitly.

***

### Building Your Final Connect String

The address the server prints in the logs uses the hostname it sees from inside the container, which is **not** what your clients should connect to. Replace it with one or more of the public endpoints that Flux gives you:

| Endpoint | What it looks like | When to use |
| -------- | ------------------ | ----------- |
| **Application domain (recommended)** | `<app-name>_<id>.app.runonflux.io` | Stable across primary failovers — the domain always resolves to whichever instance is currently primary. **Use this for daily operation.** |
| **Primary IP** | A bare IPv4, e.g. `203.0.113.42` | Debug only. Pinning to a raw IP means your address breaks the next time the primary changes. |
| **Onion address (SMP tiles only)** | `<random>.onion` | Tor-only access. Read it from `/var/lib/tor/hidden_service/hostname` via the Volume Browser. Add it to the address alongside the clearnet host, comma-separated, so clients can reach you even when their Tor route is the only available path. |

**To find the application domain:** open **Applications → Management → Information** on [cloud.runonflux.com](https://cloud.runonflux.com) and copy the domain field. It looks like `simplexsmp_12345.app.runonflux.io`.

**To find the onion hostname (SMP only):**

1. Open **Applications → Management** and select your SimpleX SMP app.
2. Click the **Settings icon**, open the **Secure Shell** tab and scroll to **Volume Browser**.
3. Navigate into the `onion` component, open `/var/lib/tor/hidden_service/` (or the analogous folder the sidecar creates) and copy the contents of `hostname`.

#### A complete public SMP address

```
smp://<fingerprint>@simplexsmp_12345.app.runonflux.io,<random>.onion
```

#### A complete private SMP address

```
smp://<fingerprint>:<your-PASS>@simplexsmp_12345.app.runonflux.io,<random>.onion
```

#### A complete xFTP address

```
xftp://<fingerprint>@simplexxftp_12345.app.runonflux.io:34443
```

> 💡 **Why list the onion address alongside the clearnet host?** SimpleX clients try the addresses in order. If a user's network blocks the clearnet endpoint, the client falls back to Tor automatically. Including both addresses in a single connect string is the easiest way to make your relay reachable from restrictive networks without forcing every user into Tor mode.

***

### Adding Your Server to a SimpleX Client

The procedure is the same on every SimpleX client (iOS, Android, desktop). You add the address once, then either **use it for your own messaging** or **share it with friends/family/team** so their clients also route through your relay.

1. Open SimpleX Chat.
2. Tap your **profile icon → Network & servers**.
3. Choose **SMP servers** or **XFTP servers** depending on which relay you're adding.
4. Tap **+ Add server**.
5. Paste the **full connect string** you assembled in the previous section.
6. Tap **Test server** — the client opens a TCP connection, validates the fingerprint, and (on a Private SMP) checks `PASS`. A green check confirms it works.
7. Toggle **Use server** to **on**, then tap **Save**.

You can either:

* **Use only your server** — disable all the preset public servers in the same screen. New addresses you create will be hosted exclusively on your relays. Existing addresses on other relays continue to work.
* **Mix your server with the presets** — keep the public servers enabled and let SimpleX round-robin. Useful while you're still validating that your relay is stable.

> ⚠️ **Existing SimpleX addresses do not migrate.** Switching the active SMP server only affects **new** addresses (new contacts, new groups). Conversations on addresses hosted by another server keep using that other server. To move a conversation onto your relay, you and your contact both need to delete the old address and reconnect via a new one created on your relay.

***

### Operations

#### Following the logs

Open **Applications → Management → Logs** on [cloud.runonflux.com](https://cloud.runonflux.com). Useful log lines:

* `Server address: smp://...` / `Server address: xftp://...` — the connect string. Logged on every boot.
* `Connected: <count>` — current client count (SMP).
* `INFO Network.Socket: accepted connection` — a client just opened a TCP connection.
* `WARN BasicAuth failed` (Private SMP only) — somebody tried to register without the correct `PASS`.

The Tor onion sidecar logs separately under its own component. Its key lines are `Bootstrapped 100% (done)` (the hidden service is live) and the published `.onion` address.

#### Restarting the app

To restart cleanly (and pull a newer `:latest` image if upstream has released one):

1. Open **Applications → Management** and select your SimpleX app.
2. Go to the **Control** tab, choose **Local**, and click **Restart Application**.
3. Flux re-pulls the image on restart and brings the containers back up. The global-storage volume — and therefore your CA, server identity, fingerprint, and `.onion` private key — is preserved.

#### Rotating `PASS` (Private SMP)

1. Open **Applications → Management → Update** on your Private SMP app.
2. Replace the `PASS` value with the new password and click **Review**, then **sign the update**. Updates to existing apps are **free of charge** on the Flux network.
3. Wait ~1 minute for the container to restart with the new value.
4. **Distribute the new password to anyone who still needs to register new addresses.** Clients already registered with the old `PASS` keep working unchanged — they cached the credential in their address.

#### Updating the image

The `:latest` tag for both `runonflux/simplex-smp-server` and `runonflux/simplex-xftp-server` is rebuilt by Flux's image maintainers from upstream `simplex-chat/simplexmq` releases. To pull the newest version, restart the app as described above. The volume — and therefore the fingerprint — is preserved.

> 💡 **Check upstream release notes before restarting after a long gap.** SimpleX occasionally bumps the protocol version. The server is backward-compatible with older clients, but a major release can land features that newer clients require. The changelog is at [github.com/simplex-chat/simplexmq/releases](https://github.com/simplex-chat/simplexmq/releases).

***

### Backups

Because the **fingerprint is your identity**, losing the persistent volume is far more destructive than for most apps: every address registered on your relay becomes unreachable, and every contact who routes through your relay has to re-add a new server with a different fingerprint. The volume is small (a few MB for keys), so backups are cheap.

FluxOS gives you two complementary ways to protect that data: the **built-in Backup & Restore** tool (snapshot of an entire component, recommended) and direct **Volume Browser** downloads (granular, file-by-file). Use the built-in tool for routine snapshots, and the Volume Browser if you only need to grab the keys.

#### Option A — FluxOS Backup & Restore (recommended)

1. Open **Applications → Management** on [cloud.runonflux.com](https://cloud.runonflux.com), click the **Settings icon** on your SimpleX app, and open the **Backup & Restore** tab.
2. (Optional) Use the **FluxNode IP selector** at the top right to choose which instance to snapshot — by default it targets the current primary, which is usually what you want.
3. Tick the component you want to snapshot (`smpsimplex`, `xftpsimplex`, and/or `onion`) and click **Create Backup**. The snapshot appears in the table below with its **Created Date**, **Expiry Date**, **Size**, and download/remove actions.
4. Click **Download** on the new row to save the snapshot to your computer. **Do this before the expiry date** shown in the table — expired snapshots are removed automatically.

To restore: open the **Restore** tab, pick a **Restore Method** (FluxDrive / Remote URL / Upload File), select the component, and confirm. Restoring **overwrites** the current volume contents with the snapshot.

The full reference for this UI is in [Backup & Restore](../applications/management/manage-app/backup-and-restore.md).

> ⚠️ **Restoring an SMP backup brings the old fingerprint back.** That is exactly what you want for disaster recovery — clients with addresses on your relay will continue to work. But it also means that if you **intentionally** rotated the fingerprint and then restore an older snapshot, you'll undo the rotation. Be deliberate about which snapshot you pick.

#### Option B — Volume Browser (granular, file-level)

For each component, the files worth grabbing are small but critical:

**`smpsimplex` (SMP server)** — under `/etc/opt/simplex/`:

| File | Why it matters |
| ---- | -------------- |
| `ca.key`, `ca.crt` | Root CA. **Owns the fingerprint that's embedded in every client address.** Lose this and the relay's identity is gone. |
| `server.key`, `server.crt` | Short-lived server certificate. Regenerated on rotation; less critical to back up. |
| `smp-server.ini` | Server configuration (queue settings, basic auth, store paths). |
| Queue / message store | Pending messages waiting for delivery. Small and frequently churned — backups are best-effort here. |

**`xftpsimplex` (xFTP server)** — under `/etc/opt/simplex-xftp/`:

| File | Why it matters |
| ---- | -------------- |
| `ca.key`, `ca.crt` | Same identity role as the SMP CA. |
| `server.key`, `server.crt` | Short-lived server certificate. |
| `xftp-server.ini` | xFTP configuration (quota, paths). |
| File store | Uploaded encrypted file blobs. These are end-to-end encrypted to recipients — your backup can never decrypt them, but losing them deletes pending transfers. |

**`onion` (Tor sidecar)** — under `/var/lib/tor/`:

| File | Why it matters |
| ---- | -------------- |
| `hidden_service/hs_ed25519_secret_key` (and friends) | The private key that derives the `.onion` hostname. Losing this rotates your onion address — every client with the old one breaks. |
| `hidden_service/hostname` | The human-readable `.onion` address. Derived from the secret key; safe to regenerate, but convenient to keep around. |

To take a file-level backup, open the **Volume Browser** (Settings → Secure Shell → Volume Browser), navigate into the relevant component, and download the files listed above. Store them somewhere encrypted and offline — they grant full control of your relay's identity.

> 💡 **A 30-second backup is enough.** The combined CA + onion-key footprint is well under 100 KB. Downloading them to an encrypted USB stick once after first launch protects you from 99% of the catastrophic-loss scenarios.

***

### Security Recommendations

1. **Use the application domain everywhere.** Pin your address to the `*.app.runonflux.io` domain, not the raw primary IP — the domain follows primary failovers automatically; an IP-pinned address breaks the moment the primary changes.
2. **Always advertise the onion address alongside the clearnet host** (SMP tiles only). It costs you nothing and gives your users a fallback when their network blocks direct TCP.
3. **Generate a strong `PASS`** if you deploy the Private SMP. `openssl rand -base64 32` produces a value with enough entropy to resist any practical brute-force.
4. **Back up the CA and onion private keys once, soon after first launch.** A copy on an encrypted USB stick is enough — the files are tiny.
5. **Run SMP and xFTP separately**, ideally as two independent Marketplace apps (rather than co-located in one custom deployment). Keeping the message relay and the file relay on different operators / app boundaries is part of SimpleX's threat model.
6. **Don't reuse `PASS` across multiple Private SMP relays.** If one of them is compromised, the others should remain unaffected.
7. **Treat fingerprint rotation as a last resort.** It's the SimpleX equivalent of rotating SSH host keys on a server everyone has already trusted — disruptive, and worth doing only if you believe the CA key has been exposed.

***

### Frequently Asked Questions

#### Do I need to run both an SMP and an xFTP server, or can I get away with just one?

You can deploy them independently. If you only deploy an SMP server, your clients will continue to use the public preset xFTP servers for file transfers (which is fine — files are end-to-end encrypted before they reach the relay). If you want a **fully self-hosted** SimpleX experience, deploy one of each and configure both in your client's **Network & servers** screen.

***

#### Does Flux's HTTPS gateway terminate TLS for my SimpleX server?

No. SimpleX has its own transport encryption layer — clients pin the connection to your server's CA fingerprint, and the protocol does not use HTTP. Traffic to `<app-domain>:5223` (SMP) or `<app-domain>:34443` (xFTP) is plain TCP at the Flux gateway and the SimpleX server speaks its own TLS-like protocol on top. This is why the address embeds the fingerprint instead of relying on a CA-signed certificate.

***

#### What does `isAutoEnterprise: true` mean for these apps?

It marks the template as an **encrypted enterprise app**, which means any value you type into a user field (like `PASS` on the Private SMP) is **PGP-encrypted in the on-chain app spec** before being broadcast to the network. Only the nodes selected to run your app can decrypt it. Use this for secrets you don't want visible in a public block explorer.

***

#### Can my relay be used to spy on conversations?

No — and that's the whole point of SimpleX's design. The SMP server only sees encrypted message blobs and short-lived per-conversation queue identifiers. It cannot link two queue identifiers to the same conversation, cannot read message contents, and does not know any user-stable identifier (because there isn't one). The same applies to xFTP — the server only sees encrypted file blobs. The strongest privacy posture is when **the SMP operator and the xFTP operator are different parties**, which is one reason you might want to deploy your own SMP but keep using the public xFTP presets, or vice versa.

***

#### How do I share my relay with friends or family?

Send them the **full connect string** (the `smp://...` or `xftp://...` URL you assembled). They paste it into their SimpleX client's **Network & servers** screen as described in [Adding Your Server to a SimpleX Client](#adding-your-server-to-a-simplex-client). No accounts, invitations, or coordination with you required — the connect string is the only credential. (For a Private SMP, the connect string contains the password, so treat it like a shared secret.)

***

#### What happens when the primary instance changes?

The application domain (`*.app.runonflux.io`) automatically follows the new primary, so any client that connected via the domain keeps working without changes. The persistent volume — including the CA, server identity, and onion private key — is preserved across failovers, so the **fingerprint and `.onion` address stay the same**. Clients pinned to the raw primary IP will need their address updated; this is why we recommend always using the domain.

***

#### Why does my xFTP server use 40 GB of disk?

The xFTP container is preconfigured with `QUOTA=40gb`, which is the maximum total storage the server will use for queued file blobs. The Flux template allocates **40 GB SSD** to match. Files are temporary — they're deleted once both sender and recipient have completed the transfer and the retention window has elapsed. The "40 GB" is a ceiling, not a baseline; a fresh xFTP server uses a few MB.

***

#### Can I increase the xFTP quota above 40 GB?

Not directly from the Marketplace template — the quota is baked into the container's environment. If you need a larger relay, the path forward is to redeploy as a **custom app** (rather than via the Marketplace) and set a larger `QUOTA` value. You can copy the rest of the configuration from the Marketplace tile.

***

#### Can I use a custom domain instead of the `*.app.runonflux.io` one?

Yes, in the same way as any other FluxCloud app. Follow the [Custom Domain Setup](../register-new-app/custom-domain-setup.md) guide to point your own domain at the app, then **regenerate your connect strings** with the new host and redistribute them to your users. The fingerprint and `.onion` address are unchanged — only the clearnet hostname in the address differs.

***

#### What ports do these apps use?

* **SMP server** — TCP `5223` on the public side, mapped from container port `5223`.
* **xFTP server** — TCP `34443` on the public side, mapped from container port `34443`. Note that this is **not** the upstream default of `443` — clients must include `:34443` in the address.
* **Tor onion sidecar** — exposes port `5223` over the `.onion` address (no clearnet exposure for the onion side).

There is no separate management port, and there is no HTTP listener on these servers — clients always speak the native SimpleX protocol.
