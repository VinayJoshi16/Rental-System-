/**
 * MongoDB initialization script
 * Creates collections and indexes for the Pedal Sync bike rental app.
 *
 * Usage: npm run db:init
 * Requires: MONGODB_URI in .env or environment
 *   (Use: node --env-file=.env scripts/init-mongodb.js for Node 20.6+)
 */

import { MongoClient } from "mongodb";
import { config } from "dotenv";

config(); // Load .env

const DB_NAME = "pedal-sync";
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is required. Add it to your .env file:");
  console.error("   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pedal-sync");
  process.exit(1);
}

async function initMongoDB() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);

    // --- bikes collection ---
    const bikesCollection = db.collection("bikes");
    await bikesCollection.createIndex({ status: 1 });
    await bikesCollection.createIndex({ type: 1 });
    await bikesCollection.createIndex({ created_at: -1 });
    await bikesCollection.createIndex({ name: "text", description: "text" });
    console.log("✓ bikes collection created with indexes");

    // --- rentals collection ---
    const rentalsCollection = db.collection("rentals");
    await rentalsCollection.createIndex({ user_id: 1 });
    await rentalsCollection.createIndex({ bike_id: 1 });
    await rentalsCollection.createIndex({ status: 1 });
    await rentalsCollection.createIndex({ created_at: -1 });
    await rentalsCollection.createIndex({ user_id: 1, status: 1 });
    console.log("✓ rentals collection created with indexes");

    // --- profiles collection ---
    const profilesCollection = db.collection("profiles");
    await profilesCollection.createIndex({ id: 1 }, { unique: true });
    console.log("✓ profiles collection created with indexes");

    // --- user_roles collection ---
    const userRolesCollection = db.collection("user_roles");
    await userRolesCollection.createIndex({ user_id: 1 });
    await userRolesCollection.createIndex({ user_id: 1, role: 1 }, { unique: true });
    console.log("✓ user_roles collection created with indexes");

    // --- users collection (for auth - if using custom auth) ---
    const usersCollection = db.collection("users");
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    console.log("✓ users collection created with indexes");

    console.log("\n✅ MongoDB initialization complete!");
    console.log("   Database:", DB_NAME);
    console.log("   Collections: bikes, rentals, profiles, user_roles, users");
  } catch (error) {
    console.error("❌ Initialization failed:", error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

initMongoDB();
