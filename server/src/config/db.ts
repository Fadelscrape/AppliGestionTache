import mongoose from 'mongoose';
import { env } from './env';

const globalWithMongoose = global as typeof global & {
  _mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
};

const cached = globalWithMongoose._mongoose ?? (globalWithMongoose._mongoose = { conn: null, promise: null });

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(env.MONGODB_URI, {
      dbName: env.MONGODB_DB,
      bufferCommands: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  }

  cached.conn = await cached.promise;
  console.log(`✅ MongoDB connecté (db: ${env.MONGODB_DB})`);
  return cached.conn;
}
