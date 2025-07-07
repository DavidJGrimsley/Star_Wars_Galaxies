#!/bin/bash

echo "Switching to branch main"
git checkout main || exit 1

echo "Pulling latest changes"
git pull || exit 1

echo "Installing dependencies"
npm install || exit 1

echo "Building the project"
npm run build || exit 1

echo "Deploying to server"
scp -r public package.json package-lock.json server.js deployer@108.175.12.95:/var/www/vhosts/friendly-easley.108-175-12-95.plesk.page/httpdocs/ || exit 1

echo "Restarting pm2"
ssh deployer@108.175.12.95 "
    cd /var/www/vhosts/friendly-easley.108-175-12-95.plesk.page/httpdocs &&
    pm2 start server.js --name starwarsGalaxies
"
echo "Server restarted"
echo "Deployment script finished"