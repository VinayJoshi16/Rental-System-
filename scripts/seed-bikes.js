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
  {
    name: "Honda Activa 6G",
    type: "Scooty",
    description:
      "India’s favourite family scooter. Smooth, reliable and easy to ride.",
    hourly_rate: 6,
    location: "Downtown Station",
    status: "available",
    image_url:
      "https://imgd.aeplcdn.com/1280x720/n/cw/ec/44686/activa-6g-right-front-three-quarter-3.jpeg?isig=0",
  },
  {
    name: "Honda Activa 6G Deluxe",
    type: "Scooty",
    description: "Activa 6G with premium graphics and extra comfort features.",
    hourly_rate: 7,
    location: "Central Depot",
    status: "available",
    image_url:
      "https://imgd.aeplcdn.com/1280x720/n/cw/ec/44686/activa-6g-right-front-three-quarter-3.jpeg?isig=0",
  },
  {
    name: "Honda Activa 6G Smart",
    type: "Scooty",
    description: "Smart key, better security and convenience for city rides.",
    hourly_rate: 7,
    location: "Downtown Station",
    status: "available",
    image_url:
      "https://imgd.aeplcdn.com/1280x720/n/cw/ec/44686/activa-6g-right-front-three-quarter-3.jpeg?isig=0",
  },
  {
    name: "Honda Activa 125",
    type: "Scooty",
    description:
      "Refined 125cc engine for extra power on flyovers and long rides.",
    hourly_rate: 8,
    location: "Central Park East",
    status: "available",
    image_url:
      "https://imgd.aeplcdn.com/1280x720/n/cw/ec/44686/activa-6g-right-front-three-quarter-3.jpeg?isig=0",
  },
  {
    name: "Suzuki Access 125",
    type: "Scooty",
    description:
      "Comfortable seat and peppy 125cc engine. Great for daily use.",
    hourly_rate: 7,
    location: "Central Depot",
    status: "available",
    image_url:
      "https://cdn.suzukimotorcycle.co.in/public-live/uploads/product-360-images/original/71/2.png",
  },
  {
    name: "Suzuki Access 125 Special Edition",
    type: "Scooty",
    description: "Special Edition with stylish colours and chrome touches.",
    hourly_rate: 8,
    location: "Waterfront Pier",
    status: "available",
    image_url:
      "https://imgd.aeplcdn.com/1280x720/n/cw/ec/44686/activa-6g-right-front-three-quarter-3.jpeg?isig=0",
  },
  {
    name: "TVS NTORQ 125",
    type: "Scooty",
    description: "Sporty scooter with digital console and great performance.",
    hourly_rate: 8,
    location: "Downtown Station",
    status: "available",
    image_url:
      "https://imgd.aeplcdn.com/664x374/n/cw/ec/102709/ntorq-125-right-front-three-quarter.jpeg?isig=0&q=80",
  },
  {
    name: "TVS NTORQ 125 Race Edition",
    type: "Scooty",
    description: "Race graphics and brighter lights for an aggressive look.",
    hourly_rate: 9,
    location: "Central Depot",
    status: "available",
    image_url: "https://imgd.aeplcdn.com/1056x594/n/u8v3seb_1777469.jpg?q=80",
  },
  {
    name: "TVS NTORQ 125 XP",
    type: "Scooty",
    description: "Performance-focused variant for riders who love extra power.",
    hourly_rate: 9,
    location: "Central Park East",
    status: "available",
    image_url: "https://www.tvsmotor.com/commuter/tvs-ntorq/ntorq-125/race-xp",
  },
  {
    name: "TVS XL100",
    type: "Scooty",
    description:
      "Reliable moped-style scooty, perfect for utility and small loads.",
    hourly_rate: 5,
    location: "Downtown Station",
    status: "available",
    image_url:
      "https://media.zigcdn.com/media/model/2025/Sep/tvs-xl100-heavy-duty-alloy-right-side-view_600x400.jpg",
  },
  {
    name: "TVS XL100 Comfort",
    type: "Scooty",
    description: "Extra comfortable seat and suspension for longer city runs.",
    hourly_rate: 5,
    location: "Central Depot",
    status: "available",
    image_url:
      "https://media.zigcdn.com/media/model/2025/Sep/tvs-xl100-heavy-duty-alloy-right-side-view_600x400.jpg",
  },
  {
    name: "TVS Jupiter",
    type: "Scooty",
    description: "Balanced family scooter with great mileage and storage.",
    hourly_rate: 6,
    location: "Central Park East",
    status: "available",
    image_url:
      "https://cdn.bikedekho.com/processedimages/tvs/jupiter/640X309/jupiter68bfb89bc0358.jpg",
  },
  {
    name: "TVS Jupiter ZX",
    type: "Scooty",
    description: "Jupiter with disc brake and premium styling.",
    hourly_rate: 7,
    location: "Downtown Station",
    status: "available",
    image_url:
      "https://cdn.bikedekho.com/processedimages/tvs/jupiter/640X309/jupiter68bfb89bc0358.jpg",
  },
  {
    name: "TVS Jupiter Classic",
    type: "Scooty",
    description: "Classic design, chrome mirrors and comfortable saddle.",
    hourly_rate: 7,
    location: "Waterfront Pier",
    status: "available",
    image_url:
      "https://cdn.bikedekho.com/processedimages/tvs/jupiter/640X309/jupiter68bfb89bc0358.jpg",
  },
  {
    name: "Hero Pleasure Plus",
    type: "Scooty",
    description: "Lightweight scooter, easy to handle for all age groups.",
    hourly_rate: 5,
    location: "Central Depot",
    status: "available",
    image_url:
      "https://www.heromotocorp.com/content/dam/hero-commerce/in/en/products/scooters/content-fragments/pleasure-plus-xtec/assets/new-theme/specification/mob-updated1.png",
  },

  // Bikes
  {
    name: "Royal Enfield Hunter 350",
    type: "Bike",
    description: "Compact and agile roadster perfect for city riding.",
    hourly_rate: 15,
    location: "Downtown Station",
    status: "available",
    image_url:
      "https://imgd.aeplcdn.com/1280x720//n/cw/ec/152455/royalenfield-hunter-350-right-side-view3.jpeg?isig=0&q=75",
  },

  {
    name: "Royal Enfield Classic 350",
    type: "Bike",
    description: "Iconic retro styled motorcycle with timeless design.",
    hourly_rate: 16,
    location: "Central Depot",
    status: "available",
    image_url:
      "https://imgd.aeplcdn.com/1280x720/n/cw/ec/183389/classic-350-right-front-three-quarter.jpeg?isig=0",
  },

  {
    name: "Royal Enfield Meteor 350",
    type: "Bike",
    description: "Comfortable cruiser designed for long highway rides.",
    hourly_rate: 17,
    location: "Central Park East",
    status: "available",
    image_url:
      "https://imgd.aeplcdn.com/664x374/n/cw/ec/1/versions/royalenfield-meteor-350-fireball1757944044825.jpg?q=80",
  },

  {
    name: "Royal Enfield Bullet 350",
    type: "Bike",
    description: "The longest running motorcycle design with legendary thump.",
    hourly_rate: 16,
    location: "Waterfront Pier",
    status: "available",
    image_url:
      "https://imgd.aeplcdn.com/1280x720/n/cw/ec/127499/bullet-350-next-gen-right-front-three-quarter.png?isig=0",
  },

  {
    name: "Royal Enfield Himalayan",
    type: "Bike",
    description:
      "Adventure touring motorcycle built for mountains and rough terrain.",
    hourly_rate: 18,
    location: "Downtown Station",
    status: "available",
    image_url:
      "https://cdn.bikedekho.com/processedimages/royal-enfield/himalayan-450/source/himalayan-45068a7118d1ae55.jpg?imwidth=412&impolicy=resize",
  },

  {
    name: "Royal Enfield Himalayan 450",
    type: "Bike",
    description: "Next generation adventure bike with powerful 450cc engine.",
    hourly_rate: 20,
    location: "Central Depot",
    status: "available",
    image_url:
      "https://cdn.bikedekho.com/processedimages/royal-enfield/himalayan-450/source/himalayan-45068a7118d1ae55.jpg?imwidth=412&impolicy=resize",
  },

  {
    name: "Royal Enfield Interceptor 650",
    type: "Bike",
    description: "Modern classic roadster with parallel twin engine.",
    hourly_rate: 22,
    location: "Central Park East",
    status: "available",
    image_url:
      "https://images.autox.com/uploads/2024/05/Modified-Royal-Enfield-Interceptor-650.jpg",
  },

  {
    name: "Royal Enfield Continental GT 650",
    type: "Bike",
    description: "Cafe racer inspired motorcycle with sporty riding position.",
    hourly_rate: 23,
    location: "Waterfront Pier",
    status: "available",
    image_url:
      "https://www.royalenfield.com/content/dam/royal-enfield-revamp/header/shop/configure/continental-gt-650.webp",
  },

  {
    name: "Royal Enfield Super Meteor 650",
    type: "Bike",
    description: "Premium cruiser with powerful twin cylinder engine.",
    hourly_rate: 25,
    location: "Downtown Station",
    status: "available",
    image_url:
      "https://www.indiacarnews.com/wp-content/uploads/2022/10/RE-Super-Meteor-650-Spied.jpg",
  },

  {
    name: "Royal Enfield Shotgun 650",
    type: "Bike",
    description: "Custom inspired bobber style motorcycle.",
    hourly_rate: 25,
    location: "Central Depot",
    status: "available",
    image_url:
      "https://imgd.aeplcdn.com/1280x720/n/cw/ec/165367/shotgun-650-right-front-three-quarter-2.jpeg?isig=0",
  },

  {
    name: "Royal Enfield Guerrilla 450",
    type: "Bike",
    description: "Street focused roadster based on the Himalayan 450 platform.",
    hourly_rate: 21,
    location: "Central Park East",
    status: "available",
    image_url:
      "https://images.timesdrive.in/thumb/msid-151002018,thumbsize-153874,width-450,height-254,resizemode-75/151002018.jpg",
  },
  // Electric
  {
    name: "Ola S1",
    type: "Electric Scooter",
    description: "Smart electric scooter.",
    hourly_rate: 14,
    location: "Central Depot",
    status: "available",
    image_url:
      "https://m.media-amazon.com/images/I/61cQeI4eFvL.jpg",
  },
  {
    name: "Ola S1 Pro",
    type: "Electric Scooter",
    description: "High performance electric scooter.",
    hourly_rate: 15,
    location: "Central Depot",
    status: "available",
    image_url:
      "https://etimg.etb2bimg.com/photo/88918407.cms",
  },
  {
    name: "Ather 450X",
    type: "Electric Scooter",
    description: "Premium smart electric scooter.",
    hourly_rate: 16,
    location: "Central Depot",
    status: "available",
    image_url:
      "https://assets.otocapital.in/production/cosmic-black-ather-450x-image.webp",
  },
  {
    name: "TVS iQube",
    type: "Electric Scooter",
    description: "Connected electric scooter.",
    hourly_rate: 14,
    location: "Central Depot",
    status: "available",
    image_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY2rSnSbB2-eNsMRNaPCA43gVMoGhmkq73nA&s",
  },
  {
    name: "Bajaj Chetak Electric",
    type: "Electric Scooter",
    description: "Retro styled electric scooter.",
    hourly_rate: 15,
    location: "Central Depot",
    status: "available",
    image_url:
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi2C-iz7cmZStFvo4R16MPGZ-6Eg_NuOvq8HSfYJC7Io3AtRx_6zdOpT_DQ8kCdqMCealECi4T3M5AvyLtzKyWqY79pfDPx4XbUUcig8BMo-V7hyphenhyphenSTst8a7FeXUmwccB54P6YrXqtmA82-E6wmNif4zN-4XAOqpDXn-nQSNFUbcarOPkcBl0RWJy2h0RNe6/s16000-rw/bajaj-chetak-electric-scooter.webp",
  },
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
