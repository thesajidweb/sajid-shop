import mongoose, { Connection } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

// Flag to check if we're in build time
const isBuildTime =
  process.env.NEXT_PHASE === "phase-production-build" ||
  (process.env.NODE_ENV === "production" && !MONGODB_URL);

// Only validate MONGODB_URL when not in build time
if (!isBuildTime && !MONGODB_URL) {
  throw new Error("❌ MONGODB_URL is not defined in environment variables");
}

/**
 * Global cache to prevent multiple DB connections
 * in development & serverless environments
 */
interface MongooseCache {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis.mongooseCache ?? {
  conn: null,
  promise: null,
};

globalThis.mongooseCache = cached;

/**
 * Connect to MongoDB (Production Safe)
 */
export async function connectToDB(): Promise<Connection | null> {
  if (isBuildTime) return null;
  
  // Reuse existing connection
  if (cached.conn) {
    return cached.conn;
  }
  
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URL as string, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,  // 👈 Add this
        connectTimeoutMS: 10000,  // 👈 Add this
        maxPoolSize: 10,
        minPoolSize: 2,           // 👈 Add this (keep minimum connections)
        maxIdleTimeMS: 60000,     // 👈 Add this
      })
      .then((mongooseInstance) => {
        console.log("✅ MongoDB connected");
        return mongooseInstance.connection;
      })
      .catch((error) => {
        cached.promise = null;
        console.error("❌ MongoDB connection failed:", error);
        throw error;
      });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

// Helper to check if database is available
export function isDatabaseAvailable(): boolean {
  return !isBuildTime && !!MONGODB_URL;
}
