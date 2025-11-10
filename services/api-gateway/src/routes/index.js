const express = require('express');
const router = express.Router();

const restaurantRoutes = require('./restaurant.routes');
const menuRoutes = require('./menu.routes');
const orderRoutes = require('./order.routes');
const deliveryRoutes = require('./delivery.routes');
const ratingRoutes = require('./rating.routes');

// Route all requests to respective services
router.use('/restaurants', restaurantRoutes);
router.use('/menus', menuRoutes);
router.use('/orders', orderRoutes);
router.use('/deliveries', deliveryRoutes);
router.use('/ratings', ratingRoutes);

router.get('/', (req, res) => {
  res.json({
    message: 'Food Delivery API Gateway',
    version: '1.0.0',
    endpoints: {
      restaurants: '/api/restaurants',
      menus: '/api/menus',
      orders: '/api/orders',
      deliveries: '/api/deliveries',
      ratings: '/api/ratings',
      docs: '/api-docs',
    },
  });
});

module.exports = router;
