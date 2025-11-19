# Send the Required Amount of Flux to Your Wallet

In order to create a FluxNode, you must send the **exact amount** of **native Flux** required for your chosen FluxNode tier (Cumulus, Nimbus, or Stratus) in **a single transaction**. This transaction acts as your node’s **collateral**.

> 🔗 A list of supported exchanges where you can purchase Flux is available [here](https://legacy.runonflux.io/flux).\
> 📊 For current collateral amounts by node tier, check below.

***

### Important Guidelines

* **Only Native Flux qualifies as FluxNode collateral**. If you hold Flux on another chain—such as **Flux-BSC** or **Flux-ETH**—you'll need to **convert it to Native Flux** before proceeding. (See [_Converting Parallel Assets_](#converting-parallel-assets-to-native-flux) below.)
* You must send the **precise required amount** for your FluxNode tier in **one transaction** to your receiving address.
* It is not the total balance that matters, but the amount sent in a **single mined transaction**.

Once this transaction is confirmed on-chain:

* Your FluxNode will become visible in the node configuration interface.
* It will require **100 confirmations** (≈ 3.5 hours) before it can be started.

#### Choosing a Wallet Section (Optional Advisory)

When depositing Flux for FluxNode collateral via Zelcore, we strongly recommend using one of the **six primary wallet sections** (e.g., _Payments_, _Income_, _Mining_, _Investments_, _Retirement_, or _Scholarship_) provided by your wallet software.

> ⚠️ **Avoid using any wallet section labeled "Full Node" unless you're an advanced user.** Improper use can result in lost funds.

***

### FluxNode Tier Collateral

FluxNodes are divided into performance-based tiers, each requiring a specific amount of FLUX collateral.

| **Node Tier** | **Collateral** |
| ------------- | -------------- |
| **Cumulus**   | 1,000 FLUX     |
| **Nimbus**    | 12,500 FLUX    |
| **Stratus**   | 40,000 FLUX    |

***

### Converting Parallel Assets to Native Flux

Many exchanges list **Parallel Assets** such as Flux‑BSC or Flux‑ETH instead of Flux Mainnet.\
If you hold Parallel Assets, they **must** be converted to **Native Flux** before they can be used as FluxNode collateral.

#### What Are Parallel Assets?

Parallel Assets are Flux tokens that exist on other blockchains. They are exchangeable 1:1 with native Flux but **are not valid for FluxNode collateral until converted**.

#### How to Convert to Native Flux

1. **Add the Parallel Asset to Your Wallet**
   * Use your wallet’s asset management interface to add the specific Parallel Asset (e.g., Flux-BSC).
   * Make sure it is **visible** (you may need to enable “Show Zero Balances”).
2. **Get Your Receiving Address**
   * Select the added Parallel Asset and click **Receive** to get the address where you will send the tokens from your exchange.
3. **Send Your Tokens from the Exchange**
   * Withdraw the Parallel Asset (e.g., Flux-BSC) to the matching address in your wallet.
4. **Ensure You Have Gas for the Swap**
   * Hold a small amount of the **native gas token** for that chain in your wallet to cover fees:
     * Flux-BSC ➜ Needs **BNB (BEP20)**
     * Flux-ETH ➜ Needs **ETH (ERC20)**
5. **Use the Fusion App to Swap for Native Flux**
   * Navigate to your wallet’s Fusion or Swap feature.
   * In the **Sell** field, select your Parallel Asset.
   * In the **Buy** field, choose **FLUX (Native)**.
   * Review the transaction details and any fees shown.
   * Click **Swap!** to initiate the process.

<img src="/.gitbook/assets/Screenshot 2025-07-30 110254.png" alt=""/>

#### Processing Time

* The swap process typically completes within **30 minutes**.
* During periods of high network activity, it may take **up to 24 hours**.
* If your swap does not complete within 24 hours, contact the official Flux Helpdesk.

> 🔍 After conversion, if you don’t see your native Flux, you may need to **manually add the FLUX asset** to the relevant wallet section using your wallet’s “+ Add Assets” feature.

***

### **Send the Flux to Your Wallet**

Once you have **Native Flux**, you’ll need to send the **exact collateral amount** for your chosen FluxNode tier (**Cumulus**, **Nimbus**, or **Stratus**) in a **single transaction** to your wallet’s receiving address.

⚠️ _It is the amount sent in one mined transaction that matters—not your total wallet balance._

#### **Option 1: Zelcore Wallet**

1. Open **Zelcore** and log in.
2. If Flux is not already visible in your Assets:
   * Click **+ Add Assets** → Select **Flux**.

<img src="/.gitbook/assets/Add Asset to Zelcore.png" alt=""/>

3. Select **Flux** from your Assets, then click **Receive** to view your Flux receiving address.

<img src="/.gitbook/assets/Zelcore Receive.png" alt=""/>

4. Send the **exact required amount** for your FluxNode tier in a **single transaction** to this address.
5. Once confirmed on-chain:
   * Your FluxNode will appear in the node configuration interface.
   * Navigate to **Apps → FluxNodes** to view it.
   * It will require **100 confirmations** (\~3.5 hours) before it can be started.

<img src="/.gitbook/assets/My FluxNodes.png" alt=""/>



***

#### **Option 2: SSP Wallet**

1. Log in to the **SSP Wallet** browser extension.
2. Switch to the **Flux** chain if not already selected:
   * Click the arrow next to your wallet name → **Switch Chain** → Select **Flux**.

<img src="/.gitbook/assets/SSP switch chain 1.png" alt="" width="209"/>

<img src="/.gitbook/assets/SSP switch chain 2.png" alt="" width="314"/>

3. Scan the QR code to sync your **SSP Wallet** (Flux chain) with your **SSP Key**.

<img src="/.gitbook/assets/SSP Key sync.png" alt="" width="314"/>

4. Click **Receive** to get your Flux receiving address.

<img src="/.gitbook/assets/SSP receive Flux.png" alt="" width="209"/>

5. Send the **exact required amount** for your FluxNode tier in a **single transaction** to this address.

