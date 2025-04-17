# 🐳 Docker Learning Log – file3.md

## ✅ Switched to Slim & Fast Base Image

\`\`\`dockerfile
FROM node:23.11.0-alpine3.21
\`\`\`

- 🧊 Alpine = small & fast  
- ✅ Node.js pre-installed  
- ⛔ No need for curl or apt installs  

---

## 📦 Docker Cache Optimization

\`\`\`dockerfile
COPY package*.json .
RUN npm install
COPY index.js .
\`\`\`

- 🔄 Copy static files first → better caching  
- 🕒 Faster rebuilds when only code changes  

---

## 🚀 Final Command to Start App

\`\`\`dockerfile
CMD ["npm", "start"]
\`\`\`

- 🧠 CMD runs when container starts  
- ⛳ Runs server automatically  
