# Namespace: `attachment` — Attachments

## `afs attachment upload`
- **Purpose:** Upload an attachment (image/audio/structured/code).
- **When to use:** Store evidence alongside memories.
- **What it does:** Stores file and optionally attaches to a memory.
- **Usage example:**
  ```bash
  afs attachment upload --agent-id myagent --file report.pdf --type structured
  ```

## `afs attachment list`
- **Purpose:** List attachments for an agent.
- **Usage example:**
  ```bash
  afs attachment list --agent-id myagent --type image
  ```

## `afs attachment get`
- **Purpose:** Download attachment by ID.
- **When to use:** Retrieve stored files.
- **What it does:** Writes data to file or stdout.
- **Usage example:**
  ```bash
  afs attachment get --agent-id myagent --attachment-id att_123 --output out.bin
  ```

## `afs attachment delete`
- **Purpose:** Delete an attachment.
- **Usage example:**
  ```bash
  afs attachment delete --agent-id myagent --attachment-id att_123
  ```
