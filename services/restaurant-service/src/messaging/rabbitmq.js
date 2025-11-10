const amqp = require('amqplib');

let connection = null;
let channel = null;

const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    
    await channel.assertExchange('restaurant_events', 'topic', { durable: true });
    
    console.log('✅ RabbitMQ connected - Restaurant Service');
    return channel;
  } catch (error) {
    console.error('❌ RabbitMQ connection error:', error);
    setTimeout(connectRabbitMQ, 5000); // Retry after 5 seconds
  }
};

const publishEvent = async (eventType, data) => {
  try {
    if (!channel) {
      console.warn('RabbitMQ channel not ready, skipping event publish');
      return;
    }
    
    const message = {
      eventType,
      data,
      timestamp: new Date().toISOString(),
      service: 'restaurant-service',
    };
    
    channel.publish(
      'restaurant_events',
      eventType,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
    
    console.log(`📤 Event published: ${eventType}`);
  } catch (error) {
    console.error('Error publishing event:', error);
  }
};

module.exports = {
  connectRabbitMQ,
  publishEvent,
};
