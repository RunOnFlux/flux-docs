# Cost Calculator

We offer a simple and user-friendly calculator at [https://cloud.runonflux.io/cost\_calculator](https://cloud.runonflux.io/cost_calculator) to help you estimate how much your application will cost based on your chosen resources and subscription plan.

***

### Overview

Use the sliders and dropdown selectors to specify your compute needs, and the calculator will instantly show the estimated cost.

<img src="/.gitbook/assets/Image 29.10.2025 at 10.49.jpeg" alt=""/>

***

### Current Spec Pricing (per instance)



* **CPU**: $0.03 per 0.1 core
* **RAM**: $0.01 per 100 MB
* **HDD**: $0.004 per 1 GB
* **Minimum Price**: $0.01 – Minimum fee required for registration or updates
* **Enterprise Port**: $0.40 – Additional fee per enterprise port
* **Scoped Deployment**: $0.80 – For targeting specific enterprise nodes or using private images
* **Static IP**: $0.40  – Additional cost for deploying to nodes with a static IP

💡 **Tip:** Paying in **FLUX** gives you a **5% discount** on the total cost.

***

### Frequently Asked Questions

#### What is an instance

An instance is a FluxNode—similar to a Docker container—that runs a copy of your application. FluxCloud requires a minimum of **three instances** for every deployment to ensure redundancy and uptime. If one FluxNode fails, another will automatically take over, ensuring seamless service continuity.

***

#### Where can I buy Flux

You can purchase FLUX on several exchanges listed here: [https://runonflux.io/flux#exchanges](https://runonflux.io/flux#exchanges)

***

#### What does "synchronize data across components" means?

This feature helps reduce deployment costs. By default, FluxCloud runs your application independently on all three instances. When you enable **"synchronize data across components"**, only **one** server runs the application actively. If it goes offline, another instance takes over using the **synchronized data state**, ensuring high availability with lower resource usage.
