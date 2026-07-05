# Hermes Agent

> 🚀 **Dedicated Hermes hosting portal:** Hermes Agent on Flux now has its own purpose-built site at **[hermes.runonflux.com](https://hermes.runonflux.com)** — one-click Hermes AI agent hosting with bring-your-own AI key and privacy-first defaults. It gives you a streamlined checkout (pay by card or subscription via Stripe, or with FLUX crypto) and a dedicated management dashboard — live CPU/RAM/disk stats, an in-browser terminal and file manager, billing and renewal controls, and a global server-location map. The Marketplace walkthrough below still applies — the configuration options are the same, and your instance runs as a standard Flux app you can also manage from [cloud.runonflux.com](https://cloud.runonflux.com).

This guide walks you through the process of **deploying, configuring, and managing Hermes Agent** using FluxCloud. Hermes Agent is the self-improving AI agent by [Nous Research](https://nousresearch.com) — it ships a browser dashboard for driving the agent and an OpenAI-compatible API server, with optional private networking via Tailscale.

Hermes Agent is offered in **two sizes**, both built from the same image:

| Listing | vCPU | RAM | Disk | Best for |
| --- | --- | --- | --- | --- |
| **Hermes Agent** | 2 | 4 GB | 20 GB | Getting started and lighter workloads. |
| **Hermes Agent Pro** | 4 | 8 GB | 80 GB | Heavier or professional usage. |

You can change the specs of your app at any time after deployment, so either listing is a fine starting point.

***

### How the Security Model Works

The Hermes dashboard has **no authentication of its own** — exposing it directly would let anyone who finds the URL read your AI-provider API keys and drive the agent. The FluxCloud image fixes this with two independent locks:

```
  https://<dashboard-domain>  ──▶  Caddy basic-auth gate  ──▶  Hermes dashboard
                                   (DASHBOARD_USERNAME + DASHBOARD_PASSWORD)

  https://<api-domain>        ──▶  OpenAI-compatible API server
                                   (Authorization: Bearer API_SERVER_KEY)
```

* **Dashboard (primary URL)** — a Caddy reverse proxy puts an HTTP basic-auth password gate in front of the dashboard. The raw dashboard port is never published.
* **API server (second URL)** — Hermes' OpenAI-compatible API server is published directly and protected by its own bearer-token key.

Because of this, deployment requires you to set the dashboard **username and password** plus a separate **API server key**.

***

### How To Install Hermes Agent

There are two ways to deploy Hermes Agent on Flux. Both produce the same app with the same configuration options — pick whichever suits you.

#### Option A (Recommended): Deploy from hermes.runonflux.com

The dedicated portal at [**hermes.runonflux.com**](https://hermes.runonflux.com) walks you through deployment in a purpose-built wizard and gives you a built-in management dashboard afterwards. Hosting starts at **$4.02/month**, with your **first month free**.

1. **Sign in**

* Visit [hermes.runonflux.com](https://hermes.runonflux.com) and log in — **Google** or **ZelCore** login is supported.
* Click **Deploy** to open the deployment wizard.

2. **Choose Plan**

* Pick **Hermes Agent** (2 vCPU / 4 GB RAM / 20 GB disk) or **Hermes Agent Pro** (4 vCPU / 8 GB RAM / 80 GB disk).

3. **Configure**

* Name your instance and select the **subscription duration** — 1, 3, 6, or 12 months, with discounts for longer terms (3% / 6% / 12%).

4. **Environment**

* Set the required secrets — the same rules apply as on the Marketplace:
  * **`DASHBOARD_USERNAME`** and a strong **`DASHBOARD_PASSWORD`** — together these protect the Hermes dashboard login. Anyone with these credentials and your app domain can drive the agent and read your AI-provider keys.
  * **`API_SERVER_KEY`** — the bearer token for the OpenAI-compatible API server. You will use this exact value as the API key in external clients. Treat it like a password.
* Secret fields have a built-in **Generate** button to create strong values for you, plus show/hide and copy controls.
* Optionally provide a **`TAILSCALE_AUTHKEY`** so the agent can reach private services on your Tailscale network — see the [Tailscale section](#tailscale-optional) below. You can skip this and add it later.

5. **Location**

* Leave the location list empty for **global** deployment (recommended for best availability), or restrict deployment to specific **continents or countries**.

6. **Review & Pay**

* Review your order and choose a payment method:
  * **Card via Stripe** — with an optional **auto-renewal** toggle so your subscription renews automatically.
  * **Crypto (FLUX)** — a one-time payment (no auto-renewal); the same FLUX Mainnet warning below applies.
* The wizard shows a **Finalizing** screen while your instance deploys, then your new server appears in the portal's dashboard.

7. **Manage**

* Your instance gets a built-in management panel right on the portal, with **Overview** (live stats), **Console** (in-browser terminal), **Files**, **Backup**, and **Billing** tabs — see [Managing Your App](#managing-your-app) below.

Your app also runs as a standard Flux application, so everything in this guide — the [security model](#how-the-security-model-works), [dashboard access](#access-the-hermes-dashboard), [AI provider setup](#configure-your-ai-provider), and the [API server](#the-openai-compatible-api-server) — applies identically.

#### Option B: FluxCloud Marketplace

You can also deploy Hermes Agent from the general-purpose FluxCloud Marketplace at [cloud.runonflux.com](https://cloud.runonflux.com).

1. **Access FluxCloud**

* Visit [cloud.runonflux.com](https://cloud.runonflux.com) and sign in or create an account.

2. **Find Hermes Agent**

* Navigate to the **Marketplace → Applications** tab, then locate the **Hermes Agent** (or **Hermes Agent Pro**) tile and click **View Details**.

3. **Select Server Configuration**

* Choose the version that best fits your usage:
  * **Hermes Agent** – 2 vCPU / 4 GB RAM / 20 GB disk, suited for getting started and lighter workloads.
  * **Hermes Agent Pro** – 4 vCPU / 8 GB RAM / 80 GB disk, for heavier or professional usage.
* You can change the specs of your app at any time after deployment to match your needs.
* Click **Install Now** to continue.

4. **Choose Subscription**

* Select your desired **subscription duration**.
* Agree to the **Terms of Use** and **Privacy Policy**, and click the blue **Continue** arrow at the bottom.

5. **Set Dashboard Credentials (Required)**

* Choose a **`DASHBOARD_USERNAME`** and a strong **`DASHBOARD_PASSWORD`**. Together these protect the Hermes dashboard login.
* The username field's placeholder is `admin`, but you can pick any username you like.
* Choose a long, unique password — anyone with these credentials and your app domain can drive the agent and read your AI-provider keys.

6. **Set an API Server Key (Required)**

* Provide a strong value in the **`API_SERVER_KEY`** field. This is the bearer token for the OpenAI-compatible API server.
* You will use this exact value as the API key in external clients such as Open WebUI or your own scripts.
* Treat it like a password — keep it secret and make it hard to guess.

7. **Provide a Tailscale Auth Key (Optional)**

* You can optionally provide a **Tailscale auth key** (`TAILSCALE_AUTHKEY`) so the agent can reach private services on your Tailscale network.
* This step is **not required** — you can skip it and add it later from the app settings.
* See the [Tailscale section](#tailscale-optional) below for details on generating a key.

8. **Deployment Location**

* Configure whether you want your Hermes Agent instance to deploy in specific geographic regions:
  * **Global (Recommended):** No geographic restrictions for best availability.
  * **Custom:** Restrict by continent or country.
* Click the blue **Continue** arrow to proceed.

9. **Email Notifications**

* Optionally enter your email address to receive notifications about your app, including:
  * When your application finishes launching.
  * When the primary server changes.
  * When your app expiration date is approaching.

10. **Launching the Application**

* Your application must be **signed and registered** on the Flux network.
  1. Click **Sign and Register**.
  2. Sign the message using the pop-up.
     * If you logged in via Google or Email, this step is completed automatically.

11. **Complete Payment**

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

### Access the Hermes Dashboard

The dashboard is the main web interface for driving the agent. It is protected by the password gate you set during deployment.

1. Visit [**cloud.runonflux.com**](https://cloud.runonflux.com) and log in.
2. Go to **Applications → Management** and open your Hermes Agent app.
3. Click the **primary app domain** to launch the dashboard in your browser, for example:

    ```
    https://appname.app.runonflux.io
    ```

4. When prompted, sign in with the **`DASHBOARD_USERNAME`** and **`DASHBOARD_PASSWORD`** you provided during deployment.
5. Your browser stores the session, so you only need to log in again after clearing cookies or switching devices.

> 💡 **Forgot your credentials?** You can update `DASHBOARD_USERNAME` and `DASHBOARD_PASSWORD` at any time from **Applications → Management → Settings** on your Hermes Agent app. The container restarts with the new credentials.

***

### Configure Your AI Provider

Hermes Agent does **not** include an AI model — you bring your own provider key. It supports **OpenRouter, OpenAI, Anthropic, Google Gemini, and many more**.

> ⚠️ **The model picker only lists providers that already have a working credential.** If you open **Models → Change** ("Set Main Model") and the *"Filter providers and models…"* box shows nothing, it means no provider key has been added yet — add one first.

#### Add a provider key (dashboard)

1. Open the Hermes dashboard and click **Keys** in the sidebar (not Models).
2. Add an API key — or OAuth login / custom endpoint — for at least one provider, e.g. your `ANTHROPIC_API_KEY`, `OPENROUTER_API_KEY`, or `OPENAI_API_KEY`.
3. Go to **Models**, click **Change** on the Main model row, and the now-authenticated provider appears in the left column. Pick a model on the right and click **Switch**.

#### Add a provider key (SSH)

Alternatively, open the **Secure Shell → Terminal** from your app's management page and run the interactive wizard:

```bash
/opt/hermes/.venv/bin/hermes model
```

It walks you through provider authentication and sets your main model.

> 💡 The `hermes` CLI is **not on `PATH`** in the Secure Terminal — invoke it via the full binary path `/opt/hermes/.venv/bin/hermes`. If you prefer a shorter command for the session, run `export PATH=/opt/hermes/.venv/bin:$PATH` first and then call `hermes` directly.

You can add multiple providers and switch the default model at any time. Without at least one provider credential, the model picker stays empty and the agent cannot complete tasks.

***

### The OpenAI-Compatible API Server

In addition to the dashboard, Hermes publishes an **OpenAI-compatible API server** on a second port. This lets you point external tools — such as [Open WebUI](https://openwebui.com) or your own scripts — at the agent.

1. In **Applications → Management**, find the **second domain** listed for your app — this is the API server URL (it is separate from the dashboard URL).
2. In your client, set:
   * **Base URL / API endpoint:** the API server domain, e.g. `https://appname_api.app.runonflux.io`
   * **API key:** the exact `API_SERVER_KEY` value you set during deployment.
3. The client sends requests with an `Authorization: Bearer <API_SERVER_KEY>` header — most OpenAI-compatible clients do this automatically once you enter the key.

> 💡 The API server has its **own** bearer-token auth and is **not** behind the dashboard password gate. The `DASHBOARD_PASSWORD` and `API_SERVER_KEY` are two independent secrets — one for the web UI, one for the API.

***

### Tailscale (Optional)

Hermes Agent on Flux includes built-in Tailscale support, allowing the agent to reach private services on your own [Tailscale](https://tailscale.com) network (your tailnet).

**To enable Tailscale:**

1. Generate an auth key from your [Tailscale admin console](https://login.tailscale.com/admin/settings/keys) — use an **ephemeral** and **reusable** key for containers.
2. Provide the key as `TAILSCALE_AUTHKEY` during deployment, or update it later in the app settings.
3. Once the container starts, it automatically joins your tailnet.

**Advanced options (available in deployment settings):**

* `TAILSCALE_HOSTNAME` — customize the device name on your tailnet (default: `hermes`).
* `TAILSCALE_EXTRA_ARGS` — additional flags for `tailscale up` (e.g. `--advertise-tags=tag:server`).

Tailscale runs in **userspace networking mode** because Flux containers do not have kernel-level TUN device access. This has important implications for how the agent connects to other machines on your tailnet — see below.

#### Connecting to Other Tailscale Machines (SSH, HTTP, etc.)

Because Tailscale runs in userspace networking mode, it does **not** create a real network interface inside the container. This means:

* `tailscale ping` and `tailscale status` work normally (they use the Tailscale control plane).
* **Direct TCP connections (SSH, curl, etc.) do NOT automatically route through Tailscale.**

Instead, all outbound traffic to your tailnet must go through the **SOCKS5 / HTTP proxy** that Tailscale provides on `localhost:1055`.

**curl / HTTP requests to a Tailscale machine:**

```bash
curl --socks5-hostname localhost:1055 http://<tailscale-ip>:8080
```

**SSH to a Tailscale machine:**

```bash
ssh -o ProxyCommand='ncat --proxy-type socks5 --proxy localhost:1055 %h %p' user@<tailscale-ip>
```

Or set the environment variable for all tools that respect it:

```bash
export ALL_PROXY=socks5://localhost:1055
```

**What does NOT work without the proxy:**

Any tool that tries to connect directly to a Tailscale IP will fail with "connection timed out" or "network is unreachable" — because the container's kernel has no Tailscale routes. Always route through `localhost:1055`.

Tailscale state is stored inside the app's persistent volume, so the device keeps its identity across restarts and redeploys — it will not create duplicate entries on your tailnet.

***

### Managing Your App

Most day-to-day usage happens in the Hermes dashboard itself. For managing the deployment, you have two panels:

**Dedicated portal — [hermes.runonflux.com](https://hermes.runonflux.com)**

If you deployed via the dedicated portal (or once your instance shows up there), its management panel gives you:

* **Overview** — live server stats at a glance.
* **Console** — an in-browser terminal into the container.
* **Files** — a built-in file manager.
* **Backup** — back up your instance data.
* **Billing** — payment and renewal controls.

**FluxCloud — [cloud.runonflux.com](https://cloud.runonflux.com)**

Your instance is a standard Flux app, so from **Applications → Management** on [cloud.runonflux.com](https://cloud.runonflux.com) you can also:

* **Update settings** — change `DASHBOARD_USERNAME`, `DASHBOARD_PASSWORD`, `API_SERVER_KEY`, or the Tailscale variables; the container restarts with the new values.
* **Change specs** — scale between the Hermes Agent and Hermes Agent Pro resource tiers.
* **Open a Secure Shell** — use the **Terminal** to SSH into the container for advanced troubleshooting.
* **Check instances** — see which instance is currently the primary under the **Instances** tab.

***

### Frequently Asked Questions

#### What is the difference between Hermes Agent and Hermes Agent Pro?

They run the same software. **Hermes Agent** is provisioned with 2 vCPU / 4 GB RAM / 20 GB disk, while **Hermes Agent Pro** has 4 vCPU / 8 GB RAM / 80 GB disk for heavier workloads. You can switch tiers after deployment from **Applications → Management**.

***

#### What is the dashboard username and password?

Both are values **you choose during deployment** — `DASHBOARD_USERNAME` and `DASHBOARD_PASSWORD`. The username field suggests `admin` as a placeholder, but you can set any username.

***

#### I forgot my dashboard credentials — how do I reset them?

Update `DASHBOARD_USERNAME` and/or `DASHBOARD_PASSWORD` from **Applications → Management → Settings** on your Hermes Agent app. The container restarts with the new credentials.

***

#### Why are there separate dashboard credentials and an `API_SERVER_KEY`?

They protect two different entry points. `DASHBOARD_USERNAME` / `DASHBOARD_PASSWORD` gate the **web dashboard** (via the Caddy basic-auth proxy). `API_SERVER_KEY` is the bearer token for the **OpenAI-compatible API server**. They are independent — set all three, and keep the API key different from the dashboard password.

***

#### The "Set Main Model" picker is empty — no providers or models show up. Why?

The model picker only lists providers that have a **working credential**. An empty filter means no AI provider key has been added yet. Open the **Keys** section in the dashboard sidebar and add an API key (e.g. `ANTHROPIC_API_KEY` or `OPENROUTER_API_KEY`), or run `/opt/hermes/.venv/bin/hermes model` from the Secure Terminal (the CLI is not on `PATH`). The provider then appears in the picker. See [Configure Your AI Provider](#configure-your-ai-provider) above.

***

#### How do I connect Open WebUI or another client to the API server?

Point the client at the **second domain** shown for your app in the management panel and use your `API_SERVER_KEY` as the API key. The Hermes API is OpenAI-compatible, so any client that supports a custom OpenAI base URL will work.

***

#### Do I need a Tailscale auth key?

No. Tailscale is optional — leave `TAILSCALE_AUTHKEY` empty to skip it. Only provide a key if you want the agent to reach private services on your own tailnet. You can add it later from the app settings.

***

#### I provided a Tailscale auth key but the agent cannot SSH to other tailnet machines — why?

Flux containers run Tailscale in **userspace networking mode**, so direct TCP connections to Tailscale IPs will not work. Route traffic through the SOCKS5 proxy on `localhost:1055` as shown in the [Tailscale section](#connecting-to-other-tailscale-machines-ssh-http-etc) above.

***

#### Can I change my app's hardware specifications after deployment?

Yes. At any time — if you feel the hardware specifications no longer reflect your needs — you can adjust them from **Applications → Management → Update App Specifications** on the **Components** tab. Your data is preserved across the change, and you are billed according to the new specifications.

***

#### What happens if the primary server goes down?

If your current primary server becomes unavailable, one of the standby instances automatically takes over as the new primary after a short delay. Your Hermes Agent data remains intact so you can continue where you left off once the switch is complete. You can check which instance is currently the primary from your application's management panel under the **Instances** tab.
