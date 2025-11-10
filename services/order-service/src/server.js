const app = require('./app');
const { initDatabase } = require('./database');
const { connectRabbitMQ, subscribeToEvents } = require('./messaging/rabbitmq');

const PORT = process.env.PORT || 3003;

const startServer = async () => {
  try {
    // Initialize database
    await initDatabase();
    console.log('✅ Database connected');

    // Connect to RabbitMQ
    await connectRabbitMQ();
    await subscribeToEvents();
    console.log('✅ RabbitMQ connected');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Order Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
