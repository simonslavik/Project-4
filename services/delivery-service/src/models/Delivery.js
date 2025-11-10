const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  driverId: {
    type: String,
    index: true,
  },
  driverName: {
    type: String,
  },
  driverPhone: {
    type: String,
  },
  restaurantAddress: {
    type: String,
    required: true,
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed'],
    default: 'pending',
  },
  estimatedTime: {
    type: Number, // in minutes
    default: 30,
  },
  actualDeliveryTime: {
    type: Date,
  },
  currentLocation: {
    latitude: Number,
    longitude: Number,
    lastUpdated: Date,
  },
  notes: {
    type: String,
  },
}, {
  timestamps: true,
});

deliverySchema.index({ status: 1, createdAt: -1 });
deliverySchema.index({ driverId: 1, status: 1 });

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = Delivery;
