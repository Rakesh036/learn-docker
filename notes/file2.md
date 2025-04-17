# 📘 Docker Learning Log – file2.md

## ✅ What I Fixed from Previous Dockerfile

### 🔄 Old Dockerfile (Incomplete)
\`\`\`dockerfile
FROM ubuntu

RUN curl -sL https://deb.nodesource.com/setup_23.x -o /tmp/nodesource_setup.sh
RUN sudo bash /tmp/nodesource_setup.sh
RUN sudo apt install nodejs
\`\`\`

### ✅ New Fixed Dockerfile
\`\`\`dockerfile
FROM ubuntu

RUN apt-get update
RUN apt install -y curl

RUN curl -sL https://deb.nodesource.com/setup_23.x -o /tmp/nodesource_setup.sh
RUN bash /tmp/nodesource_setup.sh
RUN apt install -y nodejs

COPY index.js /home/app/index.js
COPY package-lock.json /home/app/package-lock.json
COPY package.json /home/app/package.json

WORKDIR /home/app/
RUN npm install
\`\`\`

### 🔍 What I Changed (and Why):

| 🔧 Change | ✅ Reason |
|----------|----------|
| ✅ Added \`apt-get update\` | Updates package list before installation (necessary) |
| ✅ Installed \`curl\` manually | \`curl\` is not pre-installed in Ubuntu base image |
| ❌ Removed \`sudo\` | Not needed in Dockerfile (container runs as root by default) |
| ✅ Added \`-y\` in \`apt install\` | Automatically says "yes" to prompts during install |

---

## 🖥️ Terminal Commands and Output

### 📦 Check all Docker images
\`\`\`bash
docker images
\`\`\`

#### ✅ Output:
\`\`\`
REPOSITORY    TAG       IMAGE ID       CREATED              SIZE
my-app        latest    aa9ada6ef514   About a minute ago   571MB
ubuntu        latest    1e622c5f073b   8 days ago           139MB
hello-world   latest    424f1f86cdf5   2 months ago         17kB
\`\`\`

🧠 This shows that \`my-app\` image was created successfully from the Dockerfile.

---

### ▶️ Run a plain Ubuntu container
\`\`\`bash
docker run -it ubuntu
\`\`\`

#### ✅ Output inside container:
\`\`\`bash
# ls
bin  boot  dev  etc  home ...
# pwd
/
\`\`\`

🧠 Shows basic Linux structure. Nothing is inside \`/home/app\` because it's a clean Ubuntu.

---

### ▶️ Run our custom image \`my-app\`
\`\`\`bash
docker run -it my-app
\`\`\`

#### ✅ Output inside container:
\`\`\`bash
# ls
index.js  node_modules  package-lock.json  package.json
# pwd
/home/app
\`\`\`

🧠 Source code successfully copied to \`/home/app\`  
🧠 \`node_modules/\` is present, meaning \`npm install\` worked.

---

### ▶️ Run the Node.js server
\`\`\`bash
npm run dev
\`\`\`

#### ✅ Output:
\`\`\`
> learn-docker@1.0.0 dev
> node index.js

Server is running on port 3000
\`\`\`

🧠 App is running inside the container!

---

## ❌ Problem: Can't access from browser

When I try to open \`http://localhost:3000\` in my browser, it says:

\`\`\`
This site can’t be reached
localhost refused to connect
\`\`\`

---

## 🔧 Why?

Because we haven't **exposed the container's port 3000** to our local machine yet.  
We will fix this in the **next step using port mapping (\`-p\`)**.

---

📁 Next file → \`file3.md\`: Will contain port mapping and running the app in detached mode.
