const express = require('express');
const cors = require('cors');
require('dotenv').config();

const orderRoutes = require('./routes/order.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Order Service',
    timestamp: new Date() 
  });
});

// Routes
app.use('/api/orders', orderRoutes);
app.use('/', orderRoutes);

module.exports = app;
