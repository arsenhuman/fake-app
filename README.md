# Redis Key-Value Monitor with Docker Compose

[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)](https://www.python.org/)

A **real-time Redis key-value monitoring system** built with **Docker Compose** and **Flask**.  
Perfect for **debugging**, **demoing**, or **learning** how data flows from a web UI to Redis.

---

## Features

| Feature | Description |
|--------|-------------|
| **Web UI** | Simple form to insert key-value pairs |
| **Redis Backend** | Stores data with persistence |
| **Live Debug Container** | Real-time stream of **every key inserted** |
| **Zero Polling** | Uses Redis **Pub/Sub Keyspace Events** |
| **Alpine Linux Safe** | Works perfectly in lightweight containers |
| **Production-Ready Config** | `overcommit_memory`, `appendonly`, etc. |

---

## Project Structure

```
.
├── app.py                # Flask web UI
├── Dockerfile            # App container
├── docker-compose.yml    # 3 services: app, redis, debug
└── README.md             # This file
```

---

## Quick Start

```bash
# 1. Clone & enter
git clone https://github.com/yourname/redis-key-monitor.git
cd redis-key-monitor

# 2. Start all services
docker-compose up -d

# 3. Open the UI
open http://localhost:5000
```

---

## Live Demo

1. **Open** → `http://localhost:5000`
2. **Enter**:
   - Key: `user:123`
   - Value: `Alice`
3. **Watch** the magic:

```bash
docker logs -f debug
```

**Output:**
```
[2025-11-05 14:22:10] INSERTED → KEY: "user:123"  VALUE: "Alice"
[2025-11-05 14:22:15] INSERTED → KEY: "theme"     VALUE: "dark"
```

---

## Services Overview

| Service | Purpose | Tech |
|--------|--------|------|
| `app` | Web UI to set keys | Python + Flask |
| `redis` | Key-value store | Redis 7 (Alpine) |
| `debug` | Live monitor | `redis-cli` + `psubscribe` |

---

## How It Works

1. **User** submits key-value via web form
2. **Flask app** → `redis.set(key, value)`
3. **Redis** emits a `set` event (enabled via `notify-keyspace-events KEs`)
4. **Debug container** subscribes to `__keyspace@0__:set:*`
5. **Script** parses events → fetches value → logs to stdout
6. `docker logs -f debug` → **real-time stream**

---

## Configuration

### Redis
```yaml
--notify-keyspace-events KEs   # Enable set events
--appendonly yes               # Persistence
vm.overcommit_memory=1         # Avoid fork warnings
```

### Debug Container
- Waits for Redis (`PING → PONG`)
- Subscribes to `set` events
- Prints: `[timestamp] INSERTED → KEY: "x" VALUE: "y"`

---

## Manual Testing

```bash
# List all keys
docker exec -it redis redis-cli KEYS "*"

# Set a key manually
docker exec -it redis redis-cli SET debug:test "hello"

# Watch it appear instantly
docker logs -f debug
```

---

## Troubleshooting

| Issue | Fix |
|------|-----|
| No logs in `debug` | Ensure `notify-keyspace-events KEs` is set |
| `grep: unrecognized option: P` | Fixed — uses `awk` only |
| Redis warning `overcommit_memory` | Fixed via `sysctls` |
| Container not starting | Run `docker-compose up --build` |

---

## Tech Stack

- **Backend**: Python 3.12 + Flask
- **Database**: Redis 7 (Alpine)
- **Orchestration**: Docker Compose v3.8
- **Realtime**: Redis Pub/Sub Keyspace Events

---

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing`)
5. Open a Pull Request

---

## License

[MIT License](LICENSE) – Free to use, modify, and distribute.

---

## Author

**Your Name**  
[GitHub](https://github.com/arsenhuman)

---

> **"See every key the moment it's born."**  
> — *Redis Debug Motto*

---

⭐ **Star this repo if you found it useful!**  
🐞 Found a bug? [Open an issue](https://github.com/yourname/redis-key-monitor/issues)

---

**Made with ❤️ and Docker**
