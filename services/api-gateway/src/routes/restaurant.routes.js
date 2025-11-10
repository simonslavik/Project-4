const express = require('express');
const { proxyRequest } = require('../utils/proxy');
const router = express.Router();

const SERVICE_URL = process.env.RESTAURANT_SERVICE_URL;

/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     summary: Get all restaurants
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: List of restaurants
 */
router.get('/', (req, res) => proxyRequest(req, res, SERVICE_URL));

/**
 * @swagger
 * /api/restaurants/{id}:
 *   get:
 *     summary: Get restaurant by ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant details
 */
router.get('/:id', (req, res) => proxyRequest(req, res, SERVICE_URL));

/**
 * @swagger
 * /api/restaurants:
 *   post:
 *     summary: Create a new restaurant
 *     tags: [Restaurants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Restaurant created
 */
router.post('/', (req, res) => proxyRequest(req, res, SERVICE_URL));

/**
 * @swagger
 * /api/restaurants/{id}:
 *   put:
 *     summary: Update restaurant
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant updated
 */
router.put('/:id', (req, res) => proxyRequest(req, res, SERVICE_URL));

/**
 * @swagger
 * /api/restaurants/{id}:
 *   delete:
 *     summary: Delete restaurant
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant deleted
 */
router.delete('/:id', (req, res) => proxyRequest(req, res, SERVICE_URL));

/**
 * @swagger
 * /api/restaurants/search:
 *   get:
 *     summary: Search restaurants
 *     tags: [Restaurants]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search', (req, res) => proxyRequest(req, res, SERVICE_URL));

module.exports = router;
