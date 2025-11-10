const { query } = require('../database');
const { publishEvent } = require('../messaging/rabbitmq');

const getAllRestaurants = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const result = await query(
      'SELECT * FROM restaurants WHERE is_active = true ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    res.json({ data: result.rows, count: result.rowCount });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM restaurants WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    
    res.json({ data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ error: 'Failed to fetch restaurant' });
  }
};

const createRestaurant = async (req, res) => {
  try {
    const { name, description, address, phone, email, cuisine_type, opening_hours } = req.body;
    
    const result = await query(
      `INSERT INTO restaurants (name, description, address, phone, email, cuisine_type, opening_hours)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, description, address, phone, email, cuisine_type, JSON.stringify(opening_hours)]
    );
    
    const restaurant = result.rows[0];
    
    // Publish event
    await publishEvent('restaurant.created', restaurant);
    
    res.status(201).json({ data: restaurant });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({ error: 'Failed to create restaurant' });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, address, phone, email, cuisine_type, opening_hours, is_active } = req.body;
    
    const result = await query(
      `UPDATE restaurants 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           address = COALESCE($3, address),
           phone = COALESCE($4, phone),
           email = COALESCE($5, email),
           cuisine_type = COALESCE($6, cuisine_type),
           opening_hours = COALESCE($7, opening_hours),
           is_active = COALESCE($8, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [name, description, address, phone, email, cuisine_type, opening_hours ? JSON.stringify(opening_hours) : null, is_active, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    
    const restaurant = result.rows[0];
    await publishEvent('restaurant.updated', restaurant);
    
    res.json({ data: restaurant });
  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({ error: 'Failed to update restaurant' });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      'UPDATE restaurants SET is_active = false WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    
    await publishEvent('restaurant.deleted', { id });
    
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    res.status(500).json({ error: 'Failed to delete restaurant' });
  }
};

const searchRestaurants = async (req, res) => {
  try {
    const { q, cuisine_type } = req.query;
    
    let queryText = 'SELECT * FROM restaurants WHERE is_active = true';
    const params = [];
    
    if (q) {
      params.push(`%${q}%`);
      queryText += ` AND (name ILIKE $${params.length} OR description ILIKE $${params.length})`;
    }
    
    if (cuisine_type) {
      params.push(cuisine_type);
      queryText += ` AND cuisine_type = $${params.length}`;
    }
    
    queryText += ' ORDER BY rating DESC, name ASC';
    
    const result = await query(queryText, params);
    res.json({ data: result.rows, count: result.rowCount });
  } catch (error) {
    console.error('Error searching restaurants:', error);
    res.status(500).json({ error: 'Failed to search restaurants' });
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  searchRestaurants,
};
