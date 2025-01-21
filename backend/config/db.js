const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');
    
    // Initialize collections if they don't exist
    await Promise.all([
      mongoose.connection.db.collection('rewards'),
      mongoose.connection.db.collection('dashboards')
    ]);
    
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
