import { Router } from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

function toBike(doc) {
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    name: doc.name,
    type: doc.type,
    description: doc.description || null,
    hourly_rate: doc.hourly_rate,
    image_url: doc.image_url || null,
    location: doc.location || null,
    status: doc.status || "available",
    created_at: doc.created_at || null,
    updated_at: doc.updated_at || null,
  };
}

router.get("/", async (req, res) => {
  try {
    const db = await getDB();
    const bikes = await db.collection("bikes").find().sort({ created_at: -1 }).toArray();
    res.json(bikes.map(toBike));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bikes" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const db = await getDB();
    const role = await db.collection("user_roles").findOne({
      user_id: req.user.sub,
      role: "admin",
    });
    if (!role) return res.status(403).json({ error: "Admin only" });
    const { name, type, description, hourly_rate, image_url, location } = req.body;
    if (!name || !type || hourly_rate == null) {
      return res.status(400).json({ error: "Name, type, and hourly_rate are required" });
    }
    const now = new Date().toISOString();
    const result = await db.collection("bikes").insertOne({
      name,
      type,
      description: description || null,
      hourly_rate: Number(hourly_rate),
      image_url: image_url || null,
      location: location || null,
      status: "available",
      created_at: now,
      updated_at: now,
    });
    const bike = await db.collection("bikes").findOne({ _id: result.insertedId });
    res.status(201).json(toBike(bike));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add bike" });
  }
});

router.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    const db = await getDB();
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "Status required" });
    const oid = ObjectId.isValid(id) ? new ObjectId(id) : null;
    if (!oid) return res.status(400).json({ error: "Invalid bike id" });
    await db.collection("bikes").updateOne(
      { _id: oid },
      { $set: { status, updated_at: new Date().toISOString() } }
    );
    const bike = await db.collection("bikes").findOne({ _id: oid });
    res.json(toBike(bike));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update bike" });
  }
});

export default router;
