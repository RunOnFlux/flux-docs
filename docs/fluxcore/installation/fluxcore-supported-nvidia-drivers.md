# FluxCore Supported NVIDIA Drivers

Fluxcore requires specific versions of the **NVIDIA GPU driver** to run correctly. Using a supported driver ensures stability, compatibility, and optimal performance when running FluxCore.

This page lists all **officially supported NVIDIA drivers**, separated by **Windows** and **Linux**, and grouped by version series (e.g., 550, 560, etc.).

### 🖥️ Windows Supported Drivers

These drivers are tested and validated on **Windows**. Use the versions below to ensure compatibility with Fluxcore.

| Driver Series | Supported Versions | GPU Detection | Mining | Recommended |
| ------------- | ---------------------------------------------------- | ------------- | ------ | ----------- |
| 538 | 538.78, 538.95 | ✅ | ✅ | |
| 545 | 545.29.06 | ✅ | ✅ | |
| 546 | 546.65 | ✅ | ✅ | |
| 551 | 551.23, 551.52, 551.61, 551.76, 551.78, 551.86 | ✅ | ✅ | |
| 552 | 552.12, 552.22, 552.44, 552.55, 552.74, 552.86 | ✅ | ✅ | |
| 553 | 553.09, 553.24, 553.35, 553.50, 553.62 | ✅ | ✅ | |
| 555 | 555.85, 555.99 | ✅ | ✅ | |
| 556 | 556.12 | ✅ | ✅ | |
| 560 | 560.70, 560.81, 560.94 | ✅ | ✅ | |
| 561 | 561.09 | ✅ | ✅ | |
| 565 | 565.90 | ✅ | ✅ | |
| 566 | 566.03, 566.14, 566.36 | ✅ | ✅ | |
| 572 | 572.16, 572.42, 572.47, 572.60, 572.70, 572.83 | ✅ | ✅ | ⭐ Yes |
| 575 | 575.51.02 | ✅ | ✅ | |
| 576 | 576.02, 576.28, 576.40, 576.52, 576.80, 576.88 | ✅ | ✅ | |
| 577 | 577.00 | ✅ | ✅ | |
| 580 | 580.88, 580.97 | ✅ | ✅ | |
| 581 | 581.08, 581.15, 581.29 | ✅ | ✅ | |

---

### 🐧 Linux Supported Drivers

These drivers are officially supported on **Linux distributions**. If you're running Fluxcore on Linux, please ensure your system is using one of the versions below.

| Driver Series | Supported Versions | GPU Detection | Mining | Recommended |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------ | ----------- |
| 470 | 470.182.03, 470.199.02, 470.223.02, 470.239.06, 470.256.02 | ✅ | ✅ | |
| 510 | 510.60.02, 510.108.03 | ✅ | ✅ | |
| 515 | 515.86.01, 515.105.01 | ✅ | ✅ | |
| 525 | 525.60.11, 525.78.01, 525.85.05, 525.89.02, 525.105.17, 525.116.03, 525.116.04, 525.125.06, 525.147.05 | ✅ | ✅ | |
| 530 | 530.30.02, 530.41.03 | ✅ | ✅ | |
| 535 | 535.43.02, 535.54.03, 535.86.05, 535.98, 535.104.05, 535.113.01, 535.129.03, 535.146.02, 535.154.05, 535.161.07, 535.161.08, 535.171.04, 535.179, 535.183.01, 535.183.06, 535.216.01, 535.216.03, 535.230.02, 535.247.01, 535.261.03, 535.274.02, 535.288.01 | ✅ | ✅ | |
| 538 | 538.78 | ✅ | ✅ | |
| 545 | 545.23.06, 545.29.02, 545.29.06 | ✅ | ✅ | |
| 550 | 550.40.07, 550.54.14, 550.54.15, 550.67, 550.76, 550.78, 550.90.07, 550.90.12, 550.100, 550.107.02, 550.120, 550.127.05, 550.127.08, 550.135, 550.142, 550.144.03, 550.163.01 | ✅ | ✅ | |
| 555 | 555.42.02, 555.52.04, 555.58, 555.58.02 | ✅ | ✅ | |
| 560 | 560.28.03, 560.31.02, 560.35.03, 560.35.05 | ✅ | ✅ | |
| 565 | 565.57.01, 565.77 | ✅ | ✅ | |
| 570 | 570.86.15, 570.86.16, 570.124.04, 570.124.06, 570.133.07, 570.133.20, 570.144, 570.148.08, 570.153.02, 570.158.01, 570.169, 570.172.08, 570.181, 570.190, 570.195.03, 570.207, 570.211.01 | ✅ | ✅ | ⭐ Yes |
| 575 | 575.51.02, 575.57.08, 575.64, 575.64.03, 575.64.05 | ✅ | ✅ | |
| 580 | 580.65.06, 580.76.05, 580.82.07, 580.82.09, 580.95.05, 580.105.08, 580.119.02, 580.126.09, 580.126.16, 580.126.18, 580.126.20, 580.142 | ✅ | ✅ | |
| 590 | 590.44.01, 590.48.01 | ✅ | ✅ | |
| 595 | 595.45.04, 595.58.03 | ✅ | ✅ | |

---

### ℹ️ Not Sure Which Version You Have?

To check your current NVIDIA driver version:

#### **Windows**

1. Open Command Prompt.
2. Type: `nvidia-smi`
3. Press Enter — the version will show under "Driver Version".

#### **Linux**

1. Open Terminal.
2. Type: `nvidia-smi`
3. Press Enter — you'll see your current driver version listed.

---

### 📥 Need Help Updating?

If your driver isn't supported:

* Visit the [official NVIDIA driver download page](https://www.nvidia.com/Download/index.aspx)
* Choose your GPU model and operating system
* Download and install a supported version listed above
