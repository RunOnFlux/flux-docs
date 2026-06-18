# n8n

This guide walks you through the process of **deploying, configuring, and running n8n** on FluxCloud. n8n (pronounced "n-eight-n") is the open-source, source-available workflow automation platform from [n8n GmbH](https://n8n.io) that lets you connect 500+ apps and services, build AI agents, and automate anything — from a two-step Slack notification to a multi-branch data pipeline with custom JavaScript — through a visual node-based editor, with the option to drop into code whenever you need it.

The FluxCloud n8n templates do something most one-click n8n deployments don't: instead of running n8n against a throwaway SQLite file or a single fragile PostgreSQL container, they pair n8n with a **highly-available PostgreSQL cluster** that survives the loss of an instance with **automatic failover**. Two Docker components are deployed together as one application:

| Component | Image | Role |
| --------- | ----- | ---- |
| **n8n** | `n8nio/n8n:latest` | The workflow automation engine and web editor. Web UI on container port `5678`, published on `35678`. |
| **pgcluster** | `runonflux/flux-pg-cluster:latest` | A 3-node, self-managing PostgreSQL 14 cluster (Patroni + etcd) with streaming replication and automatic primary election. n8n stores every workflow, credential, and execution here. |

For more information on **n8n** visit [https://n8n.io](https://n8n.io). The documentation lives at [https://docs.n8n.io](https://docs.n8n.io), and the source code is at [https://github.com/n8n-io/n8n](https://github.com/n8n-io/n8n).

***

### Architecture — How the Two Components Fit Together

Understanding the layout makes the rest of this guide (especially backups and failover) much easier to reason about.

```
            HTTPS (app domain)
                   │
        ┌──────────▼───────────┐
        │   Flux TLS gateway   │  terminates HTTPS, forwards plain HTTP
        └──────────┬───────────┘
                   │  port 35678 → container 5678
        ┌──────────▼───────────┐
        │        n8n           │  workflow engine + editor
        │  /home/node/.n8n     │  ← encryption key (g: replicated)
        └──────────┬───────────┘
                   │  host=pgcluster  port=5433  (primary-routing proxy)
        ┌──────────▼───────────┐
        │      pgcluster       │  Patroni + etcd, PostgreSQL 14
        │  primary ⇄ replica ⇄ replica   (streaming replication)
        │  /var/lib/postgresql/data       (NOT g: — replication syncs it)
        └──────────────────────┘
            3 instances → etcd quorum → automatic failover
```

There are three things worth internalising here:

1. **n8n is stateless-ish; PostgreSQL holds the truth.** Because the templates set `DB_TYPE=postgresdb`, every workflow, credential, execution record, and setting lives in the `n8n` database inside the cluster — **not** in n8n's own folder. n8n's `/home/node/.n8n` directory holds essentially one irreplaceable thing: the **credential encryption key**. (More on that under [Backups](#backups).)

2. **The two components store data differently on purpose.** n8n's `/home/node/.n8n` is mounted on a `g:`-prefixed (Flux-replicated) volume, so the encryption key is mirrored to every instance. The PostgreSQL data directory `/var/lib/postgresql/data` is **not** `g:`-replicated — and that is deliberate. Letting Flux's file-sync layer copy live PostgreSQL data files between nodes would corrupt the database. Instead, **PostgreSQL's own streaming replication** (managed by Patroni) keeps the three copies consistent. Two different data-sync mechanisms, each used where it's correct.

3. **n8n never has to know which node is the primary.** It always connects to `host=pgcluster port=5433`. Port `5433` is a lightweight TCP proxy that runs on every node and continuously polls Patroni's API to find the current PostgreSQL primary, forwarding connections there. When a primary fails and a replica is promoted, the proxy detects the new leader and re-routes new connections automatically — typically **within ~3 seconds** — with no config change in n8n.

> 💡 **Why exactly 3 instances?** Automatic failover needs a consensus store (etcd) that can establish a quorum, and a quorum requires a **minimum of 3 nodes** so that if one is lost the remaining two still form a majority and can elect a new primary. That is why all three n8n tiers deploy on **3 instances** and are marked auto-enterprise — it is the smallest topology that can self-heal.

***

### Choosing Between Starter, Standard, and Pro

The Marketplace ships **three preconfigured tiers** of the same n8n + HA PostgreSQL stack. They are identical in features and architecture — only the resource envelope and price differ. The figures below are **per instance**, and every tier runs on **3 instances**.

| Tier | n8n RAM | PostgreSQL RAM | Total CPU | Total SSD | Price | Best for |
| ---- | ------- | -------------- | --------- | --------- | ----- | -------- |
| **n8n Starter** | 1 GB | 1 GB | 2 cores | 15 GB | $5.32 | Trying n8n out, personal automations, a handful of low-frequency workflows. |
| **n8n Standard** | 2 GB | 1 GB | 2.5 cores | 25 GB | $6.24 | Steady everyday use — dozens of active workflows, light AI-agent work, moderate webhook traffic. |
| **n8n Pro** | 4 GB | 2 GB | 4 cores | 35 GB | $9.87 | Heavy workflows, AI agents with large context, high-frequency triggers, big execution volumes. |

All three deploy the **same `n8nio/n8n:latest` and `runonflux/flux-pg-cluster:latest` images** and behave identically — Pro just gives n8n more room to run memory-hungry nodes (large JSON payloads, AI model calls, big batch loops) and the database more room to cache. You can resize later from **Applications → Management** without losing data; your workflows and credentials live in PostgreSQL and survive a resize.

> 💡 **Which one should I pick?** n8n's RAM use is dominated by the size of the data flowing **through** a single execution — a workflow that pulls a 50 MB API response and runs it through a few transform nodes can briefly hold all of it in memory. If your workflows move small JSON records, **Starter** is plenty. If you process large payloads, run AI-agent nodes, or expect many concurrent executions, start at **Standard** or **Pro**. Resizing up later is painless; you don't need to over-buy on day one.

***

### What You Can Do with n8n

Once deployed, your instance gives you the full self-hosted n8n surface area:

* **Visual workflow builder** — drag nodes onto a canvas, wire them together, and run. Each node is an app (Slack, Gmail, Notion, GitHub, Postgres, HTTP Request…) or a logic block (IF, Switch, Loop, Merge, Wait).
* **500+ integrations** — pre-built nodes for the apps you already use, plus a generic **HTTP Request** node that can talk to any REST or GraphQL API that isn't covered yet.
* **AI agents and LLM workflows** — native nodes for building AI agents, chaining LLM calls, doing retrieval-augmented generation against a vector store, and tool-calling. Bring your own OpenAI/Anthropic/Google/Ollama keys via credentials.
* **Triggers of every kind** — run workflows on a schedule (cron), on an incoming **webhook**, on a new email, on a database change, on a chat message, or manually from the editor.
* **Code when you need it** — the **Code** node runs custom JavaScript or Python against your data mid-workflow, so you're never blocked by a missing feature.
* **Credentials vault** — store API keys and OAuth tokens once, encrypted at rest, and reuse them across workflows. The encryption is keyed by the file in `/home/node/.n8n` (see [Backups](#backups)).
* **Execution history & debugging** — inspect every past run node-by-node, see the exact data that flowed through, and re-run or "pin" data while you build.
* **Sub-workflows and error workflows** — call one workflow from another, and route failures to a dedicated error-handling workflow.

n8n is a **self-hosted alternative** to Zapier and Make — but unbounded by task quotas, with your data and credentials living on your own Flux deployment instead of a third-party SaaS.

> 💡 **What these templates do not include.** n8n's [queue mode](https://docs.n8n.io/hosting/scaling/queue-mode/) (a separate Redis broker plus dedicated worker containers for horizontal scaling of executions) is out of scope for this template — the bundled stack runs n8n in its default single-main mode, which comfortably handles personal and small-team workloads. If you later need to scale execution throughput beyond what Pro offers, queue mode is the upgrade path, deployed as additional Flux components.

***

### How To Install n8n

#### **Steps**

1. **Access FluxCloud**

* Visit [cloud.runonflux.com](https://cloud.runonflux.com) and sign in or create an account.

2. **Find n8n**

* Navigate to the **Marketplace → Productivity** tab, then locate the **n8n Starter**, **n8n Standard**, or **n8n Pro** tile depending on the tier you want, and click **View Details**.

3. **Review the Server Configuration**

* The n8n templates ship with **fixed configurations** (see the [tier comparison](#choosing-between-starter-standard-and-pro) above). Each tier deploys **two components** — `n8n` and `pgcluster` — across **3 instances**.
* You can resize the app later from **Applications → Management** without losing data.
* Click **Install Now** to continue.

4. **Set the Required Passwords**

   Unlike most one-click apps, n8n needs you to supply a few secrets so the engine and the database can authenticate to each other. You will be prompted for the following fields across the two components. **Generate strong, random values (16+ characters) and store them in your password manager before you continue** — and read the matching rule in the warning below carefully.

   **On the `n8n` component:**

   | Field | What to enter |
   | ----- | ------------- |
   | `DB_POSTGRESDB_PASSWORD` | The password n8n uses to connect to PostgreSQL. **This must be exactly the same value** you enter for `POSTGRES_SUPERUSER_PASSWORD` on the `pgcluster` component below. |

   **On the `pgcluster` component:**

   | Field | What to enter |
   | ----- | ------------- |
   | `POSTGRES_SUPERUSER_PASSWORD` | The PostgreSQL superuser (`postgres`) password. **Must match `DB_POSTGRESDB_PASSWORD` above.** |
   | `POSTGRES_REPLICATION_PASSWORD` | The password the PostgreSQL replicas use for streaming replication between your 3 instances. A separate strong random value. |
   | `SSL_PASSPHRASE` | The passphrase used to generate the SSL certificates that encrypt replication traffic between instances. A separate strong random value. |

> ⚠️ **The two passwords MUST match — this is the #1 cause of a failed n8n deployment.**
> `DB_POSTGRESDB_PASSWORD` (on the n8n component) and `POSTGRES_SUPERUSER_PASSWORD` (on the pgcluster component) are the **same credential viewed from both sides**: one is the password n8n presents, the other is the password PostgreSQL expects. If they differ by even one character, the database initialises fine but **n8n cannot log in to it**, and the app never finishes starting. Copy-paste the identical value into both.
>
> ⚠️ **Do not use the `$` character** in any of these passwords. It can be interpreted as a shell/variable expansion during container startup and silently mangle your secret. Stick to letters, digits, and safe symbols like `-` `_` `.`.

5. **Choose Subscription**

* Select your desired **subscription duration**.
* Agree to the **Terms of Use** and **Privacy Policy**, and click the blue **Continue** arrow at the bottom.

6. **Deployment Location**

* Configure whether you want your n8n instance to deploy in specific geographic regions:
  * **Global (Recommended):** No geographic restrictions for best availability and the lowest probability of every instance being affected by the same regional incident — which matters here, because all three instances form one failover cluster.
  * **Custom:** Restrict by continent or country — useful if your users and the APIs you call are all in one region and you want to minimise latency.
* Click the blue **Continue** arrow to proceed.

7. **Email Notifications**

* Optionally enter your email address to receive notifications about your application, including:
  * When your application finishes launching.
  * When the primary server changes (a failover happened).
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

The first boot is heavier than a single-container app because the PostgreSQL cluster has to bootstrap and elect a primary before n8n can connect. Here's the sequence on a fresh deployment:

1. **Image pulls** — Flux pulls `n8nio/n8n:latest` (~500–700 MB) and `runonflux/flux-pg-cluster:latest` onto each of the 3 nodes. First deployment only.
2. **Cluster bootstrap** — on each node the `pgcluster` container starts etcd, starts Patroni, and the three nodes discover each other through the Flux API and **elect a primary**. The primary initialises the `n8n` database; the other two clone it via streaming replication. **This is the slow part** — give it a couple of minutes.
3. **n8n connects** — once the primary is up and the `5433` proxy is routing to it, the `n8n` container connects, runs its schema migrations against the `n8n` database, and starts the editor on port `5678`.

* Expect the **first boot to take roughly 3–6 minutes** end-to-end. Subsequent restarts are faster — the cluster is already initialised.
* You can follow progress from **Applications → Management → Logs**. Useful things to watch for:
  * In the `pgcluster` logs: lines about Patroni electing a leader / `running pg_rewind` / `the leader is`.
  * In the `n8n` logs: `Migrations finished` or `n8n ready on ... port 5678`.

> ⚠️ **If n8n keeps restarting and the logs show a database authentication error,** the two passwords from step 4 almost certainly don't match. See the [FAQ](#n8n-wont-start-and-the-logs-mention-a-database-password-or-authentication-error--what-happened). Fixing it is a quick settings edit.

***

### Create Your Owner Account (First-Time Setup)

The first time you open your n8n URL you are sent to a **sign-up screen**, not a login screen. This is where you create the **owner account** — the first and highest-privilege user.

1. Open **Applications → Management → Information** on [cloud.runonflux.com](https://cloud.runonflux.com) and copy your application domain (it looks like `n8nstarter_<id>.app.runonflux.io`).
2. Visit `https://<your-app-domain>` in a browser.
3. On the **"Set up owner account"** screen, enter:

    | Field | What to enter |
    | ----- | ------------- |
    | **Email** | The email you'll log in with (also used for any n8n notifications you configure). |
    | **First / Last name** | Your name. |
    | **Password** | At least **8 characters**, including at least one number and one capital letter. **Store it in your password manager** — there is no self-service reset on a self-hosted instance. |

4. Click **Next**. n8n logs you straight in as the owner, and you land on the **Workflows** dashboard. You're done.

> ⚠️ **Claim ownership immediately after deployment.** Until the owner account is created, **anyone who reaches your app URL can claim it** and take control of your instance. As soon as the app is live, open the URL and complete this screen — don't leave a fresh, unclaimed n8n exposed.

> 💡 **Optionally enter an activation/license key.** n8n may offer to register for a free community-edition license key (it unlocks a few extra features like folders and debug-in-editor). This is entirely optional and separate from your Flux subscription — you can skip it and add it later under **Settings → Usage and plan**.

***

### Environment Variables Reference

Every variable below is **preconfigured** in the templates. You normally never touch them — but knowing what they do helps with troubleshooting and advanced tuning. The only ones you supply yourself are the passwords from the install step.

#### n8n component

| Variable | Value | What it does |
| -------- | ----- | ------------ |
| `DB_TYPE` | `postgresdb` | Tells n8n to use PostgreSQL instead of the default SQLite — this is what makes the HA database the source of truth. |
| `DB_POSTGRESDB_HOST` | `pgcluster` | The hostname n8n connects to. Resolves to the PostgreSQL component over Flux's internal networking. |
| `DB_POSTGRESDB_PORT` | `5433` | The **primary-routing proxy** port — always reaches the current primary, even after a failover. (Raw PostgreSQL is `5432`; n8n deliberately does **not** use it.) |
| `DB_POSTGRESDB_DATABASE` | `n8n` | The database name n8n uses (created on the cluster by `POSTGRES_DB=n8n`). |
| `DB_POSTGRESDB_USER` | `postgres` | The PostgreSQL user n8n authenticates as (the superuser). |
| `DB_POSTGRESDB_PASSWORD` | *(you set this)* | n8n's database password. **Must equal `POSTGRES_SUPERUSER_PASSWORD`.** |
| `N8N_SECURE_COOKIE` | `false` | Lets the login session cookie work behind Flux's TLS-terminating gateway. n8n's default (`true`) only sends the auth cookie over a direct HTTPS connection; because the Flux gateway terminates HTTPS and forwards plain HTTP to the container, leaving this `true` would stop you from logging in. |
| `EXECUTIONS_DATA_PRUNE` | `true` | Automatically deletes old execution records so the database doesn't grow without bound. |
| `EXECUTIONS_DATA_MAX_AGE` | `336` | Maximum age, **in hours**, of execution data before it's pruned. `336` hours = **14 days**. Running/waiting and manually-saved ("annotated") executions are never pruned. |

#### pgcluster component

| Variable | Value | What it does |
| -------- | ----- | ------------ |
| `POSTGRES_DB` | `n8n` | The application database created on first boot — the one n8n uses. |
| `POSTGRES_SUPERUSER_PASSWORD` | *(you set this)* | Superuser (`postgres`) password. **Must equal n8n's `DB_POSTGRESDB_PASSWORD`.** |
| `POSTGRES_REPLICATION_PASSWORD` | *(you set this)* | Password the replicas use for streaming replication between instances. |
| `SSL_ENABLED` | `true` | Encrypts replication traffic between your instances with TLS. |
| `SSL_PASSPHRASE` | *(you set this)* | Passphrase used to generate the replication SSL certificates. |
| `HOST_POSTGRES_PORT` | `15432` | Host port mapped to PostgreSQL's `5432` (raw database). |
| `HOST_PATRONI_API_PORT` | `18008` | Host port mapped to Patroni's REST API (`8008`) — used for health checks and leader discovery. |
| `HOST_ETCD_CLIENT_PORT` | `12379` | Host port mapped to etcd's client port (`2379`). |
| `HOST_ETCD_PEER_PORT` | `12380` | Host port mapped to etcd's peer port (`2380`) — how the etcd nodes talk to each other. |

> 💡 **Want production-grade webhooks?** By default n8n builds webhook and OAuth callback URLs from the editor address. If you rely heavily on **webhook triggers** or **OAuth credential flows**, add a `WEBHOOK_URL` variable set to your full app domain (`https://<your-app-domain>/`) under **Applications → Management → Settings**, then restart. This guarantees n8n hands out the correct public HTTPS URL to external services instead of an internal one. It's optional, but it saves a class of "my webhook returns the wrong URL" confusion.

> 💡 **The "task runners" deprecation warning in your logs.** Recent n8n releases log `Running n8n without task runners is deprecated`. Task runners move **Code** node execution into an isolated subprocess — more secure and more stable for heavy custom code — and n8n will turn them **on by default in n8n 2.0**. To enable them now (and silence the warning), add `N8N_RUNNERS_ENABLED=true` under **Applications → Management → Settings** and restart. The bundled single-container setup uses the simple *internal* mode automatically, so there's no separate runner container to deploy. It's optional on today's `:latest`, but enabling it ahead of the 2.0 change avoids a surprise later.

***

### Building Your First Workflow

1. From the **Workflows** dashboard, click **+ Create Workflow** (or **Add first step**).
2. Pick a **trigger** — start with **Manual Trigger** ("Trigger manually") to test, or **Schedule Trigger** for a cron job, or **Webhook** to react to an HTTP call.
3. Click the **+** to the right of the trigger to add an **action node** — search for the app you want (e.g. *Slack*, *Gmail*, *HTTP Request*, *Postgres*).
4. The first time you use an app node, n8n asks you to create a **credential** for it (API key, OAuth, etc.). These are stored encrypted in the database.
5. Click **Execute Workflow** (or **Test step**) to run it and watch the data flow node-to-node. Click any node to inspect the exact input/output JSON.
6. When you're happy, toggle the workflow **Active** (top-right). Active workflows run on their triggers automatically.

> 💡 **Webhook test vs. production URLs.** While editing, n8n gives a webhook a **test URL** that only listens while you click "Test step". Once the workflow is **Active**, the **production URL** is live continuously. If you set `WEBHOOK_URL` (see the tip above), both URLs use your public app domain.

***

### The HA PostgreSQL Cluster — Failover Explained

This is the feature that sets the FluxCloud n8n templates apart, so it's worth understanding what actually happens when something breaks.

* **Normal operation.** One of the three `pgcluster` instances is the **primary** (it accepts writes); the other two are **replicas** that continuously stream changes from the primary. n8n connects through the `5433` proxy, which routes it to the primary.
* **A node fails.** If the primary instance goes down, Patroni (coordinated through etcd) notices the leader lease has expired, and the two surviving nodes hold an election. One replica is **promoted to primary**. Because there are 3 nodes, two survivors still form a quorum, so the election succeeds.
* **The proxy re-routes.** The `5433` proxy on each node is polling Patroni's API; it sees the new primary and starts forwarding connections there — typically **within ~3 seconds**. n8n's next database connection lands on the new primary. No config change, no manual promotion.
* **The failed node returns.** When the old primary comes back, Patroni rejoins it to the cluster as a **replica** (using `pg_rewind` if needed) and it starts streaming from the new primary. The cluster is back to full strength.

> 💡 **You can watch the cluster state.** From **Applications → Management → Instances** you can see which instance is currently primary. The `pgcluster` logs on each node also report leader changes.

> ⚠️ **Failover is automatic, but not instantaneous.** During the few seconds it takes to elect a new primary, in-flight database writes can fail. n8n will error those specific executions; **scheduled and webhook workflows simply run again on their next trigger.** For critical workflows, enable an [error workflow](https://docs.n8n.io/flow-logic/error-handling/) so failures during a failover window are caught and retried or alerted on.

***

### Backups

With this stack, "back up n8n" means two distinct things, and you need **both** for a complete, restorable backup:

1. **The PostgreSQL database** — every workflow, credential (encrypted), execution, and setting. This lives inside the cluster's `/var/lib/postgresql/data`.
2. **The n8n encryption key** — the file at `/home/node/.n8n/config` (the `g:`-replicated volume). This key is what **decrypts the credentials** stored in the database.

> ⚠️ **The database is useless without the encryption key.** n8n encrypts every stored credential (API keys, OAuth tokens, passwords) using the key in `/home/node/.n8n/config`. If you restore the database to a fresh n8n that has a *different* key, the workflows come back but **every credential fails to decrypt** and you'll have to re-enter them all. **Back up the encryption key alongside the database, and keep them together.**

#### Option A — FluxOS Backup & Restore (recommended)

FluxCloud's built-in **Backup & Restore** tool snapshots a component's persistent volume without taking the app offline.

1. Open **Applications → Management** on [cloud.runonflux.com](https://cloud.runonflux.com), click the **Settings icon** on your n8n app, and open the **Backup & Restore** tab.
2. Use the **FluxNode IP selector** to target the instance that is the **current primary** (check the **Instances** tab) — that node has the authoritative database.
3. Tick **both** components — `n8n` (for the encryption key) **and** `pgcluster` (for the database) — and click **Create Backup**.
4. **Download** each snapshot before its **Expiry Date** shown in the table; expired snapshots are removed automatically.

The full reference for this UI is in [Backup & Restore](../applications/management/manage-app/backup-and-restore.md).

> ⚠️ **For a guaranteed-consistent database snapshot, prefer a logical dump.** A file-level snapshot of a live PostgreSQL data directory can capture an in-progress write. For a clean, portable backup, open **Secure Shell → Terminal** on the `pgcluster` component and run a `pg_dump`:
>
> ```bash
> pg_dump -h pgcluster -p 5433 -U postgres -d n8n -Fc -f /tmp/n8n-$(date +%F).dump
> ```
>
> Then download `/tmp/n8n-YYYY-MM-DD.dump` from the **Volume Browser**. `-Fc` (custom format) restores with `pg_restore`. Connecting through port `5433` guarantees you dump from the current primary.

#### Option B — Volume Browser (granular, file-level)

The two things you must grab:

| Component | Path | Contents |
| --------- | ---- | -------- |
| `n8n` | `/home/node/.n8n/config` | The **encryption key**. Tiny, irreplaceable. |
| `pgcluster` | a `pg_dump` of the `n8n` database (see above) | Workflows, credentials, executions, settings. |

> 💡 **Test your restore at least once.** A backup you've never restored is a hope, not a backup. Spin up a throwaway second n8n app, restore the database **and** drop in the same encryption-key file, and confirm a credential-using workflow runs. Then delete the throwaway.

***

### Updating n8n

There are two independent things you might update: the **n8n application** and the underlying **container images**.

#### Refresh the container images (security patches)

Both images are pinned to the `:latest` tag, so a restart re-pulls the newest build.

1. Open **Applications → Management** and select your n8n app.
2. Go to the **Control** tab, choose **Local**, and click **Restart Application**.
3. Flux re-pulls `n8nio/n8n:latest` and `runonflux/flux-pg-cluster:latest` and brings the containers back up. Your database and encryption key are preserved on their volumes, and n8n runs any new schema migrations automatically on start.

> ⚠️ **Take a backup before any update.** n8n runs database migrations on startup when it detects a newer version. Migrations are one-way — if you ever need to roll back, your pre-update backup is the only way home. Snapshot **both** components first (see [Backups](#backups)).

> 💡 **Pinning a version for stability.** `:latest` always pulls the newest n8n on restart, which occasionally introduces breaking node changes — notably **n8n 2.0**, which enables Code-node task runners by default (see the [task-runners tip](#environment-variables-reference) above). If you'd rather control exactly when you upgrade, change the n8n image tag from `n8nio/n8n:latest` to a specific release (e.g. `n8nio/n8n:1.70.0`) under **Applications → Management → Settings**. You then upgrade deliberately by bumping the tag.

***

### Security Recommendations

A workflow automation server holds the keys to everything it connects to. Treat it accordingly:

1. **Claim the owner account the instant the app is live** (see [Create Your Owner Account](#create-your-owner-account-first-time-setup)). An unclaimed n8n is an open door.
2. **Use a strong, unique owner password** stored only in your password manager. There is no self-service reset on a self-hosted instance.
3. **Enable two-factor authentication** — **Settings → Personal → Two-factor authentication** — especially for the owner.
4. **Use the HTTPS app domain everywhere.** Treat the raw IP+port endpoints (including the PostgreSQL `15432` port) as debug-only and don't expose them publicly.
5. **Keep your three deployment passwords secret and distinct.** The superuser password (which equals n8n's DB password), the replication password, and the SSL passphrase should each be different, strong, and random.
6. **Back up the encryption key separately and securely.** Anyone who has both your database dump and your encryption key can decrypt every stored credential. Store the key with the same care as the credentials themselves.
7. **Scope the credentials you store.** When you create an API credential inside n8n, give it the least privilege the workflow needs — a read-only token where possible — so a compromise is contained.
8. **Take regular backups** (see [Backups](#backups)) and test restoring them.

***

### Frequently Asked Questions

#### n8n won't start, and the logs mention a database password or authentication error — what happened?

Almost always, the two passwords you set at deployment don't match. `DB_POSTGRESDB_PASSWORD` on the **n8n** component and `POSTGRES_SUPERUSER_PASSWORD` on the **pgcluster** component must be **byte-for-byte identical** — they're the same credential seen from both sides. Fix it from **Applications → Management → Settings**: set both fields to the same value (avoid the `$` character), save, and restart the app from **Control → Local → Restart Application**.

***

#### Why are there three instances, and do I pay for all three?

Three instances is the minimum topology that supports automatic failover: the etcd consensus store needs a 3-node quorum so that losing one node still leaves a majority to elect a new PostgreSQL primary. The tier price covers the whole 3-instance deployment — the per-instance resources in the [tier table](#choosing-between-starter-standard-and-pro) are what each node gets.

***

#### What happens to my workflows if an instance goes down?

Nothing is lost. Your workflows, credentials, and execution history live in the PostgreSQL cluster, which is replicated across all three instances. If the primary fails, a replica is promoted automatically (typically within ~3 seconds) and n8n reconnects through the `5433` proxy with no manual action. Executions that were mid-write during the failover window may error and should be re-run; scheduled and webhook workflows simply fire again on their next trigger. See [Failover Explained](#the-ha-postgresql-cluster--failover-explained).

***

#### My credentials show as "could not be decrypted" after a restore. Why?

You restored the database but not the matching **encryption key**. n8n encrypts every stored credential with the key in `/home/node/.n8n/config`; restoring the database into an n8n with a different key leaves the credentials unreadable. Restore the original `config` file onto the `n8n` component's volume (Volume Browser) and restart. This is why you should always back up the key together with the database — see [Backups](#backups).

***

#### Can I connect to the PostgreSQL database directly?

Yes — n8n itself uses it via the internal `pgcluster:5433` proxy, and you can run admin queries from **Secure Shell → Terminal** on the `pgcluster` component (e.g. `psql -h pgcluster -p 5433 -U postgres -d n8n`). Connecting through `5433` always lands you on the current primary. Exposing the raw `15432` host port to the public internet is **not recommended** — keep database access internal.

***

#### Can I use a custom domain instead of the `*.app.runonflux.io` one?

Yes. Follow the [Custom Domain Setup](../register-new-app/custom-domain-setup.md) guide to point your own domain at the app. If you use webhook triggers or OAuth credentials, also set the `WEBHOOK_URL` variable to your custom domain (see the [environment variables tip](#environment-variables-reference)) so n8n generates the correct public callback URLs. The TLS certificate is provisioned automatically.

***

#### Can I upgrade from Starter to Standard or Pro after deploying?

Yes. At any time — if you feel the hardware specifications no longer reflect your needs — you can adjust them from **Applications → Management → Update App Specifications** on the **Components** tab. Your data lives in the PostgreSQL cluster and on the n8n volume, so it's preserved across the change — you're just giving the containers more CPU, RAM, and disk, and you are billed according to the new specifications. Take a backup first as a matter of habit.

***

#### Why does n8n use port 5433 instead of the standard PostgreSQL port 5432?

`5432` is the raw PostgreSQL port on each individual node — it doesn't know or care which node is the primary. `5433` is the cluster's **primary-routing proxy**: it always forwards to whichever node is currently the writable primary, which is exactly what an application needs so it never has to track failovers. That's why every template sets `DB_POSTGRESDB_PORT=5433`.

***

#### How long is my execution history kept?

By default, **14 days** (`EXECUTIONS_DATA_MAX_AGE=336` hours), after which finished executions are automatically pruned to keep the database lean. Running, waiting, and manually-saved executions are never pruned. To keep history longer, raise `EXECUTIONS_DATA_MAX_AGE` (in hours) under **Applications → Management → Settings** — but watch your database disk usage, especially on Starter.
