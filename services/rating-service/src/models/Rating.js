const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  restaurantId: {
    type: String,
    required: true,
    index: true,
  },
  deliveryId: {
    type: String,
    index: true,
  },
  restaurantRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  deliveryRating: {
    type: Number,
    min: 1,
    max: 5,
  },
  foodQuality: {
    type: Number,
    min: 1,
    max: 5,
  },
  deliverySpeed: {
    type: Number,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    maxlength: 1000,
  },
  images: [{
    type: String,
  }],
  isVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Indexes for aggregation queries
ratingSchema.index({ restaurantId: 1, createdAt: -1 });
ratingSchema.index({ deliveryId: 1, createdAt: -1 });
ratingSchema.index({ restaurantRating: 1, deliveryRating: 1 });

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
