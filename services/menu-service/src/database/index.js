const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ MongoDB connected - Menu Service');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    setTimeout(connectDatabase, 5000); // Retry after 5 seconds
  }
};

module.exports = { connectDatabase };
