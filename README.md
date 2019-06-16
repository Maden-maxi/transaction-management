# Project creating

## Init backend

```bash
# -u $UID:$EUID - needs for Linux users for execute commands as user on host machine
docker run -u $UID:$EUID -v=`pwd`/backend:/home/node/app -w /home/node/app -it node:10 bash

# Init npm project and feel prompts
npm init

# Install dependencies
npm i -S koa mongoose nodemon

# Create app.js file
touch app.js

# Start server
docker run -u $UID:$EUID -v=`pwd`/backend:/home/node/app -w /home/node/app -p 3000:3000 node:10 npm start


```


## Init frontend

```bash
# Enter in container with open port 4200
docker run -u $UID:$EUID -v=`pwd`/frontend:/home/node/app -w /home/node/app -p 4200:4200 -it node bash

# Down on one folder to create project
cd ..

# Create project
npx -p @angular/cli ng new csv-transactions --directory=app --style=scss --routing


```

# Up project on your machine

```bash
# Install projects dependencies for development
bash install_dependencies.sh

# Up project in dev mode
docker-compose up -d -f docker-compose.dev.yml

# Up and build project
docker-compose up -d
```