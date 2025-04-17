# 📂  Docker Volumes

### 💻 Scenario: Mount Local Mac Folder

You have a local file on your Mac:

```
~/Downloads/rakeshMacFolder/localFile.txt
```

Let’s mount this into 2 containers:

```bash
docker run -dit --name container1 -v ~/Downloads/rakeshMacFolder:/app busybox

docker run -dit --name container2 -v ~/Downloads/rakeshMacFolder:/app busybox
```

Inside `container1`:

```bash
docker exec -it container1 sh
cd /app
echo "created by container1" > fileCreatedByContainer1.txt
```

Inside `container2`:

```bash
docker exec -it container2 sh
cd /app
echo "created by container2" > fileCreatedByContainer2.txt
```

✅ All files are now visible in:

- Your Mac folder `~/Downloads/rakeshMacFolder`
- `container1` at `/app`
- `container2` at `/app`

> These files are shared — any of the 3 (Mac, container1, container2) can **read, write, delete** the files.

> 🔥 Even if the containers are deleted, the files remain in your Mac folder.

---

## 🧱 5. Named Volume (Custom Docker Volume)

Create a Docker-managed volume:

```bash
docker volume create myVolume
```

Run containers using this volume:

```bash
docker run -dit --name containerA -v myVolume:/app busybox

docker run -dit --name containerB -v myVolume:/app busybox
```

Add data inside one container:

```bash
docker exec -it containerA sh
cd /app
echo "file from containerA" > file.txt
```

✅ Now go to `containerB`:

```bash
docker exec -it containerB sh
cd /app
cat file.txt
```

> You’ll see `file from containerA`

✅ Both containers **share the same volume**. ✅ Data is **persistent** and stays even after container deletion (unless volume is removed).

---

## 📌 Summary:

| Type         | Location                | Shared? | Persistent? | Example Use                    |
| ------------ | ----------------------- | ------- | ----------- | ------------------------------ |
| Bind Mount   | Local (Mac/Host) folder | Yes     | Yes         | Share local files to container |
| Named Volume | Docker-managed location | Yes     | Yes         | Databases, logs, uploads       |

> ✅ Volumes are ideal for persistent and shared data storage between containers.

