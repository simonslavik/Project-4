const express = require('express');
const { proxyRequest } = require('../utils/proxy');
const router = express.Router();

const SERVICE_URL = process.env.DELIVERY_SERVICE_URL;

router.post('/', (req, res) => proxyRequest(req, res, SERVICE_URL));
router.get('/:id', (req, res) => proxyRequest(req, res, SERVICE_URL));
router.put('/:id', (req, res) => proxyRequest(req, res, SERVICE_URL));
router.get('/order/:orderId', (req, res) => proxyRequest(req, res, SERVICE_URL));

module.exports = router;
