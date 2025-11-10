#!/bin/bash

# Food Delivery Microservices Setup Script
# This script helps set up the development environment

echo "🚀 Food Delivery Microservices Setup"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is installed
echo "📦 Checking prerequisites..."
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker Desktop first.${NC}"
    echo "   Download from: https://www.docker.com/products/docker-desktop"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker is installed${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker Desktop.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker is running${NC}"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created${NC}"
else
    echo -e "${YELLOW}⚠️  .env file already exists, skipping...${NC}"
fi

echo ""
echo "🏗️  Building and starting services..."
echo "    This may take a few minutes on first run..."
echo ""

# Start services
docker-compose up -d --build

echo ""
echo "⏳ Waiting for services to be ready..."
echo "   (This usually takes 30-60 seconds)"
echo ""

# Wait for services to be healthy
sleep 10

# Function to check service health
check_service() {
    local service_name=$1
    local port=$2
    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:$port/health > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $service_name is ready${NC}"
            return 0
        fi
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}❌ $service_name failed to start${NC}"
    return 1
}

# Check each service
check_service "API Gateway" 3000
check_service "Restaurant Service" 3001
check_service "Menu Service" 3002
check_service "Order Service" 3003
check_service "Delivery Service" 3004
check_service "Rating Service" 3005

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}🎉 All services are running!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo "📍 Service URLs:"
echo "   API Gateway:        http://localhost:3000"
echo "   API Documentation:  http://localhost:3000/api-docs"
echo "   RabbitMQ Dashboard: http://localhost:15672 (admin/admin123)"
echo ""
echo "🧪 Quick Test:"
echo "   curl http://localhost:3000/health"
echo ""
echo "📚 Documentation:"
echo "   README.md          - Project overview"
echo "   QUICK_START.md     - Getting started guide"
echo "   API_EXAMPLES.md    - API usage examples"
echo "   ARCHITECTURE_GUIDE.md - Architecture explained"
echo ""
echo "🛑 To stop all services:"
echo "   docker-compose down"
echo ""
echo "🧹 To clean everything (including data):"
echo "   docker-compose down -v"
echo ""
echo "Happy coding! 🚀"
