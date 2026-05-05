const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Try to connect to the provided URI first
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Error: ${error.message}`);
    
    // If we're on Vercel, don't use MongoMemoryServer as it requires downloading a binary which fails
    if (process.env.VERCEL) {
      console.error('❌ Cannot start In-Memory MongoDB on Vercel. Please provide a real MONGODB_URI.');
      return;
    }

    console.log('🔄 Starting local fallback: In-Memory MongoDB Server...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      await mongoose.connect(mongoUri);
      console.log(`✅ Local In-Memory MongoDB Connected!`);
    } catch (fallbackError) {
      console.error(`❌ Fatal: In-Memory Database also failed.`, fallbackError);
    }
  }
};

module.exports = connectDB;
