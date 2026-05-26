import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDatabase() {
  if (!env.mongoUri) {
    throw new Error("MONGODB_URI is required to start the API server.");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongoUri);
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
