# 🔁 Connecting App Container to Redis/PostgreSQL/MongoDB

### Imagine you have this setup:

- `app` → Node.js app
- `redis` → Redis cache
- `postgres` → PostgreSQL
- `mongo` → MongoDB

All running on same **custom network** `my-app-network`:

```bash
docker network create my-app-network
```

Run containers:

```bash
docker run -dit --name app --network my-app-network node

docker run -dit --name redis --network my-app-network redis

docker run -dit --name postgres --network my-app-network postgres

docker run -dit --name mongo --network my-app-network mongo
```

### 🔗 Inside your Node.js app:

```js
const redisClient = redis.createClient({ host: 'redis', port: 6379 });
const pgClient = new Client({ host: 'postgres', port: 5432 });
const mongoClient = new MongoClient('mongodb://mongo:27017');
```

- **Host names = container names**
- No need to use IP addresses or configure DNS manually

---

## 📦 Docker Compose Notes

### 🐞 Problem:
You're running a Node.js server (`index.js`) that tries to connect to PostgreSQL and Redis using:

```js
host: 'localhost'
```

But the actual services (`redis`, `postgres-db`) are running in Docker containers. Your Node.js app is running on the **host machine**, not inside Docker.

### 🧠 Why this fails:
- `localhost` = your host machine
- Redis & PostgreSQL containers ≠ host machine
- So Node.js app can’t reach Redis/PG via `localhost`

### ✅ Solution:
Use Docker Compose to run all containers **together** with **correct networking**.

### 🛠 Docker Compose Setup:

**File: `docker-compose.yml`**

```yaml
name: e-commerce

services:
  postgres-db:
    image: postgres:15
    container_name: postgres-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: mydb
    ports:
      - '5431:5432'

  redis:
    image: redis:7-alpine
    container_name: redis
    ports:
      - '6379:6379'
```

Now update your **index.js**:

```js
// PostgreSQL connection
host: 'postgres-db' // use the container name

// Redis connection
url: 'redis://redis:6379' // again, use container name
```

### 📡 Why ports are exposed?

Since your **Node.js app runs outside Docker**, it needs to reach the DB via `localhost:5431` and `localhost:6379`:

```yaml
ports:
  - '5431:5432'
  - '6379:6379'
```

This maps:
- PostgreSQL container port `5432` → Host port `5431`
- Redis container port `6379` → Host port `6379`

> 🔁 So your app talks to Redis/PG via `localhost`, and Docker redirects it.

---

## 🧩 Using `depends_on` in Compose

```yaml
services:
  app:
    build: .
    depends_on:
      - postgres-db
      - redis
```

- Ensures **PostgreSQL and Redis start before the app**.
- Avoids errors where app runs before DB is ready.

⚠️ But note: `depends_on` doesn’t **wait until ready**, just starts order-wise. Use health checks for full control.

---

## ▶️ Compose Commands

```bash
docker-compose up         # start all containers

docker-compose up -d      # start in detached mode (background)

docker-compose down       # stop and remove containers

docker-compose ps         # check status
```

---

## 🐳 Run Everything Inside Docker

Instead of running Node.js on host machine:

```yaml
services:
  app:
    build: .
    container_name: my-app
    ports:
      - '3000:3000'
    depends_on:
      - postgres-db
      - redis
```

Now `app` runs inside Docker, and you can use container names directly:

```js
host: 'postgres-db'
url: 'redis://redis:6379'
```

> ✅ No need to expose `5431`, `6379`, etc. to host anymore.

---

## 🔍 Explain Compose Attributes

```yaml
name: e-commerce
services:
  postgres-db:
    image: postgres:15     # Which image to use (from Docker Hub)
    container_name: postgres-db   # Custom name
    environment:
      POSTGRES_USER: postgres     # DB user
      POSTGRES_PASSWORD: postgres # DB password
      POSTGRES_DB: mydb           # DB name
    ports:
      - '5431:5432'         # map host:container
```

### 🔎 Where values come from:
- `image`: Check available tags on [hub.docker.com](https://hub.docker.com)
- `environment`: As per DB official docs or `.env` files
- `ports`: Only needed if container must talk to host

---

## 📛 Importance of Consistent Naming

- Use meaningful names: `redis`, `postgres-db`, `app`
- These act as DNS names on internal network
- Avoids confusion when app connects to services

> ✅ Stick to consistent, lowercase, hyphenated names (e.g., `my-service`)

---

Let me know if you want to extend this with Docker volumes or environment file handling!

