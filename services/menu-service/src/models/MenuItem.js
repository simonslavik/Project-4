const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  restaurantId: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    required: true,
    enum: ['appetizer', 'main_course', 'dessert', 'beverage', 'side_dish', 'other'],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  image_url: {
    type: String,
  },
  is_available: {
    type: Boolean,
    default: true,
  },
  is_vegetarian: {
    type: Boolean,
    default: false,
  },
  is_vegan: {
    type: Boolean,
    default: false,
  },
  allergens: [{
    type: String,
  }],
  preparation_time: {
    type: Number, // in minutes
    default: 15,
  },
  calories: {
    type: Number,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
menuItemSchema.index({ restaurantId: 1, category: 1 });
menuItemSchema.index({ restaurantId: 1, is_available: 1 });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
