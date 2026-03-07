import { Router } from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.post("/upgrade", authMiddleware, async (req, res) => {
  try {
    const db = await getDB();
    const { plan } = req.body;

    if (!plan || !["pro", "premium"].includes(plan)) {
      return res.status(400).json({ error: "Invalid plan. Choose 'pro' or 'premium'." });
    }

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(req.user.sub) },
      { $set: { plan, updated_at: new Date().toISOString() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, plan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upgrade failed" });
  }
});

export default router;
