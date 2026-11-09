---
slug: /fluxedge-fluxcore-shutdown
---

# FluxEdge and FluxCore have been shut down

FluxEdge and FluxCore have been shut down following a security incident on 4 November 2026. The FluxEdge console and the FluxCore agent service are offline. FluxCloud, FluxOS, the FluxNodes and the Flux blockchain were not affected and keep running as usual.

***

### Renters

Rentals and deployments on FluxEdge have stopped. If you still have a balance on your FluxEdge account, open a ticket at [support.runonflux.io](https://support.runonflux.io) with the email you signed in with, and we will settle it with you directly.

### Providers

The FluxCore agent service has been shut down. Please remove the agent from your machines. Nothing will be pushed through the old updater. Unpaid earnings are settled through [support.runonflux.io](https://support.runonflux.io).

**The cleanest option is to reinstall the operating system.** If you'd rather not, run this on each Linux machine:

```bash
# stop and remove the FluxCore agent
sudo systemctl disable --now fluxcore.service
sudo rm -f /lib/systemd/system/fluxcore.service
sudo systemctl daemon-reload

# remove the fluxuser account it created, and its sudo rule
sudo pkill -u fluxuser
sudo userdel -r fluxuser
sudo rm -f /etc/sudoers.d/dont-prompt-fluxuser-for-sudo-password

# remove the Kubernetes agent (RKE2) and its networking
[ -x /usr/local/bin/rke2-uninstall.sh ] && sudo /usr/local/bin/rke2-uninstall.sh
sudo rm -rf /etc/rancher /var/lib/rancher /etc/kubernetes /var/lib/kubelet /opt/rke \
  /etc/cni /opt/cni /var/lib/cni /var/lib/calico /run/calico /run/flannel

# put the GPUs back to default clocks and power limit
sudo nvidia-smi -rgc; sudo nvidia-smi -rmc; sudo nvidia-smi -pl "$(nvidia-smi --query-gpu=power.default_limit --format=csv,noheader,nounits | head -1)"
```

Then check that nothing you don't recognise is left running or scheduled:

```bash
sudo crontab -l; crontab -l
systemctl list-units --type=service --state=running
nvidia-smi
```

On Windows, uninstall FluxCore from **Settings > Apps**, then remove the Linux distro it installed. In PowerShell as Administrator:

```powershell
wsl --list --verbose
wsl --unregister <the distro FluxCore created>
```

If you used the same machine for anything else, such as SSH keys, passwords or wallets, consider rotating them, since the agent had administrator access to it.

***

### Your Flux account

Sign-in for FluxCloud and Flux games (email, Google and Apple) has moved to a new, separate service, together with your apps, subscriptions and files. You don't need to do anything and you sign in as before.

Be careful with messages about FluxEdge or your account. We will never ask for your password, seed phrase or private keys.

Questions: [support.runonflux.io](https://support.runonflux.io) or [security@runonflux.com](mailto:security@runonflux.com).
