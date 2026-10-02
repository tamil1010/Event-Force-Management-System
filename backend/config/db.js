const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/event_force_db';
    
    // Mask sensitive credentials in console output
    const maskedUri = connStr.replace(/\/\/(.*):(.*)@/, '//***:***@');
    console.log(`Connecting to MongoDB: ${maskedUri}`);

    const conn = await mongoose.connect(connStr);

    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error(`Please verify MONGODB_URI environment variable in your deployment dashboard (Render) or local .env file.`);
    
    // In production, log error clearly
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
