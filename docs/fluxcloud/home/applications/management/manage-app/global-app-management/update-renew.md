# Update/Renew

The **Update/Renew** tab allows you to update your deployed application, including compute resources, geolocation preferences, environment parameters, and subscription settings.

#### How To Access

> **Applications → Management → Manage App → Global App Management → Update/Renew**

Open the **Management** tab in the **Applications** menu, select an application from **My Active Apps**, click **Manage**, then go to the **Global App Management** section and open the **Update/Renew** tab.

***

### Overview

Use this tab to either:

* **Extend your subscription**, and/or
* **Update your application specifications**

At the top of the page, you’ll see two toggles:

* **Update Specifications**: Enable this if you want to change any application or component configuration.
* **Extend Subscription**: Enable this to add more time to your current subscription period.

<img src="/.gitbook/assets/Update &#x26; Renew.png" alt=""/>

***

### Update Specifications

This section allows you to modify the configuration of your app or its components, as originally defined during initial deployment.

> ⚠️ You **cannot** add new components during an update.\
> ✅ You **can** change the **owner** field to transfer app ownership.

Refer to the [Register New App](../../register-new-app/) page for details on each configuration field.

Once you’ve made the necessary changes, decide whether you also want to extend the subscription period using the toggle.

***

### Extend Subscription

Toggle this **ON** to add more time to your app's existing subscription.\
Toggle it **OFF** to keep the current expiration date unchanged.

* **By default**, this toggle is **on**, meaning your new subscription duration will be added on top of the current expiry.
* Turning it **off** means your app will continue running until its original expiration date, without any added time.

#### Example

You deployed your app with a **30-day** subscription and choose to update it after **10 days**:

* With **subscription toggle off**, your app will continue for the remaining **20 days**.
* With **subscription toggle on** and **30 days** selected, the app will run for an additional **30 days**, totaling **50 days**.

***

### Finalizing Your Update

Once your changes are configured and you're ready to proceed, follow these steps:\


1. **Agree to Terms of Service**
   * Toggle the checkbox to confirm you agree to the Terms of Service.
2. **Generate Update Message**
   * Click **Compute Update Message** to generate a JSON-formatted message.
   * You'll also see the **Total Price + VAT**.
3. **Sign the Message**
   * **Web3 Wallet** (Zelcore, MetaMask, SSP): Click the wallet icon.
   * **Email Login**: Click the **Flux SSO/Email** button
   * Once signed, the **Signature** field will auto-fill.
4. **Submit the Update**
   * Click **Update Application** to confirm your changes.
5. **(Optional) Test Installation**
   * Before paying, you can verify that your updated app can be installed and launched correctly:
   * Click **Test Installation**.
   * View live installation logs.
   * ✅ If successful, a green confirmation will appear in the top-right.
   * ❌ If the test fails, revise your configuration and re-run the test.
6. **Payment**
   * Select a payment method to complete the process:
     * **Stripe** (Credit/Debit Card)
     * **PayPal**
     * **FLUX** _(5% discount applied)_
   * ⚠️ Payment links remain valid for **30 minutes**.

Once payment is confirmed, your application update should take effect within **30 minutes**.
