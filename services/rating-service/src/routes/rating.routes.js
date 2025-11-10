const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating.controller');

router.post('/', ratingController.createRating);
router.get('/:id', ratingController.getRatingById);
router.get('/restaurant/:restaurantId', ratingController.getRestaurantRatings);
router.get('/delivery/:deliveryId', ratingController.getDeliveryRatings);
router.get('/restaurant/:restaurantId/average', ratingController.getRestaurantAverageRating);

module.exports = router;
