const mongoose = require('mongoose');

const uri = 'mongodb+srv://campusflow:campusflow@campus.wc8hkhe.mongodb.net/';

async function testConnection() {
  console.log('Attempting to connect to MongoDB Atlas...');
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ SUCCESS: Connected to MongoDB successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ FAILED:');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    if (error.reason) {
        console.error('Reason:', error.reason);
    }
    process.exit(1);
  }
}

testConnection();
