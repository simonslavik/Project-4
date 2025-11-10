# Food Delivery Microservices Backend

A complete microservices architecture for a food delivery platform built with Node.js, featuring multiple services communicating via REST APIs and RabbitMQ message queue.

## 🏗️ Architecture

This project demonstrates a microservices architecture with the following services:

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
┌──────▼──────────┐
│   API Gateway   │  (Port 3000)
└────────┬────────┘
         │
    ┌────┴────────────────────────────┐
    │                                  │
┌───▼───────────┐              ┌──────▼──────┐
│  Restaurant   │              │    Menu     │
│   Service     │◄────────────►│   Service   │
│  (Port 3001)  │              │ (Port 3002) │
└───────┬───────┘              └─────────────┘
        │
    ┌───▼───────────────────┐
    │                       │
┌───▼────────┐      ┌───────▼──────┐
│   Order    │      │   Delivery   │
│  Service   │◄────►│   Service    │
│(Port 3003) │      │ (Port 3004)  │
└─────┬──────┘      └──────────────┘
      │
┌─────▼──────┐
│   Rating   │
│  Service   │
│(Port 3005) │
└────────────┘
```

## 🚀 Services

### 1. API Gateway (Port 3000)

- Single entry point for all client requests
- Request routing to appropriate microservices
- Authentication middleware
- Rate limiting

### 2. Restaurant Service (Port 3001)

- Restaurant CRUD operations
- Restaurant search and filtering
- Operating hours management
- Database: PostgreSQL

### 3. Menu Service (Port 3002)

- Menu item management
- Categories and pricing
- Availability management
- Database: MongoDB

### 4. Order Service (Port 3003)

- Order placement and tracking
- Order status management
- Payment processing (mock)
- Database: PostgreSQL
- Events: RabbitMQ

### 5. Delivery Service (Port 3004)

- Delivery assignment
- Real-time tracking
- Delivery status updates
- Database: MongoDB

### 6. Rating Service (Port 3005)

- Restaurant ratings and reviews
- Delivery ratings
- Average rating calculations
- Database: MongoDB

## 🛠️ Tech Stack

- **Runtime**: Node.js 20.x
- **Framework**: Express.js
- **Databases**:
  - PostgreSQL (Restaurant, Order services)
  - MongoDB (Menu, Delivery, Rating services)
- **Message Queue**: RabbitMQ
- **Caching**: Redis
- **Containerization**: Docker & Docker Compose
- **API Documentation**: Swagger/OpenAPI

## 📋 Prerequisites

- Docker & Docker Compose
- Node.js 20.x (for local development)
- npm or yarn

## 🚦 Getting Started

### 1. Clone and Setup

```bash
cd Project-4
npm install
```

### 2. Start All Services with Docker

```bash
docker-compose up --build
```

This will start:

- API Gateway (http://localhost:3000)
- Restaurant Service (http://localhost:3001)
- Menu Service (http://localhost:3002)
- Order Service (http://localhost:3003)
- Delivery Service (http://localhost:3004)
- Rating Service (http://localhost:3005)
- PostgreSQL (Port 5432)
- MongoDB (Port 27017)
- RabbitMQ (Port 5672, Management UI: 15672)
- Redis (Port 6379)

### 3. Access Services

- **API Gateway**: http://localhost:3000
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)
- **API Documentation**: http://localhost:3000/api-docs

## 📚 API Endpoints

### Restaurant Service

```
GET    /api/restaurants          - Get all restaurants
GET    /api/restaurants/:id      - Get restaurant by ID
POST   /api/restaurants          - Create restaurant
PUT    /api/restaurants/:id      - Update restaurant
DELETE /api/restaurants/:id      - Delete restaurant
GET    /api/restaurants/search   - Search restaurants
```

### Menu Service

```
GET    /api/menus/restaurant/:id - Get menu by restaurant
POST   /api/menus                - Create menu item
PUT    /api/menus/:id            - Update menu item
DELETE /api/menus/:id            - Delete menu item
GET    /api/menus/:id            - Get menu item
```

### Order Service

```
POST   /api/orders               - Create order
GET    /api/orders/:id           - Get order details
GET    /api/orders/user/:userId  - Get user orders
PUT    /api/orders/:id/status    - Update order status
DELETE /api/orders/:id           - Cancel order
```

### Delivery Service

```
POST   /api/deliveries           - Create delivery
GET    /api/deliveries/:id       - Get delivery status
PUT    /api/deliveries/:id       - Update delivery status
GET    /api/deliveries/order/:id - Get delivery by order
```

### Rating Service

```
POST   /api/ratings              - Create rating
GET    /api/ratings/restaurant/:id - Get restaurant ratings
GET    /api/ratings/delivery/:id   - Get delivery ratings
GET    /api/ratings/:id            - Get rating by ID
```

## 🔧 Environment Variables

Each service has its own `.env` file. Copy from `.env.example`:

```bash
cp .env.example .env
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific service tests
npm test --prefix services/restaurant-service
```

## 📊 Database Migrations

```bash
# Restaurant Service
npm run migrate --prefix services/restaurant-service

# Order Service
npm run migrate --prefix services/order-service
```

## 🐰 RabbitMQ Events

The system uses event-driven communication:

- `order.created` - New order placed
- `order.confirmed` - Order confirmed by restaurant
- `order.ready` - Order ready for delivery
- `delivery.assigned` - Delivery assigned to driver
- `delivery.completed` - Delivery completed

## 📈 Monitoring

- Service health checks: `GET /health` on each service
- RabbitMQ Management UI: http://localhost:15672

## 🔄 Development Workflow

### Run Single Service Locally

```bash
cd services/restaurant-service
npm install
npm run dev
```

### Add New Feature

1. Create feature branch
2. Implement in relevant service
3. Update API documentation
4. Add tests
5. Update docker-compose if needed

## 🏛️ Design Patterns Used

- **API Gateway Pattern**: Single entry point
- **Database per Service**: Each service owns its data
- **Event-Driven Architecture**: Asynchronous communication
- **Circuit Breaker**: Fault tolerance
- **Service Discovery**: Dynamic service location

## 📝 License

MIT

## 🤝 Contributing

Feel free to submit issues and enhancement requests!
