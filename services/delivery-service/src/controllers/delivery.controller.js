const Delivery = require('../models/Delivery');
const { publishEvent } = require('../messaging/rabbitmq');

const createDelivery = async (req, res) => {
  try {
    const delivery = new Delivery(req.body);
    await delivery.save();
    
    await publishEvent('delivery.created', delivery);
    
    res.status(201).json({ data: delivery });
  } catch (error) {
    console.error('Error creating delivery:', error);
    res.status(500).json({ error: 'Failed to create delivery' });
  }
};

const getDeliveryById = async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await Delivery.findById(id);
    
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }
    
    res.json({ data: delivery });
  } catch (error) {
    console.error('Error fetching delivery:', error);
    res.status(500).json({ error: 'Failed to fetch delivery' });
  }
};

const getDeliveryByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const delivery = await Delivery.findOne({ orderId });
    
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }
    
    res.json({ data: delivery });
  } catch (error) {
    console.error('Error fetching delivery:', error);
    res.status(500).json({ error: 'Failed to fetch delivery' });
  }
};

const updateDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const delivery = await Delivery.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }
    
    // Publish status change event
    if (updates.status) {
      await publishEvent(`delivery.${updates.status}`, delivery);
    }
    
    res.json({ data: delivery });
  } catch (error) {
    console.error('Error updating delivery:', error);
    res.status(500).json({ error: 'Failed to update delivery' });
  }
};

const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { latitude, longitude } = req.body;
    
    const delivery = await Delivery.findByIdAndUpdate(
      id,
      {
        currentLocation: {
          latitude,
          longitude,
          lastUpdated: new Date(),
        },
      },
      { new: true }
    );
    
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }
    
    await publishEvent('delivery.location.updated', {
      deliveryId: id,
      orderId: delivery.orderId,
      location: { latitude, longitude },
    });
    
    res.json({ data: delivery });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
};

module.exports = {
  createDelivery,
  getDeliveryById,
  getDeliveryByOrder,
  updateDelivery,
  updateLocation,
};
