const amqp = require('amqplib');

let connection = null;
let channel = null;

const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    
    await channel.assertExchange('rating_events', 'topic', { durable: true });
    
    console.log('✅ RabbitMQ connected - Rating Service');
    return channel;
  } catch (error) {
    console.error('❌ RabbitMQ connection error:', error);
    setTimeout(connectRabbitMQ, 5000);
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
      service: 'rating-service',
    };
    
    channel.publish(
      'rating_events',
      eventType,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
    
    console.log(`📤 Event published: ${eventType}`);
  } catch (error) {
    console.error('Error publishing event:', error);
  }
};

const subscribeToDeliveryEvents = async () => {
  try {
    if (!channel) {
      console.warn('RabbitMQ channel not ready');
      return;
    }
    
    // Subscribe to delivery completed events
    const queue = await channel.assertQueue('rating_delivery_events', { durable: true });
    
    await channel.bindQueue(queue.queue, 'delivery_events', 'delivery.delivered');
    
    channel.consume(queue.queue, async (msg) => {
      if (msg) {
        const event = JSON.parse(msg.content.toString());
        console.log(`📥 Received event: ${event.eventType}`, event.data);
        
        // Handle delivery completed - could trigger rating request notification
        if (event.eventType === 'delivery.delivered') {
          console.log(`✉️ Delivery ${event.data.orderId} completed - ready for rating`);
          // Here you could trigger a notification to the user to rate the order
        }
        
        channel.ack(msg);
      }
    });
    
    console.log('✅ Subscribed to delivery events');
  } catch (error) {
    console.error('Error subscribing to events:', error);
  }
};

module.exports = {
  connectRabbitMQ,
  publishEvent,
  subscribeToDeliveryEvents,
};
