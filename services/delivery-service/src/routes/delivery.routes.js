const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/delivery.controller');

router.post('/', deliveryController.createDelivery);
router.get('/:id', deliveryController.getDeliveryById);
router.put('/:id', deliveryController.updateDelivery);
router.get('/order/:orderId', deliveryController.getDeliveryByOrder);
router.put('/:id/location', deliveryController.updateLocation);

module.exports = router;
