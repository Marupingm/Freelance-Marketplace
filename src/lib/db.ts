import mongoose from 'mongoose';

declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

if (!process.env.MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable. ' +
    'Make sure you have a .env or .env.local file in your project root.'
  );
}

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  try {
    if (cached.conn) {
      console.log('Using cached MongoDB connection');
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      };

      console.log('Creating new MongoDB connection...');
      console.log('MongoDB URI exists:', !!process.env.MONGODB_URI);
      
      cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
        console.log('Successfully connected to MongoDB');
        return mongoose;
      });
    }

    try {
      cached.conn = await cached.promise;
    } catch (error) {
      cached.promise = null;
      console.error('Failed to establish MongoDB connection:', error);
      throw error;
    }

    return cached.conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Clear the cached promise if there's an error
    cached.promise = null;
    throw error;
  }
}

export default connectDB; //  
//  
