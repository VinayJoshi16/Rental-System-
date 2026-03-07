import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { getDB } from "../db.js";
import { authMiddleware, JWT_SECRET } from "../middleware/auth.js";

const router = Router();

function toUserResponse(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    user_metadata: { full_name: user.full_name || null },
  };
}

router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const db = await getDB();
    const role = await db.collection("user_roles").findOne({
      user_id: req.user.sub,
      role: "admin",
    });
    if (!role) return res.status(403).json({ error: "Admin only" });
    const [totalBikes, activeRentals, totalUsers] = await Promise.all([
      db.collection("bikes").countDocuments(),
      db.collection("rentals").countDocuments({ status: "active" }),
      db.collection("users").countDocuments(),
    ]);
    res.json({ totalBikes, activeRentals, totalUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const db = await getDB();
    const { email, password, fullName, adminCode } = req.body;
    if (adminCode !== "ADMIN2024") {
      return res.status(400).json({ error: "Invalid admin code" });
    }
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const existing = await db.collection("users").findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: "User already exists with this email" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();
    const result = await db.collection("users").insertOne({
      email: email.toLowerCase(),
      password: hashed,
      full_name: fullName || null,
      plan: "basic",
      created_at: now,
      updated_at: now,
    });
    const userId = result.insertedId.toString();
    await db.collection("profiles").insertOne({
      id: userId,
      full_name: fullName || null,
      phone: null,
      created_at: now,
      updated_at: now,
    });
    await db.collection("user_roles").insertOne({ user_id: userId, role: "admin" });
    const user = { _id: result.insertedId, email: email.toLowerCase(), full_name: fullName || null };
    const token = jwt.sign(
      { sub: userId, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(201).json({ user: toUserResponse(user), token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Admin signup failed" });
  }
});

export default router;
