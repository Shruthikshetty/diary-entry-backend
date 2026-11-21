import mongoose from "mongoose";

/**
 * connect to mongo db
 */
export async function ConnectDB() {
  // if already connected then return
  if (mongoose.connection.readyState === 1) {
    return;
  }
  // get uri from env
  const uri = process.env?.MONGO_URI || "";

  try {
    await mongoose.connect(uri);
  } catch {
    console.error("connection to db failed ");
    process.exit(1);
  }
}
