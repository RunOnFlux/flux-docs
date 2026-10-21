# Custom Domain Setup

You can point a custom domain of your choice—such as `yourdapp.com`—to your deployed application using a **Flux Domain Name (FDN)**, e.g., `yourdapp.app.runonflux.io`.\
We recommend using **Cloudflare** as your DNS provider for simplicity and reliability. You’ll add a **CNAME** record that points the domain at your app, and a **TXT** record that proves the domain is yours.

***

### Cloudflare Configuration

In this setup, Cloudflare acts as a secure middleman between your domain registrar (e.g., GoDaddy) and the FluxCloud, forwarding traffic to your WordPress application.

<img src="/.gitbook/assets/Custom Domain 1.png" alt=""/>

***

### **Step-by-Step Instructions:**

1. **Create a Cloudflare Account**
   * If you haven’t already, sign up for a free account at [cloudflare.com](https://cloudflare.com).\

2. **Add Your Domain to Cloudflare**
   * Click “Add a Site” and enter your domain (e.g., `yourdapp.com`).
   * Cloudflare will attempt to automatically import your existing DNS settings.\
     Double-check to ensure all records are copied correctly.\

3. **Update Your Nameservers**
   *   Cloudflare will provide new nameservers, such as:

       ```
       CopyEditnick.ns.cloudflare.com
       tina.ns.cloudflare.com
       ```
   * Replace the current nameservers at your domain registrar (e.g., GoDaddy) with the ones provided by Cloudflare.
   * DNS changes typically propagate within a few minutes to a few hours.\

4. **Add a CNAME Record for Your Flux App**
   * Navigate to the **DNS** tab in Cloudflare.
   * Click **Add Record**, then fill in the fields as follows:
     * **Type**: `CNAME`
     * **Name**:
       * Use `yourapp` for a subdomain (e.g., `yourapp.yourdomain.com`)
       * Use `@` to point the root domain (e.g., `yourdomain.com`)
     * **Target**: `yourdapp.app.runonflux.io` (this is your FluxCloud generated domain, you find it by clicking the **App Details** button on your application under **My Apps > Active Apps**.)
     * **Proxy Status**: Enabled (orange cloud checked)

<img src="/.gitbook/assets/Custom Domain 2.png" alt=""/>

5. **Add a TXT Record to Prove the Domain Is Yours**
   * FluxCloud routes a custom domain to the app that the domain's own DNS points at. That matters if another app ever lists your domain: the app your DNS names keeps it, however early the other app claimed it.
   * With the proxy enabled (orange cloud), your CNAME is hidden from public DNS, so add a TXT record that names your app:
     * **Type**: `TXT`
     * **Name**: `_flux` for the root domain, or `_flux.yourapp` for a subdomain (Cloudflare adds your domain, so this becomes `_flux.yourapp.yourdomain.com`)
     * **Content**: `flux-app=yourdapp`, where `yourdapp` is your app's name: the first part of your FluxCloud generated domain (`yourdapp` in `yourdapp.app.runonflux.io`)
   * The record also covers the `www.` and `test.` versions of the domain.
   * If you turned the proxy off (grey cloud), the CNAME already shows which app the domain belongs to and the TXT record is optional.
   * To check it, run `dig TXT _flux.yourapp.yourdomain.com +short`. The answer should be `"flux-app=yourdapp"`.

***

### Example Scenario

In this example:

* Your root domain (`yourdomain.com`) still points to a traditional hosting provider like GoDaddy.
* Your subdomain (`yourapp.yourdomain.com`) points to your Flux-hosted application.

<img src="/.gitbook/assets/Custom Domain 3.png" alt=""/>

