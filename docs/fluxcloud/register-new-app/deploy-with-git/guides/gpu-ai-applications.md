---
sidebar_position: 11
title: GPU/AI Applications
description: Complete guide for deploying GPU-accelerated AI/ML applications via Deploy with Git
---

# GPU/AI Applications

This guide covers everything you need to know about deploying GPU-accelerated AI/ML applications via Deploy with Git, from simple inference APIs to complex machine learning pipelines using PyTorch, TensorFlow, or JAX.

## Overview

Deploy with Git supports optional GPU/CUDA installation at runtime when `GPU_ENABLED=true`. This keeps the base Docker image small while enabling deployment of AI/ML workloads on GPU-equipped hosts.

**Key Features:**
- CUDA toolkit installed at runtime
- Pre-installation of PyTorch, TensorFlow, or JAX with CUDA support
- Automatic GPU detection and health checks
- Memory management configuration
- Works with all Python-based AI frameworks

## Host Requirements

The container can install CUDA toolkit at runtime, but the **host machine** must have:

| Requirement | Description |
|-------------|-------------|
| NVIDIA GPU | Any CUDA-capable NVIDIA GPU |
| NVIDIA Drivers | Driver version compatible with CUDA version |
| nvidia-container-toolkit | For Docker GPU passthrough |

### Verify Host Setup

```bash
# Check if NVIDIA driver is installed
nvidia-smi

# Check Docker can access GPU
docker run --rm --gpus all nvidia/cuda:12.4.1-base-ubuntu22.04 nvidia-smi
```

## Basic GPU Deployment

### Simple PyTorch API

```bash
docker run -d --gpus all \
  --name pytorch-api \
  -e GIT_REPO_URL=https://github.com/your-username/pytorch-api \
  -e APP_PORT=8000 \
  -e GPU_ENABLED=true \
  -e AI_FRAMEWORK=pytorch \
  -p 8000:8000 \
  runonflux/orbit:latest
```

### What Happens Automatically

1. **Detection**: Finds `requirements.txt` and identifies as Python project
2. **Runtime Installation**: Installs Python via Miniconda
3. **GPU Installation**:
   - Checks for NVIDIA GPU availability
   - Installs CUDA toolkit (version from `CUDA_VERSION`)
   - Installs cuDNN for deep learning
   - Installs AI framework (PyTorch/TensorFlow/JAX) with CUDA support
4. **Dependencies**: Runs `pip install -r requirements.txt`
5. **Start**: Executes your application

## Environment Variables

### GPU Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `GPU_ENABLED` | Enable GPU/CUDA support | `false` |
| `CUDA_VERSION` | CUDA toolkit version to install | `12.4` |
| `AI_FRAMEWORK` | Framework to install: `pytorch`, `tensorflow`, `jax`, `none` | `none` |
| `CUDA_VISIBLE_DEVICES` | Limit which GPUs are visible | All GPUs |
| `GPU_MEMORY_FRACTION` | Limit GPU memory usage (0.0-1.0) | - |

### Framework-Specific Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PYTORCH_VERSION` | PyTorch version | `2.4` |
| `TENSORFLOW_VERSION` | TensorFlow version | `2.16` |
| `JAX_VERSION` | JAX version | `0.4` |

## Framework-Specific Guides

### PyTorch Applications

PyTorch is the most popular framework for research and production ML:

```bash
docker run -d --gpus all \
  --name pytorch-app \
  -e GIT_REPO_URL=https://github.com/your-username/pytorch-app \
  -e APP_PORT=8000 \
  -e GPU_ENABLED=true \
  -e CUDA_VERSION=12.4 \
  -e AI_FRAMEWORK=pytorch \
  -e PYTORCH_VERSION=2.4 \
  -p 8000:8000 \
  runonflux/orbit:latest
```

**Example FastAPI with PyTorch:**

```python
# main.py
from fastapi import FastAPI
import torch

app = FastAPI()

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "cuda_available": torch.cuda.is_available(),
        "gpu_name": torch.cuda.get_device_name(0) if torch.cuda.is_available() else None
    }

@app.post("/predict")
async def predict(data: dict):
    # Your model inference here
    device = "cuda" if torch.cuda.is_available() else "cpu"
    # model.to(device)
    # result = model(input_tensor.to(device))
    return {"prediction": "result"}
```

**Example requirements.txt:**

```
fastapi>=0.100.0
uvicorn>=0.23.0
torch>=2.0
torchvision
transformers
accelerate
```

### TensorFlow Applications

TensorFlow with automatic GPU detection:

```bash
docker run -d --gpus all \
  --name tensorflow-app \
  -e GIT_REPO_URL=https://github.com/your-username/tensorflow-app \
  -e APP_PORT=8000 \
  -e GPU_ENABLED=true \
  -e AI_FRAMEWORK=tensorflow \
  -e TENSORFLOW_VERSION=2.16 \
  -p 8000:8000 \
  runonflux/orbit:latest
```

**Example Flask with TensorFlow:**

```python
# app.py
from flask import Flask, jsonify
import tensorflow as tf

app = Flask(__name__)

@app.route("/health")
def health():
    gpus = tf.config.list_physical_devices('GPU')
    return jsonify({
        "status": "healthy",
        "gpus_available": len(gpus),
        "tensorflow_version": tf.__version__
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
```

### JAX Applications

JAX for high-performance numerical computing:

```bash
docker run -d --gpus all \
  --name jax-app \
  -e GIT_REPO_URL=https://github.com/your-username/jax-app \
  -e APP_PORT=8000 \
  -e GPU_ENABLED=true \
  -e AI_FRAMEWORK=jax \
  -e JAX_VERSION=0.4 \
  -p 8000:8000 \
  runonflux/orbit:latest
```

## Common AI Application Types

### LLM Inference Server

Deploy large language models with vLLM or text-generation-inference:

```bash
docker run -d --gpus all \
  --name llm-server \
  -e GIT_REPO_URL=https://github.com/your-username/llm-server \
  -e APP_PORT=8000 \
  -e GPU_ENABLED=true \
  -e AI_FRAMEWORK=pytorch \
  -e CUDA_VERSION=12.4 \
  -p 8000:8000 \
  runonflux/orbit:latest
```

**Example requirements.txt for LLM:**

```
torch>=2.0
transformers>=4.35.0
accelerate
bitsandbytes
vllm
```

### Image Generation API

Deploy Stable Diffusion or similar models:

```bash
docker run -d --gpus all \
  --name image-gen \
  -e GIT_REPO_URL=https://github.com/your-username/image-gen-api \
  -e APP_PORT=8000 \
  -e GPU_ENABLED=true \
  -e AI_FRAMEWORK=pytorch \
  -p 8000:8000 \
  runonflux/orbit:latest
```

**Example requirements.txt:**

```
torch>=2.0
diffusers
transformers
accelerate
safetensors
```

### Computer Vision Service

Deploy object detection or image classification:

```bash
docker run -d --gpus all \
  --name cv-service \
  -e GIT_REPO_URL=https://github.com/your-username/cv-service \
  -e APP_PORT=8000 \
  -e GPU_ENABLED=true \
  -e AI_FRAMEWORK=pytorch \
  -p 8000:8000 \
  runonflux/orbit:latest
```

## GPU Memory Management

### Limit GPU Memory Usage

```bash
# Use only first GPU
-e CUDA_VISIBLE_DEVICES=0

# Use specific GPUs
-e CUDA_VISIBLE_DEVICES=0,2

# Limit memory fraction (in your Python code)
# PyTorch: torch.cuda.set_per_process_memory_fraction(0.8)
# TensorFlow: Configure memory growth
```

### TensorFlow Memory Growth

Add to your application:

```python
import tensorflow as tf

# Allow memory growth
gpus = tf.config.list_physical_devices('GPU')
for gpu in gpus:
    tf.config.experimental.set_memory_growth(gpu, True)

# Or limit memory
tf.config.set_logical_device_configuration(
    gpus[0],
    [tf.config.LogicalDeviceConfiguration(memory_limit=4096)]
)
```

### PyTorch Memory Management

```python
import torch
import os

# Limit to specific GPU
os.environ["CUDA_VISIBLE_DEVICES"] = "0"

# Clear cache periodically
torch.cuda.empty_cache()

# Monitor memory
print(f"Allocated: {torch.cuda.memory_allocated(0) / 1024**3:.2f} GB")
print(f"Cached: {torch.cuda.memory_reserved(0) / 1024**3:.2f} GB")
```

## Installation Times

First deployment with GPU support takes longer due to runtime installation:

| Component | Install Time | Size |
|-----------|--------------|------|
| CUDA Toolkit | 3-5 min | ~3-5 GB |
| cuDNN | 30-60 sec | ~800 MB |
| PyTorch (CUDA) | 2-5 min | ~2-3 GB |
| TensorFlow (CUDA) | 2-5 min | ~1-2 GB |
| JAX (CUDA) | 2-3 min | ~1-2 GB |

**Total first deployment: 8-15 minutes**

Subsequent deployments skip installation if components are already present, taking only 1-2 minutes.

## CI/CD Integration

### Automatic Deployment with Webhooks

```bash
docker run -d --gpus all \
  --name ai-app \
  -e GIT_REPO_URL=https://github.com/your-username/ai-app \
  -e APP_PORT=8000 \
  -e GPU_ENABLED=true \
  -e AI_FRAMEWORK=pytorch \
  -e WEBHOOK_SECRET=my-secret-phrase \
  -p 8000:8000 \
  -p 9001:9001 \
  runonflux/orbit:latest
```

### GitHub Actions for AI Projects

```yaml
name: Deploy AI App
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Deployment
        run: |
          curl -X POST ${{ secrets.FLUX_WEBHOOK_URL }}/webhook \
            -H "Content-Type: application/json" \
            -H "X-Hub-Signature-256: sha256=${{ secrets.WEBHOOK_SECRET }}" \
            -d '{"ref": "refs/heads/main"}'
```

## Troubleshooting

### GPU Not Detected

**Problem:** `torch.cuda.is_available()` returns `False`

**Solutions:**

1. Verify host has NVIDIA drivers:
   ```bash
   nvidia-smi
   ```

2. Verify Docker can access GPU:
   ```bash
   docker run --rm --gpus all nvidia/cuda:12.4.1-base-ubuntu22.04 nvidia-smi
   ```

3. Ensure `--gpus all` flag is used when running container

4. Check CUDA version compatibility between driver and toolkit

### Out of Memory (OOM) Errors

**Problem:** `CUDA out of memory`

**Solutions:**

1. Limit batch size in your application
2. Use gradient checkpointing for training
3. Enable memory growth (TensorFlow) or clear cache (PyTorch)
4. Use model quantization (8-bit, 4-bit)
5. Limit GPU memory fraction

### CUDA Version Mismatch

**Problem:** `CUDA driver version is insufficient`

**Solution:** Match CUDA toolkit version to your driver:

| NVIDIA Driver | Max CUDA Version |
|---------------|------------------|
| 525.x | CUDA 12.0 |
| 530.x | CUDA 12.1 |
| 535.x | CUDA 12.2 |
| 545.x | CUDA 12.3 |
| 550.x | CUDA 12.4 |

```bash
# Use compatible CUDA version
-e CUDA_VERSION=12.1
```

### Slow First Deployment

**Problem:** First deployment takes 10+ minutes

**Expected behavior:** First deployment installs CUDA, cuDNN, and AI framework. This is normal.

**Tips:**
- Use a volume to persist `/opt/flux-tools` for faster subsequent deployments
- Consider using a pre-built GPU base image for production

## Best Practices

### 1. Health Endpoints

Always implement a health endpoint that verifies GPU access:

```python
@app.get("/health")
def health():
    return {
        "status": "healthy",
        "gpu_available": torch.cuda.is_available(),
        "gpu_count": torch.cuda.device_count(),
        "gpu_name": torch.cuda.get_device_name(0) if torch.cuda.is_available() else None
    }
```

### 2. Model Loading

Load models once at startup, not per-request:

```python
# Good: Load once
model = None

@app.on_event("startup")
async def load_model():
    global model
    model = AutoModel.from_pretrained("model-name")
    model.to("cuda")

# Bad: Load every request
@app.post("/predict")
async def predict():
    model = AutoModel.from_pretrained("model-name")  # Don't do this!
```

### 3. Quantization for Efficiency

Use quantization to reduce memory usage:

```python
from transformers import AutoModelForCausalLM

model = AutoModelForCausalLM.from_pretrained(
    "model-name",
    load_in_8bit=True,  # 8-bit quantization
    device_map="auto"
)
```

### 4. Error Handling

Handle GPU errors gracefully:

```python
try:
    result = model.generate(...)
except torch.cuda.OutOfMemoryError:
    torch.cuda.empty_cache()
    return {"error": "GPU memory exhausted, try smaller input"}
```

## Example Repository Structure

```
my-ai-api/
├── requirements.txt        # Python dependencies
├── main.py                 # FastAPI/Flask application
├── models/
│   ├── __init__.py
│   └── inference.py        # Model inference logic
├── config.py               # Configuration
├── pre-deploy.sh           # Optional: Download models
└── post-deploy.sh          # Optional: Warm up cache
```

### Example pre-deploy.sh

```bash
#!/bin/bash
# Download model weights before starting
python -c "from transformers import AutoModel; AutoModel.from_pretrained('bert-base-uncased')"
echo "Model downloaded successfully"
```

## Flux Cloud Deployment

On Flux Cloud, select a GPU-enabled node:

```yaml
App Name: my-ai-app
Docker Image: runonflux/orbit:latest
Port: 8000
Port 2: 9001

# Select GPU instance type
Instance: GPU-enabled

Environment Variables:
  GIT_REPO_URL: https://github.com/your/ai-app
  APP_PORT: 8000
  GPU_ENABLED: "true"
  AI_FRAMEWORK: pytorch
  PYTORCH_VERSION: "2.4"
```

## Next Steps

- [Environment Variables Reference](../configuration/environment-reference)
- [Deployment Hooks Guide](../hooks/deployment-hooks)
- [CI/CD Setup](../ci-cd/github-webhooks)
- [Troubleshooting](../troubleshooting/common-issues)
