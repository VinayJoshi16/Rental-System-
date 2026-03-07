import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDB } from "../db.js";
import { authMiddleware, JWT_SECRET } from "../middleware/auth.js";

const router = Router();

function toUserResponse(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    plan: user.plan || "basic",
    user_metadata: { full_name: user.full_name || null },
  };
}

router.post("/register", async (req, res) => {
  try {
    const db = await getDB();
    const { email, password, fullName } = req.body;
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
    const user = { _id: result.insertedId, email: email.toLowerCase(), full_name: fullName || null, plan: "basic" };
    await db.collection("profiles").insertOne({
      id: result.insertedId.toString(),
      full_name: fullName || null,
      phone: null,
      created_at: now,
      updated_at: now,
    });
    await db.collection("user_roles").insertOne({
      user_id: result.insertedId.toString(),
      role: "user",
    });
    const token = jwt.sign(
      { sub: result.insertedId.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ user: toUserResponse(user), token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const db = await getDB();
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await db.collection("users").findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign(
      { sub: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      user: toUserResponse({ _id: user._id, email: user.email, full_name: user.full_name, plan: user.plan }),
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const db = await getDB();
    const { ObjectId } = await import("mongodb");
    const user = await db.collection("users").findOne({ _id: new ObjectId(req.user.sub) });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(toUserResponse({ _id: user._id, email: user.email, full_name: user.full_name, plan: user.plan }));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get user" });
  }
});

router.get("/is-admin", authMiddleware, async (req, res) => {
  try {
    const db = await getDB();
    const role = await db.collection("user_roles").findOne({
      user_id: req.user.sub,
      role: "admin",
    });
    res.json({ isAdmin: !!role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to check admin" });
  }
});

export default router;
