#!/bin/bash
# Run this script from the project root folder (where requirements.txt is)
# chmod +x deploy.sh - don't forget to run once per env

if [ ! -f requirements.txt ]; then
  echo "Error: Run this script from the project root where requirements.txt is."
  exit 1
fi

# Exit on errors
set -e

echo "Starting deployment..."

# Backend: install Python deps and migrate
pip install -r requirements.txt
cd backend
python manage.py migrate
cd ..

# Frontend: install deps and build
cd frontend
npm install
npm run build
cd ..

# Restart backend server 
echo "Restarting backend server..."
sudo systemctl restart your-backend-service

echo "Deployment complete!"