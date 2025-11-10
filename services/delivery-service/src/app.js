const express = require('express');
const cors = require('cors');
require('dotenv').config();

const deliveryRoutes = require('./routes/delivery.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Delivery Service',
    timestamp: new Date() 
  });
});

// Routes
app.use('/api/deliveries', deliveryRoutes);
app.use('/', deliveryRoutes);

module.exports = app;
