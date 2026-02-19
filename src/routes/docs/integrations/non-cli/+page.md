---
title: "Non-CLI APIs"
---

# Non-CLI Functionality

## HTTP API (`afs-server`)
- **Purpose:** Programmatic access to AFS via REST.
- **Entry point:** `afs-server` (FastAPI, default `127.0.0.1:8080`).
- **What it includes:**
  - Memory CRUD, search, export
  - Graph queries (neighborhood, shortest/weighted path, edges)
  - Sessions CRUD + context
  - Attachments upload/list/download/delete
  - Swarm join/share
  - Admin metrics + audit
  - Scheduler start/stop/status

## Python API
- **MemoryEngine** (core): CRUD, search, graph, attachments, scheduler
- **SessionManager**: create/get/list/add_turn/context/archive/delete
- **SwarmManager**: register_agent/share/ingest
- **AttachmentStore**: store/retrieve/delete/list

## Configuration Surface
- **MemorySystemSettings** defines all config fields.
- CLI operations: `afs admin config show|set|export|import|validate`.

## Audit Taxonomy
- Import `afs.audit_taxonomy` to use canonical operation names for audit queries.
