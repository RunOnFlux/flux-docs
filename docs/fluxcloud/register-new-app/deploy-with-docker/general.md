# General

The **General** tab is where you provide general information and configuration settings for your application.

***

### Overview

Use this tab to define your app’s name, description, contact information, instance count, and other deployment preferences.

<img src="/.gitbook/assets/Image 29.10.2025 at 10.11.jpeg" alt=""/>

### Application Name

* Must be at least **3 characters** long
* Allowed characters: **A–Z, a–z, 0–9**
* **No spaces or special characters** allowed

### Description

* Must be at least **10 characters** long

### Contact (Optional)

* Enter a **public contact email** to receive important notifications (e.g., app expiration)

### Instances

Define how many **servers (instances)** will run your application

* **Minimum:** 3 (for redundancy and load balancing)
* **Maximum:** 100

### Period

Choose your app’s **subscription duration**

* from **1 week to 1 year**
* This is a **prepaid**, **non-refundable** period

### Static IP (Optional)

Toggle this on if your app requires a **static IP address**

* **Additional cost:** $0.40 USD

### Enterprise (Optional)

Enable this option if your app requires:

* **Private container images**
* **Secrets management**
* **Targeted deployment to specific nodes**
* **Additional cost:** $0.80 + $0.40 USD per **enterprise port**
* ⚠️ **Geolocation targeting is not supported** when Enterprise Application is enabled
