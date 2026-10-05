import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (mongoUri) {
      const connection = await mongoose.connect(mongoUri);
      console.log(`MongoDB connected: ${connection.connection.host}`);
      return;
    }

    memoryServer = await MongoMemoryServer.create();
    const uri = memoryServer.getUri();
    const connection = await mongoose.connect(uri);

    console.log(`MongoDB connected: ${connection.connection.host} (memory server)`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export default connectDB;