# Deploy with AI Agents (MCP)

Flux Cloud has an official [MCP](https://modelcontextprotocol.io) server. Any AI agent that speaks MCP, such as Claude, ChatGPT, Cursor, Windsurf or OpenCode, can quote an app in US dollars, deploy it, pay for it in FLUX, watch it come up, read its logs, update it and cancel it. You describe the app in plain words; the agent does the rest.

***

### Two ways to connect

**Hosted server.** Nothing to install. Add this URL as a remote MCP server in your host:

```
https://mcp.runonflux.com/mcp
```

(`https://mcp.runonflux.io/mcp` works too.) The hosted server stores nothing and holds no keys; it runs on Flux Cloud itself.

**Local server.** Runs on your machine, so private keys never leave it. Recommended for larger budgets.

```bash
npx -y @runonflux/flux-cloud-mcp
```

For Claude Code:

```bash
claude mcp add flux-cloud -s user \
  -e FLUX_ID_PRIVATE_KEY=<wif> -e FLUX_PAYMENT_PRIVATE_KEY=<wif> \
  -- npx -y @runonflux/flux-cloud-mcp
```

For Claude Desktop, Cursor and Windsurf (JSON config):

```json
{
  "mcpServers": {
    "flux-cloud": {
      "command": "npx",
      "args": ["-y", "@runonflux/flux-cloud-mcp"],
      "env": {
        "FLUX_ID_PRIVATE_KEY": "<wif of the Flux ID>",
        "FLUX_PAYMENT_PRIVATE_KEY": "<wif of the payment address>"
      }
    }
  }
}
```

***

### Identity: two keys, no account

There is no account to create. Two keys are the whole identity:

| Key | Address | Role |
|---|---|---|
| Flux ID | `1...` | Owns apps. Signs specifications and API sessions. Never holds funds. |
| Payment address | `t1...` | Holds FLUX and pays deployment fees on-chain. |

The agent can create a fresh pair with the `flux_generate_keys` tool. Save both keys; they cannot be recovered. Then send FLUX to the payment address.

Keys are optional for read-only use: quotes, pricing, app lookup, spec building and validation work without them.

**Keep the balance small.** With the hosted server, keys are passed to tools as call arguments and therefore travel through the AI provider and your chat history. Use a dedicated pair created for the agent, funded with only what a deployment needs, never the keys of a wallet you use elsewhere. For larger budgets run the local server.

***

### A typical session

```
> deploy nginx on flux, 3 instances, one month

flux_get_identity     Flux ID 1Ab..., payment t1Cd..., balance 50 FLUX ($2.57)
flux_build_spec       v8 spec, port 39978 -> 80, replicated /data, valid
flux_quote_app        $0.99 for 1 month, pay 19.24 FLUX (5% FLUX discount)
  you agree
flux_deploy_app       message broadcast, 19.24 FLUX paid, txid 0c41...
flux_wait_for_app     accepted, 3/3 instances running
                      https://myapp.app.runonflux.io
```

Nothing is spent until the agent calls `flux_deploy_app` with `confirm=true`, and good hosts ask you before that call.

***

### Pricing

Every price the server quotes is the Flux Cloud USD price, the same as on [home.runonflux.io](https://home.runonflux.io), converted to FLUX at the live market rate with the 5% discount for paying in FLUX. See the [Cost Calculator](./cost-calculator.md) for the rate card.

***

### Tools

| Tool | What it does |
|---|---|
| `flux_get_identity` | Flux ID, payment address, balance in FLUX and USD |
| `flux_generate_keys` | New Flux ID and payment key pair |
| `flux_get_pricing` | USD rate card, FLUX/USD rate, discounts, reference sizes |
| `flux_build_spec` | Image, ports, cpu/ram/hdd and term to a full app specification |
| `flux_validate_spec` | Local rules plus verification on the network |
| `flux_quote_app` | USD price and FLUX to pay, for a registration or an update |
| `flux_deploy_app` | Plan by default; with `confirm=true` signs, broadcasts and pays |
| `flux_wait_for_app` | Polls until accepted and running; returns URLs |
| `flux_get_app` | Any app's specification, expiry, instances and URLs |
| `flux_list_my_apps` | Apps owned by the Flux ID |
| `flux_get_app_logs` | Container logs from a running instance |
| `flux_get_app_stats` | Live CPU, memory and network of an instance |
| `flux_control_app` | Restart, redeploy or remove instances |
| `flux_cancel_app` | End an app early |
| `flux_get_network_info` | Node counts, block height, FLUX/USD rate |

The server also ships guides the agent reads on its own: how Flux Cloud works, the app specification format, pricing, and common pitfalls.

***

### Source and package

* npm: [@runonflux/flux-cloud-mcp](https://www.npmjs.com/package/@runonflux/flux-cloud-mcp)
* Source: [github.com/RunOnFlux/flux-cloud-mcp](https://github.com/RunOnFlux/flux-cloud-mcp) (MIT)
* Container: `ghcr.io/runonflux/flux-cloud-mcp` for running your own hosted copy
