# System Architecture Diagrams

## High-Level System Architecture

```
                                    ┌─────────────────┐
                                    │  Web/Mobile     │
                                    │     Client      │
                                    └────────┬────────┘
                                             │
                                             │ HTTP/HTTPS
                                             ▼
                                    ┌─────────────────┐
                                    │   API Gateway   │
                                    │   Port: 3000    │
                                    │                 │
                                    │ • Routing       │
                                    │ • Rate Limit    │
                                    │ • Auth          │
                                    └────────┬────────┘
                                             │
                 ┌───────────────────────────┼───────────────────────────┐
                 │                           │                           │
        ┌────────▼────────┐         ┌────────▼────────┐         ┌───────▼────────┐
        │  Restaurant     │         │      Menu       │         │     Order      │
        │   Service       │◄────────┤    Service      │────────►│    Service     │
        │  Port: 3001     │         │   Port: 3002    │         │   Port: 3003   │
        └────────┬────────┘         └────────┬────────┘         └───────┬────────┘
                 │                           │                           │
        ┌────────▼────────┐         ┌────────▼────────┐         ┌───────▼────────┐
        │   PostgreSQL    │         │    MongoDB      │         │   PostgreSQL   │
        │  restaurants    │         │     menus       │         │     orders     │
        └─────────────────┘         └─────────────────┘         └────────────────┘
                                                                         │
                                                                         │
                                        ┌────────────────────────────────┤
                                        │                                │
                               ┌────────▼────────┐             ┌────────▼────────┐
                               │    Delivery     │             │     Rating      │
                               │    Service      │             │    Service      │
                               │   Port: 3004    │             │   Port: 3005    │
                               └────────┬────────┘             └────────┬────────┘
                                        │                                │
                               ┌────────▼────────┐             ┌────────▼────────┐
                               │    MongoDB      │             │    MongoDB      │
                               │   deliveries    │             │    ratings      │
                               └─────────────────┘             └─────────────────┘

                    ┌──────────────────────────────────────────────┐
                    │          RabbitMQ Message Broker             │
                    │          Port: 5672 | UI: 15672              │
                    │                                              │
                    │  Exchanges:                                  │
                    │  • restaurant_events                         │
                    │  • menu_events                               │
                    │  • order_events                              │
                    │  • delivery_events                           │
                    │  • rating_events                             │
                    └──────────────────────────────────────────────┘
                                        ▲
                                        │
                            All services publish/subscribe
```

## Service Communication Flow

### Synchronous Communication (REST)

```
Client Request Flow:
┌──────┐    GET /restaurants     ┌─────────┐    Forward    ┌────────────┐
│Client├────────────────────────►│   API   ├──────────────►│Restaurant  │
│      │◄────────────────────────┤ Gateway │◄──────────────┤  Service   │
└──────┘    JSON Response        └─────────┘    Response   └────────────┘
```

### Asynchronous Communication (Events)

```
Order Creation Flow:
┌──────────┐  1. Create    ┌─────────┐  2. Publish      ┌──────────┐
│  Client  ├──────────────►│  Order  ├─────────────────►│ RabbitMQ │
└──────────┘   Order       │ Service │  order.created   └─────┬────┘
                           └─────────┘                         │
                                                                │
                           ┌────────────────────────────────────┤
                           │                                    │
                    3. Subscribe                         3. Subscribe
                           │                                    │
                  ┌────────▼────────┐              ┌───────────▼──────┐
                  │    Delivery     │              │     Rating       │
                  │    Service      │              │     Service      │
                  │                 │              │                  │
                  │ 4. Create       │              │ 4. Prepare for   │
                  │    Delivery     │              │    rating later  │
                  └─────────────────┘              └──────────────────┘
```

## Complete Order Lifecycle

```
┌──────────────────────────────────────────────────────────────────────┐
│                        Order Lifecycle                               │
└──────────────────────────────────────────────────────────────────────┘

Step 1: Create Order
    Client → API Gateway → Order Service
                              │
                              ├─ Save to PostgreSQL
                              └─ Publish: order.created

Step 2: Restaurant Confirms
    Restaurant Owner → Order Service
                              │
                              ├─ Update status: confirmed
                              └─ Publish: order.confirmed

Step 3: Prepare Food
    Restaurant → Order Service
                              │
                              ├─ Update status: preparing
                              └─ Publish: order.preparing

Step 4: Ready for Pickup
    Restaurant → Order Service
                              │
                              ├─ Update status: ready
                              └─ Publish: order.ready
                                    │
                    ┌───────────────┘
                    │
                    ▼
    Delivery Service (Listens)
                    │
                    ├─ Auto-create delivery
                    └─ Publish: delivery.created

Step 5: Assign Driver
    Delivery System → Delivery Service
                              │
                              ├─ Assign driver
                              ├─ Update status: assigned
                              └─ Publish: delivery.assigned

Step 6: Pickup
    Driver → Delivery Service
                              │
                              ├─ Update status: picked_up
                              └─ Publish: delivery.picked_up

Step 7: In Transit
    Driver (updates location) → Delivery Service
                              │
                              ├─ Update location
                              └─ Publish: delivery.location.updated

Step 8: Delivered
    Driver → Delivery Service
                              │
                              ├─ Update status: delivered
                              └─ Publish: delivery.delivered
                                    │
                    ┌───────────────┘
                    │
                    ▼
    Rating Service (Listens)
                    │
                    └─ Notify customer to rate

Step 9: Rating
    Customer → Rating Service
                              │
                              ├─ Save rating
                              ├─ Calculate avg rating
                              └─ Publish: rating.created
                                    │
                    ┌───────────────┘
                    │
                    ▼
    Restaurant Service (Listens)
                    │
                    └─ Update restaurant rating
```

## Database Schema Overview

### PostgreSQL - Restaurant Service

```
restaurants
├── id (SERIAL PRIMARY KEY)
├── name (VARCHAR)
├── description (TEXT)
├── address (TEXT)
├── phone (VARCHAR)
├── email (VARCHAR)
├── cuisine_type (VARCHAR)
├── opening_hours (JSONB)
├── rating (DECIMAL)
├── is_active (BOOLEAN)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### PostgreSQL - Order Service

```
orders
├── id (SERIAL PRIMARY KEY)
├── user_id (VARCHAR)
├── restaurant_id (INTEGER)
├── items (JSONB)
├── total_amount (DECIMAL)
├── delivery_address (TEXT)
├── delivery_instructions (TEXT)
├── status (VARCHAR)
├── payment_status (VARCHAR)
├── payment_method (VARCHAR)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### MongoDB - Menu Service

```javascript
{
  _id: ObjectId,
  restaurantId: String,
  name: String,
  description: String,
  category: String,
  price: Number,
  image_url: String,
  is_available: Boolean,
  is_vegetarian: Boolean,
  is_vegan: Boolean,
  allergens: [String],
  preparation_time: Number,
  calories: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### MongoDB - Delivery Service

```javascript
{
  _id: ObjectId,
  orderId: String,
  driverId: String,
  driverName: String,
  driverPhone: String,
  restaurantAddress: String,
  deliveryAddress: String,
  status: String,
  estimatedTime: Number,
  actualDeliveryTime: Date,
  currentLocation: {
    latitude: Number,
    longitude: Number,
    lastUpdated: Date
  },
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### MongoDB - Rating Service

```javascript
{
  _id: ObjectId,
  userId: String,
  orderId: String,
  restaurantId: String,
  deliveryId: String,
  restaurantRating: Number,
  deliveryRating: Number,
  foodQuality: Number,
  deliverySpeed: Number,
  comment: String,
  images: [String],
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Event Flow Diagram

```
┌──────────────┐
│   Service    │
│   Creates    │
│    Event     │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────┐
│      RabbitMQ Exchange       │
│    (Topic Exchange Type)     │
└──────┬───────────────────────┘
       │
       ├─────────────┬──────────────┐
       │             │              │
       ▼             ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│  Queue 1 │  │  Queue 2 │  │  Queue 3 │
└────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │              │
     ▼             ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│Service A │  │Service B │  │Service C │
│Processes │  │Processes │  │Processes │
└──────────┘  └──────────┘  └──────────┘

Event Examples:
• order.created → delivery-service, notification-service
• order.ready → delivery-service
• delivery.completed → rating-service, order-service
• rating.created → restaurant-service (update avg rating)
```

## Scaling Strategy

```
Single Instance (Development):
┌─────────────┐
│  Service A  │ Port 3001
└─────────────┘

Multiple Instances (Production):
┌──────────────────────────────────┐
│       Load Balancer              │
└───────┬──────────┬───────────────┘
        │          │
┌───────▼────┐  ┌──▼──────────┐  ┌──────────────┐
│Service A-1 │  │Service A-2  │  │ Service A-3  │
│Port 3001   │  │Port 3011    │  │ Port 3021    │
└────────────┘  └─────────────┘  └──────────────┘
```

## Security Layers

```
┌──────────────────────────────────────────┐
│              Internet                     │
└────────────────┬─────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│         Firewall / WAF                  │
│  • DDoS Protection                      │
│  • IP Filtering                         │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│         API Gateway                     │
│  • Rate Limiting                        │
│  • JWT Validation                       │
│  • Request Validation                   │
└────────────────┬────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
┌──────────────┐   ┌──────────────┐
│   Service    │   │   Service    │
│  • Input     │   │  • Input     │
│  Validation  │   │  Validation  │
│  • Auth      │   │  • Auth      │
└──────────────┘   └──────────────┘
```

## Deployment Architecture (Production)

```
┌────────────────────────────────────────────────────────────┐
│                    Cloud Provider (AWS/GCP/Azure)          │
│                                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │              Load Balancer                       │    │
│  └───────────────────┬──────────────────────────────┘    │
│                      │                                    │
│  ┌───────────────────┴──────────────────────────────┐    │
│  │         Kubernetes Cluster / ECS / App Engine    │    │
│  │                                                   │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐      │    │
│  │  │ Gateway  │  │Restaurant│  │   Menu   │      │    │
│  │  │   x3     │  │   x2     │  │   x2     │      │    │
│  │  └──────────┘  └──────────┘  └──────────┘      │    │
│  │                                                   │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐      │    │
│  │  │  Order   │  │ Delivery │  │  Rating  │      │    │
│  │  │   x3     │  │   x2     │  │   x2     │      │    │
│  │  └──────────┘  └──────────┘  └──────────┘      │    │
│  └───────────────────────────────────────────────┘    │
│                                                            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │ PostgreSQL │  │  MongoDB   │  │  RabbitMQ  │        │
│  │   (RDS)    │  │  (Atlas)   │  │(CloudAMQP) │        │
│  └────────────┘  └────────────┘  └────────────┘        │
└────────────────────────────────────────────────────────────┘
```

This architecture provides a solid foundation for building scalable, maintainable microservices!
