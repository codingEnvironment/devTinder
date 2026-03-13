const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://gmaheshreddy538_db_user:mahesh538@cluster0.9copg9c.mongodb.net/devTinder')
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process with failure
  }
}
module.exports = connectDB;