# Microservices Architecture Explained

## What Are Microservices?

Microservices is an architectural style where an application is built as a collection of small, independent services that:

- Run in their own process
- Communicate via APIs (REST, gRPC, etc.)
- Can be deployed independently
- Own their own data
- Can use different technologies

## Our Food Delivery Architecture

### Traditional Monolithic Approach (What We're NOT Building)

```
┌─────────────────────────────────────┐
│         Single Application          │
│  ┌──────────┐  ┌──────────┐        │
│  │Restaurant│  │  Menu    │        │
│  ├──────────┤  ├──────────┤        │
│  │  Order   │  │ Delivery │        │
│  ├──────────┤  ├──────────┤        │
│  │  Rating  │  │          │        │
│  └──────────┘  └──────────┘        │
│                                     │
│        Single Database              │
└─────────────────────────────────────┘
```

### Our Microservices Approach

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Restaurant   │  │    Menu      │  │    Order     │
│   Service    │  │   Service    │  │   Service    │
│      +       │  │      +       │  │      +       │
│  PostgreSQL  │  │   MongoDB    │  │  PostgreSQL  │
└──────────────┘  └──────────────┘  └──────────────┘
         ▲                ▲                ▲
         │                │                │
         └────────────────┴────────────────┘
                          │
                  ┌───────▼───────┐
                  │  API Gateway  │
                  └───────────────┘
```

## Key Concepts

### 1. API Gateway Pattern

The API Gateway is the single entry point for all clients. It:

- Routes requests to appropriate microservices
- Handles authentication and authorization
- Implements rate limiting
- Aggregates responses from multiple services
- Provides API documentation

**Without API Gateway:**

```
Client → Restaurant Service (Port 3001)
Client → Menu Service (Port 3002)
Client → Order Service (Port 3003)
// Client needs to know all service addresses
```

**With API Gateway:**

```
Client → API Gateway (Port 3000) → Routes to appropriate service
// Client only needs to know one address
```

### 2. Database Per Service Pattern

Each microservice has its own database:

- **Restaurant Service** → PostgreSQL (relational, ACID transactions)
- **Menu Service** → MongoDB (flexible schema for varied menu items)
- **Order Service** → PostgreSQL (transactional data)
- **Delivery Service** → MongoDB (real-time location updates)
- **Rating Service** → MongoDB (unstructured reviews)

**Benefits:**

- Services are loosely coupled
- Can scale databases independently
- Can use the best database for each use case
- Schema changes don't affect other services

### 3. Event-Driven Architecture

Services communicate asynchronously using RabbitMQ message queue.

**Example Flow:**

```
1. User creates order
   → Order Service publishes "order.created" event

2. Delivery Service listens for "order.ready" event
   → Automatically creates delivery record

3. Rating Service listens for "delivery.completed" event
   → Notifies user to rate the order
```

**Benefits:**

- Services don't need direct connections
- Can process events at their own pace
- Easy to add new services that react to events
- System continues if one service is down

### 4. Service Independence

Each service can be:

- Developed by different teams
- Written in different languages
- Scaled independently
- Deployed without affecting others
- Restarted without system downtime

## Communication Patterns

### Synchronous (REST API)

Used when immediate response is needed:

```
API Gateway → Restaurant Service
"Get restaurant details" → Response immediately
```

### Asynchronous (Message Queue)

Used for operations that don't need immediate response:

```
Order Service → RabbitMQ → Delivery Service
"Order ready" → Process when convenient
```

## Scaling Strategies

### Vertical Scaling (Single Service)

```
Restaurant Service (1 instance)
    ↓
Restaurant Service (more CPU/RAM)
```

### Horizontal Scaling (Multiple Instances)

```
Restaurant Service (1 instance)
    ↓
┌─────────┐  ┌─────────┐  ┌─────────┐
│ Rest. 1 │  │ Rest. 2 │  │ Rest. 3 │
└─────────┘  └─────────┘  └─────────┘
      ↑           ↑           ↑
      └───────────┴───────────┘
            Load Balancer
```

## Benefits of Our Architecture

### 1. **Scalability**

- Scale only the services that need it
- Restaurant Service getting many requests? Scale only that service
- Black Friday sale? Scale Order Service independently

### 2. **Fault Isolation**

- If Rating Service crashes, orders still work
- Bug in Menu Service doesn't affect deliveries
- Can deploy fix to one service without risking others

### 3. **Technology Flexibility**

- Use PostgreSQL for transactional data
- Use MongoDB for flexible, document-based data
- Could add Redis for caching
- Could use different languages per service

### 4. **Team Autonomy**

- Team A owns Restaurant Service
- Team B owns Order Service
- Teams can work independently
- Clear service boundaries

### 5. **Easy to Understand**

- Each service has one responsibility
- Easier to onboard new developers
- Smaller codebases to understand

## Challenges & Solutions

### Challenge 1: Distributed Data

**Problem:** Data is spread across multiple databases
**Solution:** Use events to keep data in sync, implement eventual consistency

### Challenge 2: Service Communication

**Problem:** Services need to find and talk to each other
**Solution:** Use API Gateway for routing, environment variables for service URLs

### Challenge 3: Debugging

**Problem:** Request flows through multiple services
**Solution:** Implement logging, tracing, and health checks

### Challenge 4: Testing

**Problem:** Testing multiple services together
**Solution:** Use Docker Compose for integration testing, mock services for unit tests

## Real-World Scenarios

### Scenario 1: Adding a New Feature

**Task:** Add "Favorite Restaurants" feature

**Monolithic Approach:**

1. Modify existing codebase
2. Test entire application
3. Deploy whole system
4. Risk breaking existing features

**Microservices Approach:**

1. Create new "Favorites Service"
2. Connect to API Gateway
3. Subscribe to restaurant events
4. Deploy only new service
5. Existing services unaffected

### Scenario 2: Handling Peak Traffic

**Restaurant viewing increased 10x, but orders normal**

**Monolithic:** Scale entire application (expensive)
**Microservices:** Scale only Restaurant Service (efficient)

### Scenario 3: Database Migration

**Need to migrate Menu Service from MongoDB to PostgreSQL**

**Monolithic:** Risky, affects entire application
**Microservices:**

1. Migrate only Menu Service
2. Other services unaffected
3. Can roll back if issues

## Learning Path

### Beginner Level

1. ✅ Understand REST APIs
2. ✅ Run services with Docker
3. ✅ Test with Postman/curl
4. ✅ Read service logs

### Intermediate Level

5. Add authentication to API Gateway
6. Implement database migrations
7. Add validation and error handling
8. Monitor RabbitMQ message flow

### Advanced Level

9. Implement service discovery (Consul, Eureka)
10. Add distributed tracing (Jaeger)
11. Implement circuit breakers
12. Set up Kubernetes deployment
13. Add monitoring (Prometheus, Grafana)

## Next Steps

1. **Run the project** - See it working
2. **Break something** - Stop a service, see what happens
3. **Trace a request** - Follow an order through all services
4. **Add a feature** - Create a new endpoint
5. **Scale a service** - Run multiple instances
6. **Monitor events** - Watch RabbitMQ dashboard

## Resources

- [Microservices.io](https://microservices.io/) - Patterns catalog
- [Martin Fowler - Microservices](https://martinfowler.com/articles/microservices.html)
- [Docker Documentation](https://docs.docker.com/)
- [RabbitMQ Tutorials](https://www.rabbitmq.com/getstarted.html)

Happy learning! 🚀
