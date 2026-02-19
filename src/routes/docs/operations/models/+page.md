---
title: "Models"
---

# Namespace: `models` — Local Model Management

## `afs models install`
- **Purpose:** Install pinned llama-server + HF models into `.afs/`.
- **Usage example:**
  ```bash
  afs models install
  ```

## `afs models serve`
- **Purpose:** Start local model servers (embeddings/rerank/expand/all).
- **Usage example:**
  ```bash
  afs models serve --role embeddings --daemon
  afs models serve --role all
  ```

## `afs models status`
- **Purpose:** Check model server status.
- **Usage example:**
  ```bash
  afs models status --json
  ```

## `afs models stop`
- **Purpose:** Stop model servers.
- **Usage example:**
  ```bash
  afs models stop --role embeddings
  afs models stop --all
  ```
