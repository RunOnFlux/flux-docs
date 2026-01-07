# General

The General tab is where you provide general information and configuration settings for your shared database application.

***

### Overview

Use this section to define your shared database app’s name, description, contact information, deployment locations, instance count, and other preferences.

### Field Summary

| Field                       | Requirements & Notes                                                                                                                                                              |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Version**                 | Read‑only. Hardcoded spec version.                                                                                                                                                |
| **Application Name**        | <p>• ≥3 chars; alphanumeric only (no spaces/special chars)</p><p>• Used in ENV as <code>DB_APPNAME</code>, <code>CLIENT_APPNAME</code>, and in <code>DB_COMPONENT_NAME</code></p> |
| **Application Description** | ≥3 chars; free text.                                                                                                                                                              |
| **Owner**                   | Read‑only. Your associated FluxID.                                                                                                                                                |
| **Contacts**                | Optional. JSON‑array of public emails. API‑visible:`["ops@domain.com"]`                                                                                                           |
| **Allowed Locations**       | Optional. Select by continent, country, or region.                                                                                                                                |
| **Forbidden Locations**     | Optional. Exclude by continent, country, or region.                                                                                                                               |
| **Instances**               | Integer 3–100. Min 3 for redundancy.                                                                                                                                              |
| **Period**                  | 1 week–1 year (prepaid, non‑refundable).                                                                                                                                          |
| **Static IP**               | Not needed for DB                                                                                                                                                                 |
| **Enterprise App**          | Mot needed for DB                                                                                                                                                                 |

### Field Descriptions

Below is a detailed explanation of each field to help guide your configuration decisions.

### Version

* Read‑only. Hardcoded spec version.

### Application Name

* ≥3 chars; alphanumeric only (no spaces/special chars)
* **Usage**: Referenced in ENV variables at the next **Component** section such as:

```
DB_APPNAME, CLIENT_APPNAME, DB_COMPONENT_NAME
```

* **Example:** mysql01

> **Tip**: Keep the name short and consistent to simplify referencing in components.

### Application Description

* ≥3 chars; free text.

### Owner

* Read‑only. Your associated FluxID.

### Contacts (Optional)

* Provide a **JSON array** of email addresses, for example `["test@gmail.com"]` .

> ⚠️ Contacts are **publicly accessible** via the FluxCloud API

**Upload to Flux Storage**

* Use the blue upload button next to the field to upload your contact information to Flux Storage
* This replaces parameters with a storage link (only the link is visible via API, and the content is not accessible)

### Allowed Locations (Optional)

Specify where your shared database app can be deployed. You can select one or more by clicking the plus icon:

* Continents
* Countries
* Regions

### Forbidden Locations (Optional)

Specify where your app can be deployed. You can select one or more by clicking the plus icon:

* Continents
* Countries
* Regions

### Instances

* Integer 3–100. Minimum  3.
* More instances = more **replicas/slaves** in your database cluster

> **Note:** Adding more instances may slightly reduce performance, as the master node must broadcast updates to all connected slave nodes.

### Period

Choose your app’s **subscription duration**

* 1 week–1 year (prepaid, non‑refundable).

### Static IP

* Not required for shared database applications.

### Enterprise Application

* Not applicable for shared database deployments.

***

Now that you've completed the Details tab, continue to the **Components** section to configure your containers and runtime environment.
