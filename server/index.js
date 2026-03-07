import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import bikesRoutes from "./routes/bikes.js";
import rentalsRoutes from "./routes/rentals.js";
import adminRoutes from "./routes/admin.js";
import plansRoutes from "./routes/plans.js";

config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/bikes", bikesRoutes);
app.use("/api/rentals", rentalsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/plans", plansRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true }));

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
