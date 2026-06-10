# OpenClaw

This guide walks you through the process of **deploying, configuring, and managing an OpenClaw instance** using FluxCloud. OpenClaw is an AI assistant platform that combines a browser Control UI with an interactive setup wizard, multi-provider AI model support, and optional private networking via Tailscale.

> 🚀 **Dedicated OpenClaw portal:** OpenClaw on Flux now has its own purpose-built site at **[openclaw.runonflux.com](https://openclaw.runonflux.com)**, covering both the standard and **Pro** plans. It gives you a streamlined checkout (pay by card or subscription via Stripe, or with FLUX crypto) and a dedicated management dashboard — live CPU/RAM/disk stats, an in-browser terminal and file manager, billing and renewal controls, and a global server-location map. **Clicking the OpenClaw tile in the FluxCloud Marketplace now redirects you there automatically.** The Marketplace walkthrough below still applies — the configuration options are the same, and your instance runs as a standard Flux app you can also manage from [cloud.runonflux.com](https://cloud.runonflux.com).

***

### How To Install OpenClaw

#### **Steps**

1. **Access FluxCloud**

* Visit [cloud.runonflux.com](https://cloud.runonflux.com) and sign in or create an account.


2. **Find OpenClaw**

* Navigate to the **Marketplace → Applications** tab, then locate the **OpenClaw** tile and click **View Details**.

3. **Select Server Configuration**

* Choose the version that best fits your usage:
  * **Regular** – suited for beginner users and lighter workloads.
  * **Pro** – higher hardware specs for professional or heavier usage.
* You can change the specs of your app at any time after deployment to match your needs.
* Click **Install Now** to continue.

4. **Choose Subscription**

* Select your desired **subscription duration**.
* Agree to the **Terms of Use** and **Privacy Policy**, and click the blue **Continue** arrow at the bottom.

5. **Set a Gateway Password (Required)**

* Provide a strong password in the **`OPENCLAW_GATEWAY_PASSWORD`** field. This password is one of two credentials used to log in to the Control UI — the second is a **gateway token** that is printed later by the `openclaw onboard` wizard (see [Run the Onboard Wizard via SSH](#run-the-onboard-wizard-via-ssh-get-your-gateway-token) below).
* Choose something long and unique — anyone with both credentials and your app domain can access your assistant.

6. **Provide a Tailscale Auth Key (Optional)**

* You can also optionally provide a **Tailscale auth key** (`TAILSCALE_AUTHKEY`) to connect your instance to your private Tailscale network.
* This step is **not required** — you can skip it and add it later from the app settings.
* See the [Tailscale section](#tailscale-optional) below for details on generating a key.

7. **Deployment Location**

* Configure whether you want your OpenClaw instance to deploy in specific geographic regions:
  * **Global (Recommended):** No geographic restrictions for best availability.
  * **Custom:** Restrict by continent or country.
* Click the blue **Continue** arrow to proceed.

8. **Email Notifications**

* Optionally enter your email address to receive notifications about your app, including:
  * When your application finishes launching.
  * When the primary server changes.
  * When your app expiration date is approaching.

9. **Launching the Application**

* Your application must be **signed and registered** on the Flux network.
  1. Click **Sign and Register**.
  2. Sign the message using the pop-up.
     * If you logged in via Google or Email, this step is completed automatically.

10. **Complete Payment**

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

### Run the Onboard Wizard via SSH (Get Your Gateway Token)

After your instance is running, complete first-time setup by running the interactive wizard. The wizard also **prints your gateway token**, which you need (alongside the gateway password) to log in to the Control UI.

1. Go to **Applications → Management** on [cloud.runonflux.com](https://cloud.runonflux.com) and select your OpenClaw app.
2. Open the **Secure Shell** menu and use the **Terminal** with bash to SSH into your container.
3. Run:

    ```
    openclaw onboard
    ```

This interactive wizard will:

* Set up device pairing.
* Configure your AI model provider and API keys.
* Select your default AI model.
* Print the **gateway token** required for Control UI login — copy and save it somewhere safe before closing the terminal.

You can re-run `openclaw onboard` at any time to add additional AI models or to print the gateway token again if you lose it.

> ⚠️ **Re-running the wizard — keep your configuration.** When `openclaw onboard` detects an existing configuration, it asks whether to **Keep current values**, **Review and update**, or **Reset before setup**. Choose **Keep current values** (or **Review and update**). **Do not choose _Reset_:** it deletes your `openclaw.json`, including the Control UI settings that let you reach the dashboard through your `https://appname.app.runonflux.io` domain. After a Reset, the Control UI shows a **"Browser origin not allowed"** error until those settings are restored — see [Why does the Control UI show "Browser origin not allowed"?](#why-does-the-control-ui-show-browser-origin-not-allowed) in the FAQ.

***

### Access the Control UI

OpenClaw's browser Control UI is protected by **two credentials**:

* The **gateway password** (`OPENCLAW_GATEWAY_PASSWORD`) you set during deployment.
* The **gateway token** printed by `openclaw onboard` — see the section above.

The login form asks for both on the same screen, so make sure you have the token before opening the UI.

1. Visit [**cloud.runonflux.com**](https://cloud.runonflux.com) and log in.
2. Go to **Applications → Management** and open your OpenClaw app.
3. Click the app domain to launch the Control UI in your browser, for example:

    ```
    https://appname.app.runonflux.io
    ```

4. When prompted, enter your **gateway password** and **gateway token**.
5. The Control UI stores the session in your browser, so you only need to log in again after clearing cookies or switching devices.

> 💡 **Lost your credentials?** You can update `OPENCLAW_GATEWAY_PASSWORD` at any time from **Applications → Management → Settings**; the container restarts with the new password. If you lost the gateway token, re-run `openclaw onboard` from the Secure Terminal to print it again.

***

### AI Provider Keys

At least one AI provider key is required for the assistant to function. Keys can be set during `openclaw onboard`.

| Provider      | Environment Variable  | Free Tier                    |
| ------------- | --------------------- | ---------------------------- |
| Google Gemini | `GEMINI_API_KEY`      | Yes (aistudio.google.com)    |
| Anthropic     | `ANTHROPIC_API_KEY`   | No                           |
| OpenAI        | `OPENAI_API_KEY`      | No                           |
| OpenRouter    | `OPENROUTER_API_KEY`  | Some models                  |
| Groq          | `GROQ_API_KEY`        | Yes                          |
| Perplexity    | `PERPLEXITY_API_KEY`  | No                           |
| ElevenLabs    | `ELEVENLABS_API_KEY`  | Yes (voice/TTS)              |
| Deepgram      | `DEEPGRAM_API_KEY`    | Yes (speech-to-text)         |

***

### Tailscale (Optional)

OpenClaw on Flux includes built-in Tailscale support, allowing you to access your instance securely over your private Tailscale network instead of (or in addition to) the public Flux domain.

**To enable Tailscale:**

1. Generate an auth key from your [Tailscale admin console](https://login.tailscale.com/admin/settings/keys) — use an **ephemeral** and **reusable** key for containers.
2. Provide the key as `TAILSCALE_AUTHKEY` during deployment, or update it later in the app settings.
3. Once the container starts, it will automatically join your tailnet.
4. Access OpenClaw via the Tailscale hostname (default: `openclawflux`) on your tailnet.

**Advanced options (available in deployment settings):**

* `TAILSCALE_HOSTNAME` — customize the device name on your tailnet (default: `openclawflux`).
* `TAILSCALE_EXTRA_ARGS` — additional flags for `tailscale up` (e.g. `--advertise-tags=tag:server`).

Tailscale runs in **userspace networking mode** because Flux containers do not have kernel-level TUN device access. This has important implications for how you connect to other machines on your tailnet — see below.

#### Connecting to Other Tailscale Machines (SSH, HTTP, etc.)

Because Tailscale runs in userspace networking mode, it does **not** create a real network interface inside the container. This means:

* `tailscale ping` and `tailscale status` work normally (they use the Tailscale control plane).
* **Direct TCP connections (SSH, curl, etc.) do NOT automatically route through Tailscale.**

Instead, all outbound traffic to your tailnet must go through the **SOCKS5 proxy** that Tailscale provides on `localhost:1055`.

**SSH to a Tailscale machine:**

```bash
ssh -o ProxyCommand='ncat --proxy-type socks5 --proxy localhost:1055 %h %p' user@<tailscale-ip>
```

Or using netcat:

```bash
ssh -o ProxyCommand='nc -x localhost:1055 %h %p' user@<tailscale-ip>
```

To avoid typing the proxy option every time, add this to `~/.ssh/config` inside the container:

```
Host 100.*
    ProxyCommand ncat --proxy-type socks5 --proxy localhost:1055 %h %p
```

This will automatically proxy all SSH connections to Tailscale IPs (which are in the `100.x.x.x` range).

**curl / HTTP requests to a Tailscale machine:**

```bash
curl --socks5-hostname localhost:1055 http://<tailscale-ip>:8080
```

Or set the environment variable for all tools that respect it:

```bash
export ALL_PROXY=socks5://localhost:1055
```

**What does NOT work without the proxy:**

Any tool that tries to connect directly to a Tailscale IP will fail with "connection timed out" or "network is unreachable" — because the container's kernel has no Tailscale routes. Always route through `localhost:1055`.

***

### What Requires SSH

Most day-to-day usage works through the browser Control UI. The following features require SSH access to the container:

* Adding/removing messaging channels (Telegram, Discord, Slack, etc.).
* Creating/deleting agents and binding them to channels.
* Approving DM pairing requests from new users.
* Security audits (`openclaw security audit`).
* Backup and restore (`openclaw backup`).
* Installing system dependencies for advanced skills.

***

### Frequently Asked Questions

#### How do I change my AI provider or add additional models?

Re-run `openclaw onboard` from the **Secure Shell → Terminal** on your app's management page. The wizard is safe to run multiple times and will let you add new providers or switch the default model without losing existing configuration. When it asks about your existing configuration, choose **Keep current values** or **Review and update** — **never _Reset_**, which removes the settings needed to access the Control UI through your app domain (see the [origin error FAQ](#why-does-the-control-ui-show-browser-origin-not-allowed) below).

***

#### Why does the Control UI show "Browser origin not allowed"?

This error means the gateway is missing the Control UI origin settings that authorize access through your app domain (`https://appname.app.runonflux.io`). The most common cause is choosing **Reset** during `openclaw onboard`, which clears those values.

Restore them from the **Secure Shell → Terminal**:

```bash
openclaw config set gateway.controlUi.dangerouslyAllowHostHeaderOriginFallback true
openclaw config set gateway.controlUi.allowInsecureAuth true
```

Then restart the app from **Applications → Management** (or restart the container) and reload the Control UI. These commands only add the two settings — your AI providers, channels, and other configuration are left untouched.

***

#### Can I upgrade from Regular to Pro (or change specs) after deployment?

Yes. You can change the specs of your OpenClaw app at any time from **Applications → Management** on FluxCloud to match your usage needs.

***

#### I provided a Tailscale auth key but cannot SSH to other tailnet machines — why?

Flux containers run Tailscale in **userspace networking mode**, so direct TCP connections to Tailscale IPs will not work. Route traffic through the SOCKS5 proxy on `localhost:1055` as shown in the [Tailscale section](#connecting-to-other-tailscale-machines-ssh-http-etc) above.

***

#### What happens if the primary server goes down?

If your current primary server becomes unavailable or experiences downtime, one of the standby instances automatically takes over as the new primary after a short delay. Your OpenClaw data remains intact so you can continue where you left off once the switch is complete. You can check which instance is currently the primary from your application's management panel under the **Instances** tab.
