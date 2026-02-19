# Namespace: `admin` — System Administration

## `afs admin health`
- **Purpose:** Health check.
- **Usage example:**
  ```bash
  afs admin health
  ```

## `afs admin stats`
- **Purpose:** System-wide metrics.
- **Usage example:**
  ```bash
  afs admin stats
  ```

## `afs admin backup`
- **Purpose:** Create backup archive.
- **Usage example:**
  ```bash
  afs admin backup --output /backups/afs-$(date +%Y%m%d).tar.gz
  ```

## `afs admin restore`
- **Purpose:** Restore from backup.
- **Usage example:**
  ```bash
  afs admin restore --input /backups/afs-20260218.tar.gz
  ```

## `afs admin audit`
- **Purpose:** Query audit logs.
- **Usage example:**
  ```bash
  afs admin audit --after 2026-02-18T00:00:00Z --before 2026-02-19T00:00:00Z
  ```

## `afs admin rebuild`
- **Purpose:** Rebuild indices.
- **Usage example:**
  ```bash
  afs admin rebuild
  ```

## `afs admin vacuum`
- **Purpose:** Remove tombstones + rebuild indices.
- **Usage example:**
  ```bash
  afs admin vacuum
  ```

## `afs admin config show`
- **Purpose:** Display config (YAML or JSON).
- **Usage example:**
  ```bash
  afs admin config show --json
  ```

## `afs admin config set`
- **Purpose:** Set a single config key.
- **Usage example:**
  ```bash
  afs admin config set index_cache_mb=512
  ```

## `afs admin config export`
- **Purpose:** Export config to a file.
- **Usage example:**
  ```bash
  afs admin config export --output /tmp/afs-config.yaml
  ```

## `afs admin config import`
- **Purpose:** Import config from a file.
- **Usage example:**
  ```bash
  afs admin config import --input /tmp/afs-config.yaml
  ```

## `afs admin config validate`
- **Purpose:** Validate the discovered config.
- **Usage example:**
  ```bash
  afs admin config validate
  ```
