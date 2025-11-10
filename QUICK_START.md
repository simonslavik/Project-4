# Quick Start Guide

## Prerequisites

Make sure you have installed:

- Docker Desktop (latest version)
- Docker Compose
- Node.js 20.x (for local development)

## Getting Started

### 1. Clone and Setup Environment

```bash
cd Project-4
cp .env.example .env
```

Edit `.env` if you need to change any default values.

### 2. Start All Services

```bash
docker-compose up --build
```

This will start all services including:

- PostgreSQL (Port 5432)
- MongoDB (Port 27017)
- RabbitMQ (Ports 5672, 15672)
- Redis (Port 6379)
- API Gateway (Port 3000)
- All microservices (Ports 3001-3005)

### 3. Wait for Services to Be Ready

Monitor the logs until you see:

```
✅ Database connected
✅ RabbitMQ connected
🚀 [Service Name] running on port XXXX
```

### 4. Test the API

```bash
# Health check
curl http://localhost:3000/health

# Get API info
curl http://localhost:3000/api

# View API documentation
open http://localhost:3000/api-docs
```

## Creating Your First Restaurant

```bash
curl -X POST http://localhost:3000/api/restaurants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizza Palace",
    "description": "Best pizza in town",
    "address": "123 Main St, City",
    "phone": "+1234567890",
    "email": "info@pizzapalace.com",
    "cuisine_type": "Italian",
    "opening_hours": {
      "monday": "10:00-22:00",
      "tuesday": "10:00-22:00",
      "wednesday": "10:00-22:00",
      "thursday": "10:00-22:00",
      "friday": "10:00-23:00",
      "saturday": "10:00-23:00",
      "sunday": "11:00-21:00"
    }
  }'
```

## Adding Menu Items

```bash
curl -X POST http://localhost:3000/api/menus \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": "1",
    "name": "Margherita Pizza",
    "description": "Classic tomato and mozzarella",
    "category": "main_course",
    "price": 12.99,
    "is_available": true,
    "is_vegetarian": true,
    "preparation_time": 20
  }'
```

## Creating an Order

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "restaurant_id": 1,
    "items": [
      {
        "id": "menu_item_id",
        "name": "Margherita Pizza",
        "price": 12.99,
        "quantity": 2
      }
    ],
    "delivery_address": "456 Oak Ave, City",
    "delivery_instructions": "Ring doorbell",
    "payment_method": "credit_card"
  }'
```

## Checking RabbitMQ

Visit http://localhost:15672

- Username: `admin`
- Password: `admin123`

You'll see the event exchanges and queues.

## Common Commands

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v

# View logs for specific service
docker-compose logs -f restaurant-service

# Restart a specific service
docker-compose restart order-service

# Run services in background
docker-compose up -d
```

## Local Development (Without Docker)

### 1. Start Infrastructure Only

```bash
# Start only databases and message queue
docker-compose up postgres mongodb rabbitmq redis
```

### 2. Run Services Locally

```bash
# Terminal 1 - API Gateway
cd services/api-gateway
cp .env.example .env
npm install
npm run dev

# Terminal 2 - Restaurant Service
cd services/restaurant-service
cp .env.example .env
npm install
npm run dev

# Repeat for other services...
```

## Troubleshooting

### Services won't start

- Check Docker Desktop is running
- Check ports 3000-3005, 5432, 27017, 5672, 15672, 6379 are not in use
- Run `docker-compose down -v` and try again

### Database connection errors

- Wait 30 seconds for databases to initialize
- Check logs: `docker-compose logs postgres mongodb`

### RabbitMQ connection errors

- RabbitMQ takes ~10 seconds to start
- Check: `docker-compose logs rabbitmq`

### Port already in use

Edit `docker-compose.yml` to change the host port:

```yaml
ports:
  - "3001:3001" # Change first number to different port
```

## Next Steps

1. Explore the API documentation at http://localhost:3000/api-docs
2. Check out the architecture in the main README.md
3. Try creating a complete order flow
4. Monitor events in RabbitMQ dashboard
5. Add authentication and authorization
6. Implement payment integration
7. Add real-time notifications with WebSockets

Happy coding! 🚀
