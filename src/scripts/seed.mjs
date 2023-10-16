import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import seedDatabase from '../lib/seed.ts';

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  const client = new MongoClient(uri);

  try {
    console.log('Attempting to connect to MongoDB...');
    await client.connect();
    console.log('Successfully connected to MongoDB!');
    
    const database = client.db();
    const collections = await database.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  } finally {
    await client.close();
  }
}

async function main() {
  try {
    console.log('Testing database connection...');
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('Failed to connect to database. Aborting seed process.');
      process.exit(1);
    }

    console.log('Proceeding with database seed...');
    const result = await seedDatabase();
    console.log('Seeding completed successfully:', result);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

main(); #  
#  
