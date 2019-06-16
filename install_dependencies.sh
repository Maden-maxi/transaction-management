docker run -u $UID:$EUID -v=`pwd`/backend:/app -w /app node:10 yarn install
docker run -u $UID:$EUID -v=`pwd`/frontend:/app -w /app node yarn install