import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod;

export const connectDB = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  console.log(`✅ MongoDB Memory Server connected: ${uri}`);
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
};
