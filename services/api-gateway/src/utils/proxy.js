const axios = require('axios');

const proxyRequest = async (req, res, serviceUrl) => {
  try {
    const url = `${serviceUrl}${req.path}`;
    const config = {
      method: req.method,
      url: url,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers,
      },
      params: req.query,
      ...(req.body && Object.keys(req.body).length > 0 && { data: req.body }),
    };

    console.log(`🔀 Proxying ${req.method} ${url}`);
    
    const response = await axios(config);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`❌ Proxy error:`, error.message);
    
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      res.status(503).json({
        error: 'Service Unavailable',
        message: 'The requested service is not available',
      });
    } else {
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message,
      });
    }
  }
};

module.exports = { proxyRequest };
