# 🌐 Docker Learning Log – file4.md

## 🚪 Understanding Port Mapping

\`\`\`bash
docker run -it -p 3000:3000 my-app
\`\`\`

- Maps **Macbook port 3000** ➝ **Container port 3000**
- Format: \`hostPort:containerPort\`

---

\`\`\`bash
docker run -it -p 3000:3000 -p 3001:9000 -p 8080:3458 my-app
\`\`\`

- 🎯 Multiple port mappings  
- E.g., Macbook port 3001 → Container port 9000

---

## 🏷️ Role of \`EXPOSE\` in Dockerfile

\`\`\`dockerfile
EXPOSE 8000
\`\`\`

- ❗ Declares container's **private port** for documentation
- Helps developers understand which ports should be mapped
- Does **not** actually publish the port — only informs

---

\`\`\`bash
docker inspect my-app
\`\`\`

- Shows JSON with:
\`\`\`json
"ExposedPorts": {
  "8000/tcp": {}
}
\`\`\`
- ✅ Developer now sees which ports are ready for exposure without checking the code.

---

## 🧠 Advanced Usage

\`\`\`bash
docker run -it -p 3000:8000 my-app
\`\`\`

- Binds Macbook port 3000 to container’s EXPOSED 8000

\`\`\`bash
docker run -it -P my-app
\`\`\`

- \`-P\` = Auto map **all EXPOSED ports** to **random host ports**
- ⚠️ Host port will be randomly chosen (not necessarily same as container port)

---

## 📡 Exposing Multiple Ports

\`\`\`dockerfile
EXPOSE 8000 9000 5000
# or
EXPOSE 8000-8009
\`\`\`

- First exposes specific ports
- Second exposes a **range** of ports

---

## 🧹 Auto-Cleanup & Detached Mode

\`\`\`bash
docker run -it -P --rm my-app
\`\`\`

- \`--rm\`: Destroys container after it exits
- 🗑️ Good for short-lived containers

---

\`\`\`bash
docker run -itd -P --rm my-app
\`\`\`

- \`-d\`: Run container in background
- 🖥️ Terminal remains free
- Server runs without holding terminal open

\`\`\`bash
docker ps
docker stop <container_id>
\`\`\`

- List running containers
- Stop them safely

> 🚨 \`--rm\` destroys container after stopping → data is lost  
> ✅ \`docker stop\` = graceful shutdown  
