const mongoose = require('mongoose');
require('dotenv').config();

const dbPassword = process.env.DB_PASSWORD;
const dbURI = `mongodb+srv://sakshigoud44:${dbPassword}@cluster0.4r8d1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0wa`;

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;