# Diagnosing Issues

Even well‑configured nodes can encounter problems. Use these tools and commands to gather diagnostics and resolve common issues.

***

### Multitoolbox Analyzer & Fixer

#### 1. Launch Multitoolbox

```bash
multitoolbox
```

#### 2. Select Option 3: Analyzer and Fixer

* The script will run health checks and attempt automatic repairs.
* Review its output for any errors or suggested actions.

***

### FluxNode View Script

For deeper insight, run the FluxNode View tool:

```bash
bash -i <(curl -s https://raw.githubusercontent.com/JKTUNING/Flux-Node-Tools/main/flux_node_viewer.sh)
```

When the menu appears, use these options:

| Option | Function                           |
| ------ | ---------------------------------- |
| **B**  | Benchmark information (EPS, DWS)   |
| **N**  | Node status & network port summary |
| **D**  | Daemon status and logs             |
| **S**  | UPnP mapping details               |
| **L**  | Real‑time node logs (tail)         |

***

### Getting Help

* **Official Support:** [Flux Helpdesk](https://support.runonflux.io/support/home)
* **Community Support:** `#nodes-support` channel on the [official Flux Discord](https://discord.com/invite/runonflux)

> ⚠️ Beware of scams—never share private keys or sensitive information in DMs. Always verify you’re using official support channels.
