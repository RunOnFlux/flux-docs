# Proxmox Fractus Node Setup

_Credit to community members Mowat and Gus Diaz. For questions, visit #nodes-support on Discord._

Follow these steps to add a dedicated **Thunder** (storage) pool and virtual disk on Proxmox for your FluxNode (Fractus) setup.

***

### 1. SSH into Proxmox Host

```
ssh root@<proxmox_ip>
```

### 2. Identify and Initialize Disks

* In the Proxmox GUI, note disk device names (e.g., `/dev/sdf`, `/dev/sdg`, `/dev/sdh`).
*   Initialize partition 1 on each disk:

    ```
    sgdisk -N 1 /dev/sdf
    sgdisk -N 1 /dev/sdg
    sgdisk -N 1 /dev/sdh
    ```

### 3. Create LVM Volume Group & Thin Pool

```
vgcreate tdata1 /dev/sdf1 /dev/sdg1 /dev/sdh1
lvcreate -n lvtdata1 -T -l 100%FREE tdata1
```

### 4. Add LVM-Thin Storage in Proxmox GUI

1. Datacenter → Storage → Add → **LVM-Thin**
2. **ID:** `thunderdata1`
3. **Volume group:** `tdata1`
4. **Thin pool:** `lvtdata1`

### 5. Attach Virtual Disk to Node

* Select your FluxNode VM/CT → **Hardware → Add → Hard Disk**
* **Bus:** SCSI, **Storage:** `thunderdata1`, **Size:** 10000 GiB

### 6. Prepare Disk Inside the Node

```
sudo sgdisk -N 1 /dev/sdb
sudo mkfs.ext4 -E nodiscard /dev/sdb1
sudo mkdir /thunder
sudo blkid /dev/sdb1    # copy the UUID
sudo nano /etc/fstab    # add:
# UUID=<your-uuid> /thunder ext4 rw,user,auto 0 0
sudo mount /thunder
df -h | tail -n1
```

### 7. Enable Thunder Mode & Benchmark

1. Run `multitoolbox` → **Option 11: Reconfigure Flux OS** → enable **Thunder Mode**
2.  Reboot and re‑benchmark:

    ```
    sudo reboot now
    ```

### 8. Scale Across Nodes

Repeat **steps 5–7** on other nodes until your thin pool is fully utilized.
