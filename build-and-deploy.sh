#!/bin/bash
# Build and deploy script for Kroki node

echo "Step 1: Building node..."
npm run build

echo "Step 2: Copying dist to n8n_test_env..."
cp -r dist n8n_test_env/

echo "Step 3: Stopping services and removing persistent volume..."
cd n8n_test_env
docker compose -f compose.n8n-service.yaml down
echo "Removing n8n persistent volume to ensure fresh deployment..."
docker volume rm n8n_test_env_n8n_data 2>/dev/null || echo "Volume doesn't exist, continuing..."

echo "Step 4: Removing old Docker image..."
docker image rm n8n_test_env-n8n:latest 2>/dev/null || echo "Image doesn't exist, continuing..."

echo "Step 5: Building fresh Docker image..."
docker compose -f compose.n8n-service.yaml build --no-cache n8n

echo "Step 6: Starting all services..."
docker compose -f compose.n8n-service.yaml up -d

echo "Step 7: Verifying deployment..."
echo "Waiting for services to start..."
sleep 10
docker compose -f compose.n8n-service.yaml ps

echo ""
echo "Checking n8n logs for any errors..."
docker compose -f compose.n8n-service.yaml logs n8n --tail=20

echo ""
echo "Deployment complete!"
echo "n8n is available at: http://localhost:5678"
