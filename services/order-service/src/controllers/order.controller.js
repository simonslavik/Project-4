const { query } = require('../database');
const { publishEvent } = require('../messaging/rabbitmq');

const createOrder = async (req, res) => {
  try {
    const { 
      user_id, 
      restaurant_id, 
      items, 
      delivery_address, 
      delivery_instructions,
      payment_method 
    } = req.body;
    
    // Calculate total amount
    const total_amount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const result = await query(
      `INSERT INTO orders (user_id, restaurant_id, items, total_amount, delivery_address, delivery_instructions, payment_method, status, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', 'pending')
       RETURNING *`,
      [user_id, restaurant_id, JSON.stringify(items), total_amount, delivery_address, delivery_instructions, payment_method]
    );
    
    const order = result.rows[0];
    
    // Publish event
    await publishEvent('order.created', order);
    
    res.status(201).json({ data: order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM orders WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({ data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, offset = 0 } = req.query;
    
    const result = await query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [userId, limit, offset]
    );
    
    res.json({ data: result.rows, count: result.rowCount });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const result = await query(
      `UPDATE orders 
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = result.rows[0];
    
    // Publish event
    await publishEvent(`order.${status}`, order);
    
    res.json({ data: order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      `UPDATE orders 
       SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND status IN ('pending', 'confirmed')
       RETURNING *`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found or cannot be cancelled' });
    }
    
    const order = result.rows[0];
    await publishEvent('order.cancelled', order);
    
    res.json({ message: 'Order cancelled successfully', data: order });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  cancelOrder,
};
