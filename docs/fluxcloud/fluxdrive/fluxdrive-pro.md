# FluxDrive Pro

FluxDrive Pro is Flux’s **API-based IPFS** solution — a decentralized, scalable, and resilient storage system at competitive prices. It is designed to make Web3 development simpler by enabling **direct programmatic interaction with FluxDrive** via API.

***

### Overview

FluxDrive Pro offers:

* **API-based IPFS storage** for dApps and Web3 projects
* Competitive decentralized storage pricing
* Scalable and resilient infrastructure
* A familiar API format for developers

> **Note:** FluxDrive Pro is currently available only to selected partners during its closed testing phase.

<img src="/.gitbook/assets/image (73).png" alt=""/>

***

### Getting Started

#### 1. Access Request

* FluxDrive Pro is currently **invite-only**.
* Fill out the [FluxDrive Pro Access Form](https://runonflux.bitrix24.com/pub/form/33_fluxdrive_pro_request_/2xp87g/?view=preview\&preview=inline) to request early access.

#### 2. Install Zelcore Wallet

* Required to access **FluxID** for authentication
* **FluxID** is needed to generate your **API key**
* Download Zelcore [here](https://zelcore.io/)

#### 3. Setup Process

* After submitting the form, the Flux team will contact you
* You will receive your **API\_KEY\_SECRET** mapped to your **FluxID**
* You can then begin using the API

***

### API Base URL

```
https://api.fluxdrive.runonflux.io
```

All endpoints are accessed via **POST** requests with basic authentication:

```
-u "<ZELID>:<API_KEY_SECRET>"
```

***

### Supported API Endpoints

#### 1. `/api/v0/status`

**Description:** Get current storage usage.

```bash
curl "https://api.fluxdrive.runonflux.io/api/v0/status" \
  -X POST \
  -u "<ZELID>:<API_KEY_SECRET>"
```

**Example Response:**

```json
{
  "status": "success",
  "result": { "storage_used": 2412017 }
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

**Description:** Upload one or more files.

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

**Description:** Remove a file.

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
* API access is protected via **ZELID** and **API\_KEY\_SECRET**.
* During the closed beta, performance and endpoint behavior may change.
