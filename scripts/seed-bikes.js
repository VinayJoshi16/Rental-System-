/**
 * Seed sample bikes, scooties, scooters and electric scooters for Pedal Sync.
 * Usage: npm run db:seed
 * Requires: MONGODB_URI in .env, and db:init already run.
 */

import { MongoClient } from "mongodb";
import { config } from "dotenv";

config();

const DB_NAME = "pedal-sync";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

const SAMPLE_BIKES = [
  { name: "Honda Activa 6G", type: "Scooty", description: "India’s favourite family scooter. Smooth, reliable and easy to ride.", hourly_rate: 6, location: "Downtown Station", status: "available", image_url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600" },
  { name: "Honda Activa 6G Deluxe", type: "Scooty", description: "Activa 6G with premium graphics and extra comfort features.", hourly_rate: 7, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600" },
  { name: "Honda Activa 6G Smart", type: "Scooty", description: "Smart key, better security and convenience for city rides.", hourly_rate: 7, location: "Downtown Station", status: "available", image_url: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600" },
  { name: "Honda Activa 125", type: "Scooty", description: "Refined 125cc engine for extra power on flyovers and long rides.", hourly_rate: 8, location: "Central Park East", status: "available", image_url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600" },
  { name: "Suzuki Access 125", type: "Scooty", description: "Comfortable seat and peppy 125cc engine. Great for daily use.", hourly_rate: 7, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600" },
  { name: "Suzuki Access 125 Special Edition", type: "Scooty", description: "Special Edition with stylish colours and chrome touches.", hourly_rate: 8, location: "Waterfront Pier", status: "available", image_url: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600" },
  { name: "TVS NTORQ 125", type: "Scooty", description: "Sporty scooter with digital console and great performance.", hourly_rate: 8, location: "Downtown Station", status: "available", image_url: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600" },
  { name: "TVS NTORQ 125 Race Edition", type: "Scooty", description: "Race graphics and brighter lights for an aggressive look.", hourly_rate: 9, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600" },
  { name: "TVS NTORQ 125 XP", type: "Scooty", description: "Performance-focused variant for riders who love extra power.", hourly_rate: 9, location: "Central Park East", status: "available", image_url: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600" },
  { name: "TVS XL100", type: "Scooty", description: "Reliable moped-style scooty, perfect for utility and small loads.", hourly_rate: 5, location: "Downtown Station", status: "available", image_url: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600" },
  { name: "TVS XL100 Comfort", type: "Scooty", description: "Extra comfortable seat and suspension for longer city runs.", hourly_rate: 5, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600" },
  { name: "TVS Jupiter", type: "Scooty", description: "Balanced family scooter with great mileage and storage.", hourly_rate: 6, location: "Central Park East", status: "available", image_url: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600" },
  { name: "TVS Jupiter ZX", type: "Scooty", description: "Jupiter with disc brake and premium styling.", hourly_rate: 7, location: "Downtown Station", status: "available", image_url: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600" },
  { name: "TVS Jupiter Classic", type: "Scooty", description: "Classic design, chrome mirrors and comfortable saddle.", hourly_rate: 7, location: "Waterfront Pier", status: "available", image_url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600" },
  { name: "Hero Pleasure Plus", type: "Scooty", description: "Lightweight scooter, easy to handle for all age groups.", hourly_rate: 5, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600" },
  { name: "Hero Maestro Edge 125", type: "Scooty", description: "Sharp design with 125cc engine and alloy wheels.", hourly_rate: 7, location: "Downtown Station", status: "available", image_url: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600" },
  { name: "Yamaha Ray ZR 125", type: "Scooty", description: "Youth-focused design and zippy performance.", hourly_rate: 8, location: "Central Park East", status: "available", image_url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600" },
  { name: "Yamaha Fascino 125", type: "Scooty", description: "Retro styled scooter with modern 125cc engine.", hourly_rate: 8, location: "Downtown Station", status: "available", image_url: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600" },
  { name: "Aprilia SR 125", type: "Scooty", description: "Sporty Italian scooter feel with sharp handling.", hourly_rate: 9, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600" },
  { name: "Aprilia SR 160", type: "Scooty", description: "Powerful 160cc scooter for performance lovers.", hourly_rate: 10, location: "Central Park East", status: "available", image_url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600" },
  // Bikes
  { name: "Hero Splendor Plus", type: "Bike", description: "Reliable commuter bike with great mileage.", hourly_rate: 10, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600" },
  { name: "Hero HF Deluxe", type: "Bike", description: "Affordable daily commuter bike.", hourly_rate: 8, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600" },
  { name: "Hero Glamour", type: "Bike", description: "Stylish commuter with smooth engine.", hourly_rate: 11, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600" },
  { name: "Hero Passion Pro", type: "Bike", description: "Comfortable commuter bike.", hourly_rate: 10, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600" },
  { name: "Hero Xtreme 160R", type: "Sports", description: "Sporty street bike with sharp design.", hourly_rate: 16, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600" },
  { name: "Honda Shine", type: "Bike", description: "Popular 125cc commuter with smooth ride.", hourly_rate: 12, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600" },
  { name: "Honda SP125", type: "Bike", description: "Premium commuter with digital meter.", hourly_rate: 12, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600" },
  { name: "Honda Unicorn", type: "Bike", description: "Refined engine with great comfort.", hourly_rate: 14, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600" },
  { name: "Honda Hornet 2.0", type: "Sports", description: "Aggressive street fighter.", hourly_rate: 16, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600" },
  { name: "Honda CB350", type: "Cruiser", description: "Retro styled cruiser with smooth engine.", hourly_rate: 22, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1611242320536-f12d3541249b?w=600" },
  { name: "Bajaj Platina", type: "Bike", description: "Mileage focused commuter bike.", hourly_rate: 9, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600" },
  { name: "Bajaj CT110", type: "Bike", description: "Durable commuter bike.", hourly_rate: 9, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600" },
  { name: "Bajaj Pulsar 125", type: "Sports", description: "Entry level sporty commuter.", hourly_rate: 12, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600" },
  { name: "Bajaj Pulsar 150", type: "Sports", description: "Legendary sporty commuter.", hourly_rate: 14, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600" },
  { name: "Bajaj Pulsar NS160", type: "Sports", description: "Street fighter with sporty handling.", hourly_rate: 16, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600" },
  { name: "Bajaj Pulsar NS200", type: "Sports", description: "Powerful naked street bike.", hourly_rate: 18, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600" },
  { name: "Bajaj Pulsar RS200", type: "Sports", description: "Fully faired sports bike.", hourly_rate: 20, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600" },
  { name: "Bajaj Dominar 250", type: "Sports", description: "Touring ready power bike.", hourly_rate: 22, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600" },
  { name: "Bajaj Dominar 400", type: "Sports", description: "Highway touring machine.", hourly_rate: 25, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600" },
  { name: "Bajaj Avenger 160", type: "Cruiser", description: "Comfortable cruiser bike.", hourly_rate: 16, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1592853598061-bb7f61e71a7f?w=600" },
  { name: "Royal Enfield Classic 350", type: "Cruiser", description: "Timeless retro cruiser.", hourly_rate: 22, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1611242320536-f12d3541249b?w=600" },
  { name: "Royal Enfield Bullet 350", type: "Cruiser", description: "Iconic thump machine.", hourly_rate: 22, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1611242320536-f12d3541249b?w=600" },
  { name: "Royal Enfield Meteor 350", type: "Cruiser", description: "Comfort oriented touring cruiser.", hourly_rate: 24, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1611242320536-f12d3541249b?w=600" },
  { name: "Royal Enfield Hunter 350", type: "Roadster", description: "Lightweight urban roadster.", hourly_rate: 20, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1611242320536-f12d3541249b?w=600" },
  { name: "Royal Enfield Himalayan", type: "Adventure", description: "Adventure touring motorcycle.", hourly_rate: 26, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1592853598061-bb7f61e71a7f?w=600" },
  { name: "Yamaha FZ-S", type: "Sports", description: "Stylish street fighter.", hourly_rate: 16, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=600" },
  { name: "Yamaha FZ-X", type: "Neo Retro", description: "Retro styled urban bike.", hourly_rate: 17, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=600" },
  { name: "Yamaha MT-15", type: "Sports", description: "Aggressive naked street bike.", hourly_rate: 18, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=600" },
  { name: "Yamaha R15", type: "Sports", description: "Track inspired sports bike.", hourly_rate: 20, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=600" },
  { name: "Yamaha R3", type: "Sports", description: "Twin cylinder performance bike.", hourly_rate: 30, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=600" },
  { name: "TVS Apache RTR 160", type: "Sports", description: "Street performance bike.", hourly_rate: 16, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600" },
  { name: "TVS Apache RTR 200", type: "Sports", description: "Race tuned street bike.", hourly_rate: 18, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600" },
  { name: "TVS Raider 125", type: "Bike", description: "Sporty commuter bike.", hourly_rate: 12, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600" },
  { name: "TVS Ronin", type: "Neo Retro", description: "Modern retro motorcycle.", hourly_rate: 18, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600" },
  { name: "TVS Sport", type: "Bike", description: "Lightweight commuter bike.", hourly_rate: 9, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600" },
  // Scooters
  { name: "Honda Activa", type: "Scooter", description: "India's most popular scooter.", hourly_rate: 10, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=600" },
  { name: "Honda Dio", type: "Scooter", description: "Sporty youth scooter.", hourly_rate: 10, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=600" },
  { name: "Honda Grazia", type: "Scooter", description: "Stylish premium scooter.", hourly_rate: 11, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=600" },
  { name: "TVS Jupiter", type: "Scooter", description: "Comfortable family scooter.", hourly_rate: 10, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=600" },
  { name: "TVS Ntorq 125", type: "Scooter", description: "Smart sporty scooter.", hourly_rate: 12, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=600" },
  { name: "Suzuki Access 125", type: "Scooter", description: "Refined and powerful scooter.", hourly_rate: 11, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=600" },
  { name: "Suzuki Burgman Street", type: "Scooter", description: "Maxi style comfortable scooter.", hourly_rate: 12, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=600" },
  { name: "Hero Pleasure Plus", type: "Scooter", description: "Lightweight city scooter.", hourly_rate: 9, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=600" },
  { name: "Hero Destini 125", type: "Scooter", description: "Comfort oriented scooter.", hourly_rate: 10, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=600" },
  { name: "Aprilia SR 160", type: "Scooter", description: "Performance oriented scooter.", hourly_rate: 15, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=600" },
  // Electric
  { name: "Ola S1", type: "Electric Scooter", description: "Smart electric scooter.", hourly_rate: 14, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=600" },
  { name: "Ola S1 Pro", type: "Electric Scooter", description: "High performance electric scooter.", hourly_rate: 15, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=600" },
  { name: "Ather 450X", type: "Electric Scooter", description: "Premium smart electric scooter.", hourly_rate: 16, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=600" },
  { name: "TVS iQube", type: "Electric Scooter", description: "Connected electric scooter.", hourly_rate: 14, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=600" },
  { name: "Bajaj Chetak Electric", type: "Electric Scooter", description: "Retro styled electric scooter.", hourly_rate: 15, location: "Central Depot", status: "available", image_url: "https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=600" },
];

async function seedBikes() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection("bikes");

    const now = new Date().toISOString();
    const docs = SAMPLE_BIKES.map((bike) => ({
      ...bike,
      created_at: now,
      updated_at: now,
    }));

    const result = await collection.insertMany(docs);
    console.log(`✅ Seeded ${result.insertedCount} vehicles successfully!`);
    console.log("   Run the app and visit /bikes to see them.");
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedBikes();
