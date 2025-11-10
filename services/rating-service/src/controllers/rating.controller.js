const Rating = require('../models/Rating');
const { publishEvent } = require('../messaging/rabbitmq');

const createRating = async (req, res) => {
  try {
    const rating = new Rating(req.body);
    await rating.save();
    
    await publishEvent('rating.created', rating);
    
    // Calculate and publish new average rating
    const avgRating = await calculateAverageRating(rating.restaurantId);
    await publishEvent('restaurant.rating.updated', {
      restaurantId: rating.restaurantId,
      averageRating: avgRating,
    });
    
    res.status(201).json({ data: rating });
  } catch (error) {
    console.error('Error creating rating:', error);
    res.status(500).json({ error: 'Failed to create rating' });
  }
};

const getRatingById = async (req, res) => {
  try {
    const { id } = req.params;
    const rating = await Rating.findById(id);
    
    if (!rating) {
      return res.status(404).json({ error: 'Rating not found' });
    }
    
    res.json({ data: rating });
  } catch (error) {
    console.error('Error fetching rating:', error);
    res.status(500).json({ error: 'Failed to fetch rating' });
  }
};

const getRestaurantRatings = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { limit = 10, offset = 0, sort = '-createdAt' } = req.query;
    
    const ratings = await Rating.find({ restaurantId })
      .sort(sort)
      .limit(parseInt(limit))
      .skip(parseInt(offset));
    
    const total = await Rating.countDocuments({ restaurantId });
    
    res.json({ 
      data: ratings, 
      count: ratings.length,
      total,
    });
  } catch (error) {
    console.error('Error fetching restaurant ratings:', error);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
};

const getDeliveryRatings = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const ratings = await Rating.find({ deliveryId }).sort('-createdAt');
    
    res.json({ data: ratings, count: ratings.length });
  } catch (error) {
    console.error('Error fetching delivery ratings:', error);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
};

const getRestaurantAverageRating = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const avgRating = await calculateAverageRating(restaurantId);
    
    res.json({ 
      data: {
        restaurantId,
        averageRating: avgRating,
      }
    });
  } catch (error) {
    console.error('Error calculating average rating:', error);
    res.status(500).json({ error: 'Failed to calculate average rating' });
  }
};

// Helper function
const calculateAverageRating = async (restaurantId) => {
  const result = await Rating.aggregate([
    { $match: { restaurantId } },
    {
      $group: {
        _id: '$restaurantId',
        avgRestaurantRating: { $avg: '$restaurantRating' },
        avgFoodQuality: { $avg: '$foodQuality' },
        avgDeliveryRating: { $avg: '$deliveryRating' },
        totalRatings: { $sum: 1 },
      },
    },
  ]);
  
  if (result.length === 0) {
    return {
      average: 0,
      totalRatings: 0,
    };
  }
  
  return {
    average: parseFloat(result[0].avgRestaurantRating.toFixed(2)),
    foodQuality: parseFloat((result[0].avgFoodQuality || 0).toFixed(2)),
    deliveryRating: parseFloat((result[0].avgDeliveryRating || 0).toFixed(2)),
    totalRatings: result[0].totalRatings,
  };
};

module.exports = {
  createRating,
  getRatingById,
  getRestaurantRatings,
  getDeliveryRatings,
  getRestaurantAverageRating,
};
