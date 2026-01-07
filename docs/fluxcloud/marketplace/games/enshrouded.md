# Enshrouded

This guide walks you through the process of **deploying, managing, and connecting to a Enshrouded Game Server** using FluxCloud. Whether you’re setting up a new server or maintaining an existing one, this page provides step-by-step instructions and key details for a seamless experience.

***

### How To Install an Enshrouded Server

#### **Steps**

1. **Access FluxCloud**

* Visit [cloud.runonflux.com](https://cloud.runonflux.com) and sign in or create an account.


2. **Find the Enshrouded Server**

* Navigate to the **Marketplace → Games** tab, then locate the **Enshrouded** tile and click **View Details**.

<img src="/.gitbook/assets/Screenshot 2025-11-03 133435.jpg" alt=""/>

3. **Select Server Configuration**

* Choose your preferred configuration, and click **Install Now** to continue.

<img src="/.gitbook/assets/Screenshot 2025-11-03 143112.jpg" alt=""/>

4. **Choose Subscription**

* Select your desired **subscription duration**.
* Agree to the **Terms of Use** and **Privacy Policy**, and click the blue **Continue** arrow at the bottom.

<img src="/.gitbook/assets/Screenshot 2025-11-03 143200.jpg" alt="" width="459"/>

5. **Deployment Location**

* Configure whether you want your Palworld server to deploy in specific geographic regions:
  * **Global (Recommended):** No geographic restrictions for best availability.
  * **Custom:** Restrict by continent or country.
* Click the blue **Continue** arrow to proceed.

<img src="/.gitbook/assets/Screenshot 2025-11-03 143243.jpg" alt="" width="467"/>

6. **Email Notifications**

* Optionally enter your email address to receive notifications about your game server, including:
  * When your application finishes launching.
  * When the primary server changes.
  * When your app expiration date is approaching.

7. **Launching the Application**

* Your application must be **signed and registered** on the Flux network.
  1. Click **Sign and Register**.
  2. Sign the message using the pop-up.
     * If you logged in via Google or Email, this step is completed automatically.

<img src="/.gitbook/assets/Screenshot 2025-11-03 143318.jpg" alt="" width="464"/>

8. **Complete Payment**&#x20;

* Choose your payment method:
  * **Fiat:** Stripe or PayPal
  * **Crypto:** FLUX coin (5% discount)
* Payment is monitored automatically. Once confirmed, your application will be deployed, and a blue **Manage** button will appear—directing you to your application’s management panel.

> ⚠️ **Important: FLUX Payments**
>
> FLUX payments are **only accepted via the FLUX Mainnet,** not through any of our EVM tokens.
>
> We **ALSO** strongly recommend **not sending FLUX payments from exchanges**, as:
>
> * Transactions or withdrawals may not complete within the required 30-minute window.
> * Many exchanges do not support adding a **MEMO**, which is required for proper payment processing.

<img src="/.gitbook/assets/Screenshot 2025-11-03 143422.jpg" alt="" width="460"/>

***

### Finding our your IP of the Game Server

Flux runs on a decentralized network, meaning your application is deployed across **three instances**.\
For game servers, a **Primary/Standby** setup is used — your game runs on the primary instance, while others are on standby for redundancy.

To find your server’s **primary IP address**:

1. Visit [**cloud.runonflux.com**](https://cloud.runonflux.com) and log in.
2. Go to **Applications → Management**.
3. Click the **Settings icon** on your Enshrouded Server.
4. Open the **Instances** tab.
   * The **Primary IP address** is shown here.
   * You can also view geolocation details for all instances.

<img src="/.gitbook/assets/Screenshot 2025-11-03 142233.jpg" alt=""/>

***

### Best Practices for Connecting to Your Enshrouded Server

For a smoother and more reliable gaming experience, it’s recommended to **add your Enshrouded server to your Steam favorites**. This ensures quick and hassle-free access every time you play.

#### Adding Your Server to Steam Favorites

1. Launch **Steam** and open the main menu.
2. Select **View → Game Servers**.

<img src="/.gitbook/assets/image (13).png" alt="" width="280"/>

3. In the _Game Servers_ window, go to the **Favorites** tab.
4. Click the **“+”** icon in the bottom-right corner.
5. Enter your server’s **IP address** and **port number** (`15637`).
6. Click **Add This Address to Favorites**.

<img src="/.gitbook/assets/image (14).png" alt="" width="563"/>

<img src="/.gitbook/assets/image (15).png" alt=""/>

#### Accessing Your Enshrouded Server

1. Launch the **Enshrouded** game client.
2. From the main menu, open the **Server Browser**.
3. Your Enshrouded server will appear under the **Favorites** tab.
4. Select your server and connect to start your session seamlessly.

***

### Frequently Asked Questions

#### How can I update my game server to the latest version?

Your Palworld server automatically checks for updates during startup and at regular intervals. If you’d like to update immediately, you can do so from your application’s management panel.

Simply open the **Applications → Management** section on FluxCloud, select your Palworld server, and go to the **Control** tab. From there, choose **Global** and click **Restart Application**. This will redeploy your server with the latest available version.

***

#### What happens if the primary server goes down?

If your current primary server becomes unavailable or experiences downtime, one of the standby instances automatically takes over as the new primary after a short delay. All your game data remains intact, so you can continue right where you left off once the switch is complete. You can check which instance is currently the primary from your application’s management panel under the _Instances_ tab.

***

#### Can I change the game server settings and/or setup a password to connect to my game server?

Yes, you can customize your Enshrouded server settings just like on a standard VPS. Please note that **basic terminal and Linux proficiency** is required for this process.

Go to **Applications → Management**, select the **settings icon** to manage your **Palworld** server, and open the **Secure Shell** tab. Select the **Enshrouded** component, choose **bin/bash**, and click **Connect**.

<img src="/.gitbook/assets/Screenshot 2025-11-03 145446.jpg" alt=""/>

Once connected:

* Update your package lists with:

```bash
apt update
```

* Install the Nano text editor (only required once after purchase):

```bash
apt install nano
```

* Navigate to the game server directory:

```bash
cd /opt/enshrouded/server/
```

* Open the configuration file for editing:

```bash
nano enshrouded_server.json
```

You can now modify settings such as the **server name**, **player limit**, or **password** directly in this file.\
When finished, save your changes with **Ctrl + S**, then exit Nano using **Ctrl + X**.

After editing, open the **Control** tab in your management panel, select **Global**, and click **Restart Application** to apply your new settings.

> ⚠️ **Important:** Be cautious when modifying configuration values — incorrect changes may prevent your game server from functioning properly.

***

#### What if a new version of the game server is released and my server doesn't update automatically?

Your server normally updates itself automatically during startup or periodic checks. However, if it hasn’t updated yet, a simple restart from the management panel will trigger the update and ensure you’re running the latest version.
