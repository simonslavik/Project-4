const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu.controller');

router.get('/restaurant/:restaurantId', menuController.getMenuByRestaurant);
router.get('/:id', menuController.getMenuItemById);
router.post('/', menuController.createMenuItem);
router.put('/:id', menuController.updateMenuItem);
router.delete('/:id', menuController.deleteMenuItem);

module.exports = router;
