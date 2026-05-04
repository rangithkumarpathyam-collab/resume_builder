const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Try to connect to the provided URI first
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000, // Reduced timeout so it falls back quickly
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Error: ${error.message}`);
    console.log('🔄 Starting robust fallback: In-Memory MongoDB Server...');
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✅ Fallback In-Memory MongoDB Connected successfully!`);
    } catch (fallbackError) {
      console.error(`❌ Fatal: In-Memory Database also failed to start.`, fallbackError);
    }
  }
};

module.exports = connectDB;
