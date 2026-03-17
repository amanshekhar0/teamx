const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
    console.log('Connected to MongoDB');

    const email = 'amanshekar000@gmail.com';
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log('Admin user already exists. Updating password to "aman"...');
      existingUser.password = 'aman';
      await existingUser.save();
    } else {
      console.log('Creating new admin user...');
      await User.create({
        name: 'Aman Admin',
        email: email,
        password: 'aman'
      });
    }

    console.log('Admin seeding successful!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedAdmin();
