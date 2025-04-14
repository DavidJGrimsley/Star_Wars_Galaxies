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
scp -r * deployer@108.175.12.95:/home/deployer/starwarsGalaxies/ || exit 1

echo "Deployment complete"

echo "Restarting pm2"
ssh deployer@108.175.12.95 "
  pm2 describe starwarsGalaxies > /dev/null || pm2 start npm --name 'starwarsGalaxies' -- start
  pm2 restart starwarsGalaxies
"
echo "Server restarted"
echo "Deployment script finished"