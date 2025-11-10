# API Examples

## Restaurant Service

### Create Restaurant

```bash
POST http://localhost:3000/api/restaurants
Content-Type: application/json

{
  "name": "Burger House",
  "description": "Gourmet burgers and fries",
  "address": "789 Broadway, City, State 12345",
  "phone": "+1-555-0123",
  "email": "contact@burgerhouse.com",
  "cuisine_type": "American",
  "opening_hours": {
    "monday": "11:00-22:00",
    "tuesday": "11:00-22:00",
    "wednesday": "11:00-22:00",
    "thursday": "11:00-22:00",
    "friday": "11:00-23:00",
    "saturday": "10:00-23:00",
    "sunday": "10:00-21:00"
  }
}
```

### Get All Restaurants

```bash
GET http://localhost:3000/api/restaurants?limit=10&offset=0
```

### Search Restaurants

```bash
GET http://localhost:3000/api/restaurants/search?q=burger&cuisine_type=American
```

### Get Restaurant by ID

```bash
GET http://localhost:3000/api/restaurants/1
```

### Update Restaurant

```bash
PUT http://localhost:3000/api/restaurants/1
Content-Type: application/json

{
  "description": "The best gourmet burgers in town!",
  "rating": 4.5
}
```

## Menu Service

### Create Menu Item

```bash
POST http://localhost:3000/api/menus
Content-Type: application/json

{
  "restaurantId": "1",
  "name": "Classic Cheeseburger",
  "description": "Beef patty with cheddar, lettuce, tomato, pickles",
  "category": "main_course",
  "price": 11.99,
  "image_url": "https://example.com/burger.jpg",
  "is_available": true,
  "is_vegetarian": false,
  "is_vegan": false,
  "allergens": ["gluten", "dairy"],
  "preparation_time": 15,
  "calories": 650
}
```

### Get Restaurant Menu

```bash
GET http://localhost:3000/api/menus/restaurant/1
```

### Get Menu with Filters

```bash
GET http://localhost:3000/api/menus/restaurant/1?category=main_course&available=true
```

### Update Menu Item

```bash
PUT http://localhost:3000/api/menus/MENU_ITEM_ID
Content-Type: application/json

{
  "price": 12.99,
  "is_available": false
}
```

## Order Service

### Create Order

```bash
POST http://localhost:3000/api/orders
Content-Type: application/json

{
  "user_id": "user_123",
  "restaurant_id": 1,
  "items": [
    {
      "id": "menu_item_1",
      "name": "Classic Cheeseburger",
      "price": 11.99,
      "quantity": 2
    },
    {
      "id": "menu_item_2",
      "name": "French Fries",
      "price": 4.99,
      "quantity": 1
    }
  ],
  "delivery_address": "123 Customer St, Apt 4B, City, State 12345",
  "delivery_instructions": "Please ring doorbell twice",
  "payment_method": "credit_card"
}
```

### Get Order by ID

```bash
GET http://localhost:3000/api/orders/1
```

### Get User Orders

```bash
GET http://localhost:3000/api/orders/user/user_123?limit=20&offset=0
```

### Update Order Status

```bash
PUT http://localhost:3000/api/orders/1/status
Content-Type: application/json

{
  "status": "confirmed"
}
```

Status flow: `pending` → `confirmed` → `preparing` → `ready` → `picked_up` → `delivered`

### Cancel Order

```bash
DELETE http://localhost:3000/api/orders/1
```

## Delivery Service

### Create Delivery

```bash
POST http://localhost:3000/api/deliveries
Content-Type: application/json

{
  "orderId": "1",
  "restaurantAddress": "789 Broadway, City, State 12345",
  "deliveryAddress": "123 Customer St, Apt 4B, City, State 12345",
  "estimatedTime": 30
}
```

### Get Delivery by ID

```bash
GET http://localhost:3000/api/deliveries/DELIVERY_ID
```

### Get Delivery by Order

```bash
GET http://localhost:3000/api/deliveries/order/1
```

### Update Delivery Status

```bash
PUT http://localhost:3000/api/deliveries/DELIVERY_ID
Content-Type: application/json

{
  "status": "picked_up",
  "driverId": "driver_123",
  "driverName": "John Driver",
  "driverPhone": "+1-555-0199"
}
```

Status flow: `pending` → `assigned` → `picked_up` → `in_transit` → `delivered`

### Update Delivery Location

```bash
PUT http://localhost:3000/api/deliveries/DELIVERY_ID/location
Content-Type: application/json

{
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

## Rating Service

### Create Rating

```bash
POST http://localhost:3000/api/ratings
Content-Type: application/json

{
  "userId": "user_123",
  "orderId": "1",
  "restaurantId": "1",
  "deliveryId": "DELIVERY_ID",
  "restaurantRating": 5,
  "deliveryRating": 4,
  "foodQuality": 5,
  "deliverySpeed": 4,
  "comment": "Excellent food! Burger was juicy and perfectly cooked. Delivery was quick.",
  "images": ["https://example.com/food-photo.jpg"]
}
```

### Get Restaurant Ratings

```bash
GET http://localhost:3000/api/ratings/restaurant/1?limit=10&offset=0
```

### Get Restaurant Average Rating

```bash
GET http://localhost:3000/api/ratings/restaurant/1/average
```

Response:

```json
{
  "data": {
    "restaurantId": "1",
    "averageRating": {
      "average": 4.75,
      "foodQuality": 4.8,
      "deliveryRating": 4.5,
      "totalRatings": 42
    }
  }
}
```

### Get Rating by ID

```bash
GET http://localhost:3000/api/ratings/RATING_ID
```

## Complete Order Flow Example

```bash
# 1. Create a restaurant
curl -X POST http://localhost:3000/api/restaurants \
  -H "Content-Type: application/json" \
  -d '{"name":"Sushi Place","address":"123 Main St","phone":"+1234567890","cuisine_type":"Japanese"}'

# 2. Add menu items
curl -X POST http://localhost:3000/api/menus \
  -H "Content-Type: application/json" \
  -d '{"restaurantId":"1","name":"California Roll","category":"main_course","price":8.99}'

# 3. Create an order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"user_id":"user1","restaurant_id":1,"items":[{"name":"California Roll","price":8.99,"quantity":2}],"delivery_address":"456 Oak Ave","payment_method":"credit_card"}'

# 4. Update order status to ready
curl -X PUT http://localhost:3000/api/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"ready"}'

# 5. Get delivery (auto-created when order is ready)
curl http://localhost:3000/api/deliveries/order/1

# 6. Update delivery status
curl -X PUT http://localhost:3000/api/deliveries/DELIVERY_ID \
  -H "Content-Type: application/json" \
  -d '{"status":"delivered"}'

# 7. Add rating
curl -X POST http://localhost:3000/api/ratings \
  -H "Content-Type: application/json" \
  -d '{"userId":"user1","orderId":"1","restaurantId":"1","restaurantRating":5,"comment":"Amazing!"}'
```

## Health Checks

```bash
# Check all services
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
curl http://localhost:3004/health
curl http://localhost:3005/health
```

## Using with Postman

Import this collection by creating a new collection with these endpoints, or use the Swagger UI at:

```
http://localhost:3000/api-docs
```
