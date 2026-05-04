# API Reference

The FluxDrive API gives you programmatic access to your storage — the same files you see in the [web UI](https://cloud.runonflux.com/flux-drive), accessible via HTTP for dApps, scripts, and Web3 integrations.

***

### Overview

The FluxDrive API offers:

* **API-based IPFS storage** for dApps and Web3 projects
* The same decentralized storage and pricing as the web UI
* A familiar request/response format for developers
* Authentication via your **FluxID** and a generated **API key**

The API is available on every paid plan (**STARTER**, **STANDARD**, **ELITE**, and **PRO**) — there is no separate signup. If you have an active subscription, you can generate API keys and use the endpoints below.

<img src="/.gitbook/assets/image (73).png" alt=""/>

***

### Getting Started

#### 1. Subscribe to FluxDrive

Sign in at [cloud.runonflux.com/flux-drive](https://cloud.runonflux.com/flux-drive) with your **FluxID** and choose a plan. Any paid plan grants API access.

#### 2. Install Zelcore Wallet

* Required to access your **FluxID** for authentication
* **FluxID** is your account identity for both the web UI and the API
* Download Zelcore at [zelcore.io](https://zelcore.io/)

#### 3. Generate an API Key

* In the FluxDrive web UI, generate an **API\_KEY\_SECRET** mapped to your FluxID
* Custom (PRO) plans can be arranged by contacting the Flux team — fill out the [PRO Plan Request Form](https://runonflux.bitrix24.com/pub/form/33_fluxdrive_pro_request_/2xp87g/?view=preview\&preview=inline) for a custom storage allocation

***

### API Base URL

```
https://api.fluxdrive.runonflux.io
```

All endpoints are accessed via **POST** requests with HTTP Basic authentication:

```
-u "<ZELID>:<API_KEY_SECRET>"
```

***

### Limits

| Limit | Value | Notes |
| ----- | ----- | ----- |
| Maximum file size | 5 GB per file | Larger uploads return HTTP 413 |
| PUT rate limit | 150 requests / second | Per ZELID + IP |
| Read rate limit | 1500 requests / second | Per ZELID + IP, applies to `/cat`, `/get`, `/ls`, `/status`, `/thumb` |
| Storage capacity | Plan-dependent | See plans on the [overview page](README.md) |

Exceeding a rate limit returns HTTP 429 with `Retry-After` headers.

***

### Authentication & Errors

Every request must include valid Basic auth. Failed requests return JSON with an `error` field.

**Common error responses:**

```json
// 401 — invalid or missing API key
{ "error": "Invalid credentials" }

// 402 — subscription not active (e.g., expired or unpaid)
{ "error": "Subscription not active" }

// 413 — file exceeds 5 GB or storage capacity exceeded
{ "error": "File size exceeds 5120Mb" }
{ "error": "Storage capacity exceeded" }

// 404 — hash not found in your account
{ "error": "File not found" }

// 429 — rate limited
{ "error": "Too many requests" }
```

***

### Supported API Endpoints

#### 1. `/api/v0/status`

**Description:** Get current storage usage and remaining capacity.

```bash
curl "https://api.fluxdrive.runonflux.io/api/v0/status" \
  -X POST \
  -u "<ZELID>:<API_KEY_SECRET>"
```

**Example Response:**

```json
{
  "status": "success",
  "result": {
    "active": true,
    "capacity_gb": 10,
    "storage_used": 2412017,
    "remaining": 10733328063
  }
}
```

***

#### 2. `/api/v0/ls`

**Description:** List all files in your FluxDrive storage.

```bash
curl "https://api.fluxdrive.runonflux.io/api/v0/ls" \
  -X POST \
  -u "<ZELID>:<API_KEY_SECRET>"
```

**Example Response (shortened):**

```json
{
  "status": "success",
  "files": [
    {
      "hash": "QmdMfrUsh8tvAj5MuWEFxYR7VjpmXvihxSZZZWoJYE3LMR",
      "name": "21045.png",
      "size": 37161,
      "mimetype": "image/png",
      "timestamp": 1699457573592
    }
  ]
}
```

***

#### 3. `/api/v0/put`

**Description:** Upload one or more files. Subject to the 5 GB per-file limit and your plan's storage capacity.

```bash
curl "https://api.fluxdrive.runonflux.io/api/v0/put" \
  -X POST \
  -u "<ZELID>:<API_KEY_SECRET>" \
  -H "Content-Type: multipart/form-data" \
  -F file=@"<file1>" \
  -F file=@"<file2>"
```

**Example Response (single file):**

```json
{
  "status": "success",
  "files": [
    {
      "name": "21045.png",
      "hash": "QmdMfrUsh8tvAj5MuWEFxYR7VjpmXvihxSZZZWoJYE3LMR",
      "mimetype": "image/png",
      "size": 37161
    }
  ]
}
```

***

#### 4. `/api/v0/putfolder`

**Description:** Upload multiple files as a folder.

```bash
curl "https://api.fluxdrive.runonflux.io/api/v0/putfolder" \
  -X POST \
  -u "<ZELID>:<API_KEY_SECRET>" \
  -H "Content-Type: multipart/form-data" \
  -F file=@"image.png" \
  -F file=@"metadata.json"
```

**Example Response (shortened):**

```json
{
  "status": "success",
  "folder": {
    "hash": "QmNaS1f8RDbQ9jz5FGkZWvzG5VA6jp4JJBEwQ2DLzhWN8V",
    "size": "1965233"
  }
}
```

***

#### 5. `/api/v0/cat`

**Description:** Output the contents of a file from IPFS.

```bash
curl "https://api.fluxdrive.runonflux.io/api/v0/cat?arg=<HASH>" \
  -X POST \
  -u "<ZELID>:<API_KEY_SECRET>"
```

**Arguments:**

* `arg` _(string, required)_ — IPFS file hash

***

#### 6. `/api/v0/get`

**Description:** Download a file from IPFS.

```bash
curl "https://api.fluxdrive.runonflux.io/api/v0/get?arg=<HASH>" \
  -X POST \
  -u "<ZELID>:<API_KEY_SECRET>"
```

***

#### 7. `/api/v0/rm`

**Description:** Remove a file from your FluxDrive account. The hash is unpinned from your subscription; if no other accounts pin it, the cluster will eventually garbage-collect the underlying blocks.

```bash
curl "https://api.fluxdrive.runonflux.io/api/v0/rm?arg=<HASH>" \
  -X POST \
  -u "<ZELID>:<API_KEY_SECRET>"
```

***

#### 8. `/api/v0/thumb`

**Description:** Retrieve a thumbnail for a file.

```bash
curl "https://api.fluxdrive.runonflux.io/api/v0/thumb?arg=<HASH>" \
  -X POST \
  -u "<ZELID>:<API_KEY_SECRET>"
```

***

### Notes

* All commands must be executed from a terminal (e.g., **VSCode integrated terminal**, **Ubuntu**, or similar).
* API access is protected via **ZELID** and **API\_KEY\_SECRET** — keep your key secret. If a key is leaked, rotate it immediately by generating a new one in the web UI.
