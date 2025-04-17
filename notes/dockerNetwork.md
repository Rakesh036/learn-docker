# 🧠 Docker Networking Notes

## 🧱 1. Docker Default Network: `bridge`
When Docker is installed, it creates a default bridge network.

### 🧵 How to Check:
```bash
docker network ls
```

### 📦 Let's create 3 containers in the default bridge:
```bash
docker run -dit --name captain busybox

docker run -dit --name natasa busybox

docker run -dit --name buggy busybox
```

Now try to **ping** each other inside one container:
```bash
docker exec -it captain sh
ping natasa  # ❌ Will not work
```

### ❌ Why ping doesn't work?
- **Default bridge** network doesn't do container name resolution.
- Containers need IPs to reach each other.
- You’d have to manually inspect IPs:

```bash
docker inspect natasa | grep IPAddress
```
Then ping using IP:
```sh
ping 172.17.0.X
```

> 👉 Not ideal for microservices or app-to-app communication.

---

## 🔧 2. Custom Docker Network: `userCustomNetwork`

```bash
docker network create userCustomNetwork
```

### 📦 Now create 3 containers in this network:
```bash
docker run -dit --name "iron man" --network userCustomNetwork busybox

docker run -dit --name "pepper pots" --network userCustomNetwork busybox

docker run -dit --name "morgan stark" --network userCustomNetwork busybox
```

### ✅ Ping works by container name:
```bash
docker exec -it "iron man" sh
ping "pepper pots"
```

- **Works!** Docker provides an embedded DNS server for user-defined networks.
- Containers can resolve each other by **name**.
- No need to hardcode IPs.

### 🔍 Check IPs (Optional):
```bash
docker inspect "iron man" | grep IPAddress
```

---

## 🎯 Why We Use Docker Networking:
- To connect containers internally (e.g., frontend → backend → DB)
- To isolate containers from public network
- For easier scaling and microservices communication

---

## 🔁 3. Connecting App Container to Redis/PostgreSQL/MongoDB

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

## 📝 Summary:
| Network Type      | DNS Resolution | Name-based Ping | Use Case                    |
|-------------------|----------------|------------------|-----------------------------|
| Default `bridge`  | ❌ No           | ❌ No             | Simple testing, isolated    |
| Custom Network    | ✅ Yes          | ✅ Yes            | Real apps, microservices    |

> ✅ Use custom networks to make your containers talk smoothly using names.

