const express = require('express');
const { proxyRequest } = require('../utils/proxy');
const router = express.Router();

const SERVICE_URL = process.env.MENU_SERVICE_URL;

/**
 * @swagger
 * /api/menus/restaurant/{restaurantId}:
 *   get:
 *     summary: Get menu by restaurant
 *     tags: [Menus]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant menu
 */
router.get('/restaurant/:restaurantId', (req, res) => proxyRequest(req, res, SERVICE_URL));

router.get('/:id', (req, res) => proxyRequest(req, res, SERVICE_URL));
router.post('/', (req, res) => proxyRequest(req, res, SERVICE_URL));
router.put('/:id', (req, res) => proxyRequest(req, res, SERVICE_URL));
router.delete('/:id', (req, res) => proxyRequest(req, res, SERVICE_URL));

module.exports = router;
