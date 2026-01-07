# Custom Domain Setup

You can point a custom domain of your choice—such as `yourdapp.com`—to your WordPress app using a **Flux Domain Name (FDN)**, e.g., `yourdapp.app.runonflux.io`.\
We recommend using **Cloudflare** as your DNS provider for simplicity and reliability. You’ll only need to add a **CNAME** record.

***

### Cloudflare Configuration

In this setup, Cloudflare acts as a secure middleman between your domain registrar (e.g., GoDaddy) and the FluxCloud, forwarding traffic to your WordPress application.

<img src="/.gitbook/assets/Custom Domain 1 (1).png" alt=""/>

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
     * **Target**: `yourdapp.app.runonflux.io` (this is your FluxCloud generated domain, you find it by clicking the **App Details** button on your WordPress application under **My Apps > Active Apps**.)
     * **Proxy Status**: Enabled (orange cloud checked)

<img src="/.gitbook/assets/Custom Domain 2 (1).png" alt=""/>

***

### Example Scenario

In this example:

* Your root domain (`yourdomain.com`) still points to a traditional hosting provider like GoDaddy.
* Your subdomain (`yourapp.yourdomain.com`) points to your Flux-hosted WordPress dApp.

<img src="/.gitbook/assets/Custom Domain 3.png" alt=""/>
