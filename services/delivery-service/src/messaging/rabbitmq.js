const amqp = require('amqplib');
const Delivery = require('../models/Delivery');

let connection = null;
let channel = null;

const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    
    await channel.assertExchange('delivery_events', 'topic', { durable: true });
    
    console.log('✅ RabbitMQ connected - Delivery Service');
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
      service: 'delivery-service',
    };
    
    channel.publish(
      'delivery_events',
      eventType,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
    
    console.log(`📤 Event published: ${eventType}`);
  } catch (error) {
    console.error('Error publishing event:', error);
  }
};

const subscribeToOrderEvents = async () => {
  try {
    if (!channel) {
      console.warn('RabbitMQ channel not ready');
      return;
    }
    
    // Subscribe to order events
    const queue = await channel.assertQueue('delivery_order_events', { durable: true });
    
    await channel.bindQueue(queue.queue, 'order_events', 'order.ready');
    
    channel.consume(queue.queue, async (msg) => {
      if (msg) {
        const event = JSON.parse(msg.content.toString());
        console.log(`📥 Received event: ${event.eventType}`, event.data);
        
        // Auto-create delivery when order is ready
        if (event.eventType === 'order.ready') {
          try {
            const delivery = new Delivery({
              orderId: event.data.id,
              restaurantAddress: event.data.restaurant_address || 'Restaurant Address',
              deliveryAddress: event.data.delivery_address,
              status: 'pending',
            });
            
            await delivery.save();
            await publishEvent('delivery.created', delivery);
            
            console.log(`✅ Auto-created delivery for order ${event.data.id}`);
          } catch (error) {
            console.error('Error auto-creating delivery:', error);
          }
        }
        
        channel.ack(msg);
      }
    });
    
    console.log('✅ Subscribed to order events');
  } catch (error) {
    console.error('Error subscribing to events:', error);
  }
};

module.exports = {
  connectRabbitMQ,
  publishEvent,
  subscribeToOrderEvents,
};
