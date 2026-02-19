---
title: "Caveats & Testing"
---

# Caveats & Testing Guidance

## Known Gaps / Caveats
1. **README mentions** `afs graph mine` and `afs graph neighbors` — these are **not in the live CLI**.
   - Use `afs memory mine` and `afs graph neighborhood` instead.
2. **`docs/cli-reference.md` lists** `afs graph export` — not implemented in CLI.
3. **`afs graph prune`** is reporting-only (no deletion).
4. **`afs attachment get`** requires `--agent-id` or it fails.

## Quick Testing Steps
1. Initialize
   ```bash
   afs init
   ```
2. Create and query
   ```bash
   afs memory create --agent-id test --content "hello" --type observation
   afs query search --agent-id test --query "hello"
   ```
3. Graph
   ```bash
   afs memory mine --agent-id test
   afs graph neighborhood --agent-id test --memory-id <id>
   ```
4. Session
   ```bash
   afs session create --agent-id test
   afs session context --session-id <id>
   ```
