import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://khalipababa:khalipababa1989@chatterbox.cbs73ih.mongodb.net/chatterbox?retryWrites=true&w=majority&appName=Chatterbox";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export { mongoose };