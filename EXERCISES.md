# Learning Exercises

These exercises will help you understand the microservices architecture by building features and solving problems.

## 🟢 Beginner Exercises

### Exercise 1: Create Your First Restaurant

**Goal:** Understand REST APIs and service communication

1. Use the API to create a new restaurant
2. Add at least 3 menu items to the restaurant
3. Retrieve the restaurant details
4. Update the restaurant's description

**Skills:** REST APIs, HTTP methods, JSON

### Exercise 2: Complete Order Flow

**Goal:** Understand how services work together

1. Create a restaurant with menu items
2. Place an order
3. Update order status through each stage: pending → confirmed → preparing → ready
4. Check if delivery was auto-created when order became ready
5. Update delivery status to completed
6. Add a rating for the order

**Skills:** Service orchestration, event-driven architecture

### Exercise 3: Monitor Events

**Goal:** Understand asynchronous messaging

1. Open RabbitMQ dashboard (http://localhost:15672)
2. Create an order
3. Watch the events flow through exchanges and queues
4. Identify which services publish which events

**Skills:** Message queues, event-driven architecture

## 🟡 Intermediate Exercises

### Exercise 4: Add a New Endpoint

**Goal:** Modify existing service

Add a "GET /api/restaurants/:id/popular-items" endpoint that:

- Returns the top 5 rated menu items for a restaurant
- Combines data from Menu and Rating services

**Files to modify:**

- `services/restaurant-service/src/routes/restaurant.routes.js`
- `services/restaurant-service/src/controllers/restaurant.controller.js`

**Skills:** Service integration, data aggregation

### Exercise 5: Implement Search Feature

**Goal:** Add cross-service search functionality

Add search endpoint that searches across:

- Restaurant names
- Menu item names
- Cuisine types

Return combined results with relevance scoring.

**Skills:** Database queries, aggregation, scoring algorithms

### Exercise 6: Add Coupon Service

**Goal:** Create a new microservice from scratch

Create a new Coupon Service that:

- Manages discount coupons
- Validates coupon codes
- Applies discounts to orders
- Integrates with Order Service

**Structure:**

```
services/coupon-service/
  ├── src/
  │   ├── models/Coupon.js
  │   ├── controllers/coupon.controller.js
  │   ├── routes/coupon.routes.js
  │   └── server.js
  ├── Dockerfile
  └── package.json
```

**Skills:** Service creation, database design, API integration

### Exercise 7: Add Authentication

**Goal:** Secure the API

Implement JWT authentication:

1. Create auth service or add to API Gateway
2. Add login/register endpoints
3. Protect endpoints with JWT middleware
4. Add user roles (customer, restaurant owner, admin)

**Skills:** Authentication, authorization, JWT, middleware

## 🔴 Advanced Exercises

### Exercise 8: Implement Caching

**Goal:** Optimize performance with Redis

Add Redis caching for:

- Restaurant list (expire after 5 minutes)
- Menu items (expire after 10 minutes)
- Popular searches

Implement cache invalidation when data changes.

**Skills:** Caching strategies, Redis, performance optimization

### Exercise 9: Add Real-time Tracking

**Goal:** Implement WebSocket communication

Add real-time delivery tracking:

1. Set up WebSocket server in API Gateway
2. Emit location updates from Delivery Service
3. Create simple HTML page to display live tracking
4. Show order status updates in real-time

**Skills:** WebSockets, real-time communication, Socket.io

### Exercise 10: Implement Saga Pattern

**Goal:** Handle distributed transactions

Implement order cancellation with refund:

1. Cancel order in Order Service
2. Refund payment
3. Cancel delivery
4. Update restaurant inventory
5. Rollback if any step fails

**Skills:** Distributed transactions, compensating transactions, saga pattern

### Exercise 11: Add Service Discovery

**Goal:** Implement dynamic service discovery

Replace hard-coded service URLs with Consul:

1. Set up Consul container
2. Register services on startup
3. Discover services dynamically
4. Handle service failures

**Skills:** Service discovery, Consul, high availability

### Exercise 12: Monitoring and Logging

**Goal:** Add observability

Implement comprehensive monitoring:

1. Add structured logging with Winston
2. Set up Prometheus metrics
3. Create Grafana dashboards
4. Add distributed tracing with Jaeger
5. Set up alerts for errors

**Skills:** Observability, monitoring, logging, metrics

## 🎯 Challenge Projects

### Challenge 1: Multi-Tenant System

Convert the system to support multiple restaurant chains, where each chain has multiple restaurants.

**Requirements:**

- Add tenant isolation
- Separate databases per tenant
- Tenant-specific API routes
- Admin dashboard per tenant

### Challenge 2: Recommendation Engine

Build a recommendation service:

- Suggest restaurants based on user history
- Recommend menu items based on ratings
- Personalized offers based on behavior
- ML-based predictions

### Challenge 3: Migrate to Kubernetes

Deploy the entire system to Kubernetes:

- Create Kubernetes manifests
- Set up Helm charts
- Configure auto-scaling
- Implement blue-green deployment
- Set up ingress controller

### Challenge 4: Add Payment Integration

Integrate real payment processing:

- Stripe or PayPal integration
- Handle payment webhooks
- Implement refund logic
- PCI compliance considerations
- Payment failure handling

### Challenge 5: Build Mobile App

Create a mobile app (React Native or Flutter):

- User authentication
- Browse restaurants and menus
- Place orders
- Track delivery in real-time
- Rate and review

## 📝 Exercise Template

For each exercise, document:

1. **Problem Statement:** What are you trying to solve?
2. **Design:** How will you implement it?
3. **Implementation:** Code changes made
4. **Testing:** How did you test it?
5. **Learnings:** What did you learn?

## 🤔 Discussion Questions

1. What happens if the Menu Service crashes while an order is being placed?
2. How would you handle a spike in traffic to the Restaurant Service?
3. Should user authentication be a separate service or part of the API Gateway?
4. How do you ensure data consistency across multiple databases?
5. What's the trade-off between synchronous and asynchronous communication?
6. How would you implement a "recommended for you" feature?
7. What's the best way to handle cascading failures?
8. How do you version APIs in a microservices architecture?

## 🎓 Learning Resources

### Books

- "Building Microservices" by Sam Newman
- "Microservices Patterns" by Chris Richardson
- "Designing Data-Intensive Applications" by Martin Kleppmann

### Online Courses

- [Microservices Architecture on Udemy](https://www.udemy.com/topic/microservices/)
- [Node.js Microservices on Pluralsight](https://www.pluralsight.com/)

### Documentation

- [Docker Docs](https://docs.docker.com/)
- [RabbitMQ Tutorials](https://www.rabbitmq.com/getstarted.html)
- [MongoDB University](https://university.mongodb.com/)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/)

## 💡 Tips

1. **Start Small:** Don't try to build everything at once
2. **Test Often:** Test after each small change
3. **Read Logs:** Always check service logs when debugging
4. **Use Postman:** Save API requests for reuse
5. **Version Control:** Commit often with meaningful messages
6. **Document:** Keep notes of what you learn
7. **Ask Questions:** Join communities, ask for help
8. **Break Things:** Learn by breaking and fixing

Good luck with your learning journey! 🚀
