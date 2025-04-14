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
rsync -av --exclude='.git' --exclude='node_modules' .next package.json package-lock.json public deployer@108.175.12.95:/home/deployer/starwarsGalaxies/ || exit 1

echo "Restarting pm2"
ssh deployer@108.175.12.95 "
  cd /home/deployer/starwarsGalaxies &&
  git pull &&
  npm install &&
  npm run build &&
  pm2 restart starwarsGalaxies
"
echo "Server restarted"
echo "Deployment script finished"