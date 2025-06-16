import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('🚨 Please define MONGODB_URI in .env.local');
}

// Caching because Next.js hot-reloads often
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!, {
      dbName: 'whyer',
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
