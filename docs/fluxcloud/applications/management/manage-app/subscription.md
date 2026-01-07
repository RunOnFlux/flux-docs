# Subscription

The **Subscription** tab allows you to manage the lifecycle of your deployed applications on the Flux network. From here, you can renew, update, or cancel your application subscriptions, ensuring continuous operation and full control over your deployment status.

#### How To Access

> **Applications → Management → Manage App → Subscription**

Open the **Management** tab in the **Applications** menu, select an application from **My Active Apps**, click **Manage**, and open the **Subscription** tab.

***

### Overview of Tabs

* **Renewal:** Use this tab to **extend your application’s subscription period**. You can view the **current subscription end date** directly in the panel.\
  &#xNAN;_&#x45;xample:_ `Current subscription until: 17/07/2025, 05:26:58`
* **Update:** Select this tab to **modify your application or component configuration**.
* **Cancel:** The **Cancel Subscription** function allows you to **terminate your active application subscription** on the Flux network. This action is **irreversible** and should be used with caution.

<img src="/.gitbook/assets/Image 30.10.2025 at 11.28.jpeg" alt=""/>

***

### Renewal&#x20;

Here you can update your applications subscription period

1. **Generate Renewal Message**
   * Select your Renewal period, and Click the **Renewal** button to generate a JSON-formatted message.
2. **Sign the Message**
   * **Web3 Wallet** (Zelcore, MetaMask, SSP): Click the wallet icon.
   * **Email Login**: Click the **Flux SSO/Email** button
   * Once signed, the **Signature** field will auto-fill.
3. **Make the Payment**
   * Select a payment method to complete the process:
     * **Stripe** (Credit/Debit Card)
     * **PayPal**
     * **FLUX** _(5% discount applied)_
   * ⚠️ Payment links remain valid for **30 minutes**.

***

### Update

This section allows you to modify the configuration of your app or its components, as originally defined during initial deployment.

> ⚠️ You **cannot** add new components during an update. ✅ You **can** change the **owner** field to transfer app ownership.

Refer to the Register New App page for details on each configuration field. Once you’ve made the necessary changes, decide whether you also want to extend the subscription period using the **Renewal** toggle at **Period**.

**Renewal Toggle**

Toggle this **ON** to add more time to your app's existing subscription. Toggle it **OFF** to keep the current expiration date unchanged.

* **By default**, this toggle is **on**, meaning your new subscription duration will be added on top of the current expiry.
* Turning it **off** means your app will continue running until its original expiration date, without any added time.

**Example**

You deployed your app with a **30-day** subscription and choose to update it after **10 days**:

* With **subscription toggle off**, your app will continue for the remaining **20 days**.
* With **subscription toggle on** and **30 days** selected, the app will run for an additional **30 days**, totaling **50 days**.

<img src="/.gitbook/assets/Image 30.10.2025 at 11.51.jpeg" alt=""/>

***

### Cancel

When you cancel your subscription:

* The application is **immediately removed** from the Flux network.
* All associated **data will be lost** permanently.
* The app will no longer be recoverable unless you have made a **manual backup** using the **Backup/Restore** tool.

<img src="/.gitbook/assets/Image 30.10.2025 at 11.35.jpeg" alt=""/>

#### Finalize Cancelation

1. **Generate Cancel Message**
   * Click the **Cancel Subscription** button to generate a JSON-formatted message.
2. **Sign the Message**
   * **Web3 Wallet** (Zelcore, MetaMask, SSP): Click the wallet icon.
   * **Email Login**: Click the **Flux SSO/Email** button
   * Once signed, the **Signature** field will auto-fill.
3. **Submit Cancelation**
   * Click **Cancel Application** to confirm.
   * Your app cancellation will begin processing.

#### Alternatives to Cancelling

If you're unsure, consider the following options before canceling:

* **Backup & Migrate** your app to another FluxNode.
* **Reduce resource usage** (e.g., CPU, RAM, Storage) to lower costs.
* **Contact Flux Support** for optimization advice.

#### Frequently Asked Questions

**Can I pause instead of canceling**

No. Currently, there is no pause feature. You must cancel and redeploy if you wish to stop and restart usage.

***

**What happens to my billing?**

Once canceled, no further billing occurs. However, any remaining time on your subscription will be forfeited.

***

**Can I retrieve my data after canceling?**

No. Canceling the subscription results in permanent data loss. Always back up before canceling.
