const express = require('express');
const { proxyRequest } = require('../utils/proxy');
const router = express.Router();

const SERVICE_URL = process.env.RATING_SERVICE_URL;

router.post('/', (req, res) => proxyRequest(req, res, SERVICE_URL));
router.get('/restaurant/:restaurantId', (req, res) => proxyRequest(req, res, SERVICE_URL));
router.get('/delivery/:deliveryId', (req, res) => proxyRequest(req, res, SERVICE_URL));
router.get('/:id', (req, res) => proxyRequest(req, res, SERVICE_URL));

module.exports = router;
