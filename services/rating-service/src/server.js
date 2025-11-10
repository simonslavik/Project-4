const app = require('./app');
const { connectDatabase } = require('./database');
const { connectRabbitMQ, subscribeToDeliveryEvents } = require('./messaging/rabbitmq');

const PORT = process.env.PORT || 3005;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();
    console.log('✅ MongoDB connected');

    // Connect to RabbitMQ
    await connectRabbitMQ();
    await subscribeToDeliveryEvents();
    console.log('✅ RabbitMQ connected');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Rating Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
