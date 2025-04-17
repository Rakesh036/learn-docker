## 🌐 Real-World Example: Microservices with Custom Compose Network

Let’s say you’re building a full-stack e-commerce system. Your app has:

- **Frontend**: `nextjs`
- **Backend API**: `node-api`
- **Database**: `drizzle-db`
- **Email Service**: `email-service`
- **Redis Queue**: `redis`
- **Ingest Processor**: `ingest-worker`
- **Payment Service**: `payment-gateway`

And they talk via a custom network called `ecom-network`.

---

### 🧱 Compose File

```yaml
name: ecom-platform

networks:
  ecom-network:

services:
  nextjs:
    build: ./frontend
    ports:
      - '3000:3000'
    networks:
      - ecom-network

  node-api:
    build: ./backend
    depends_on:
      - drizzle-db
      - redis
    networks:
      - ecom-network

  drizzle-db:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: shop
    networks:
      - ecom-network
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "user"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    networks:
      - ecom-network

  email-service:
    build: ./email
    networks:
      - ecom-network

  ingest-worker:
    build: ./ingest
    networks:
      - ecom-network

  payment-gateway:
    build: ./payment
    networks:
      - ecom-network
```

---

### ✅ Inter-Service Communication
- `node-api` → talks to `redis`, `drizzle-db`, `email-service`
- `ingest-worker` → listens to Redis
- `payment-gateway` → called by frontend through `node-api`
- All use **service name** to connect internally

```js
// backend config
const redis = createClient({ url: 'redis://redis:6379' });
const db = new Client({ host: 'drizzle-db', ... });
```

> 💡 No need to expose ports unless a service talks to the host (like frontend)

---

### 🔧 Why this Works
- All services are on the same **user-defined network** (`ecom-network`)
- Docker's internal DNS allows services to resolve each other by **name**
- Services are isolated from the host unless `ports` is specified

---

### 📶 Host ↔ Container Communication
To access a containerized app (like a frontend or API) from your browser or Postman:

```bash
http://localhost:<host_port>
```

Example:
```bash
http://localhost:3000  # If exposed like: '3000:3000'
```

> ✅ Works because of `ports:` mapping in `docker-compose.yml`

---

### 🩺 Health Checks
`depends_on` only manages **start order**, not **readiness**. Use healthchecks for reliability.

```yaml
healthcheck:
  test: ["CMD", "pg_isready", "-U", "user"]
  interval: 10s
  timeout: 5s
  retries: 5
```

Then use condition:

```yaml
depends_on:
  drizzle-db:
    condition: service_healthy
```

> 🎯 Prevents errors from connecting too early.

---

### 🌐 Container ↔ External Internet
Most containers can access the internet by default:

```bash
docker exec -it <container> sh
wget google.com
```

> ❌ If fails, check Docker network or firewall config.

---

