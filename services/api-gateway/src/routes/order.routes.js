const express = require('express');
const { proxyRequest } = require('../utils/proxy');
const router = express.Router();

const SERVICE_URL = process.env.ORDER_SERVICE_URL;

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Order created
 */
router.post('/', (req, res) => proxyRequest(req, res, SERVICE_URL));

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 */
router.get('/:id', (req, res) => proxyRequest(req, res, SERVICE_URL));

router.get('/user/:userId', (req, res) => proxyRequest(req, res, SERVICE_URL));
router.put('/:id/status', (req, res) => proxyRequest(req, res, SERVICE_URL));
router.delete('/:id', (req, res) => proxyRequest(req, res, SERVICE_URL));

module.exports = router;
