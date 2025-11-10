const express = require('express');
const cors = require('cors');
require('dotenv').config();

const restaurantRoutes = require('./routes/restaurant.routes');
const { initDatabase } = require('./database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Restaurant Service',
    timestamp: new Date() 
  });
});

// Routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/', restaurantRoutes);

module.exports = app;
