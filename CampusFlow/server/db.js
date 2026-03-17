mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed (Check your credentials/IP whitelist): ${error.message}`);
    console.log(`Server will continue to run, but DB features will fail.`);
  }
};

module.exports = connectDB;
