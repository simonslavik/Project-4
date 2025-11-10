const express = require('express');
const cors = require('cors');
require('dotenv').config();

const ratingRoutes = require('./routes/rating.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Rating Service',
    timestamp: new Date() 
  });
});

// Routes
app.use('/api/ratings', ratingRoutes);
app.use('/', ratingRoutes);

module.exports = app;
