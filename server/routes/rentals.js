import { Router } from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

function toRental(doc, bike = null) {
  if (!doc) return null;
  const r = {
    id: doc._id.toString(),
    user_id: doc.user_id,
    bike_id: doc.bike_id,
    status: doc.status,
    start_time: doc.start_time,
    end_time: doc.end_time || null,
    total_cost: doc.total_cost ?? null,
    created_at: doc.created_at || null,
  };
  if (bike) r.bikes = bike;
  return r;
}

router.get("/", authMiddleware, async (req, res) => {
  try {
    const db = await getDB();
    const rentals = await db
      .collection("rentals")
      .find({ user_id: req.user.sub.toString() })
      .sort({ created_at: -1 })
      .toArray();
    const bikeIds = [...new Set(rentals.map((r) => r.bike_id).filter(Boolean))];
    const validIds = bikeIds.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id));
    const bikes = validIds.length ? await db.collection("bikes").find({ _id: { $in: validIds } }).toArray() : [];
    const bikeMap = Object.fromEntries(
      bikes.map((b) => [
        b._id.toString(),
        {
          id: b._id.toString(),
          name: b.name,
          type: b.type,
          hourly_rate: b.hourly_rate,
          status: b.status,
        },
      ])
    );
    const result = rentals.map((r) => {
      const bike = bikeMap[r.bike_id];
      return toRental(r, bike);
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch rentals" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const db = await getDB();
    const user = await db.collection("users").findOne({ _id: new ObjectId(req.user.sub) });
    const plan = user?.plan || "basic";
    if (!["basic", "pro", "premium"].includes(plan)) {
      return res.status(403).json({ error: "Please choose a plan to rent bikes. Visit Plans to get started." });
    }
    const { bike_id, aadhar_card, license_number } = req.body;
    if (!bike_id) return res.status(400).json({ error: "bike_id required" });
    if (!aadhar_card) return res.status(400).json({ error: "Aadhar card number required" });
    if (!license_number) return res.status(400).json({ error: "License number required" });

    // Indian DL format validation: e.g. "MH03 20080022135"
    // Expected: 2 letters (state) + 2 digits (RTO) + space + 11 digits (year + serial)
    const rawDl = String(license_number).toUpperCase().trim();
    const displayExample = "MH03 20080022135";

    const rawPattern = /^[A-Z]{2}\d{2}\s\d{11}$/;
    if (!rawPattern.test(rawDl)) {
      return res.status(400).json({
        error:
          `Invalid driving licence number format. Example: ${displayExample} (2 letters, 2 digits, space, 11 digits).`,
      });
    }

    const dl = rawDl.replace(/\s+/g, "");
    const stateCode = dl.slice(0, 2);
    const rtoCode = dl.slice(2, 4);
    const yearPart = dl.slice(4, 8);

    const validStates = [
      "AN","AP","AR","AS","BR","CH","CG","DD","DL","DN","GA","GJ","HP","HR","JH","JK","KA","KL","LA","LD",
      "MH","ML","MN","MP","MZ","NL","OD","PB","PY","RJ","SK","TN","TR","TS","UK","UP","WB"
    ];

    const rtoNum = Number(rtoCode);
    const yearNum = Number(yearPart);
    const currentYear = new Date().getFullYear();

    if (
      !validStates.includes(stateCode) ||
      !Number.isInteger(rtoNum) ||
      rtoNum < 1 ||
      rtoNum > 99 ||
      !Number.isInteger(yearNum) ||
      yearNum < 1950 ||
      yearNum > currentYear + 1
    ) {
      return res.status(400).json({
        error:
          `Driving licence number is not valid. Please enter it exactly as on the card, e.g. ${displayExample}.`,
      });
    }
    const oid = ObjectId.isValid(bike_id) ? new ObjectId(bike_id) : null;
    if (!oid) return res.status(400).json({ error: "Invalid bike id" });
    const bike = await db.collection("bikes").findOne({ _id: oid });
    if (!bike) return res.status(404).json({ error: "Bike not found" });
    if (bike.status !== "available") {
      return res.status(400).json({ error: "This bike is no longer available" });
    }
    const now = new Date().toISOString();
    const bikeIdStr = bike._id.toString();
    const normalizedAadhar =
      typeof aadhar_card === "string" ? aadhar_card.replace(/\D/g, "").slice(0, 12) : undefined;
    const normalizedLicense = dl;

    const rentalResult = await db.collection("rentals").insertOne({
      user_id: req.user.sub,
      bike_id: bikeIdStr,
      status: "active",
      start_time: now,
      end_time: null,
      total_cost: null,
      created_at: now,
      ...(normalizedAadhar && { aadhar_card: normalizedAadhar }),
      ...(normalizedLicense && { license_number: normalizedLicense }),
    });
    await db.collection("bikes").updateOne(
      { _id: oid },
      { $set: { status: "rented", updated_at: now } }
    );
    const rental = await db.collection("rentals").findOne({ _id: rentalResult.insertedId });
    const bikeDoc = { id: bike._id.toString(), name: bike.name, type: bike.type, hourly_rate: bike.hourly_rate, status: bike.status };
    res.status(201).json(toRental(rental, bikeDoc));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create rental" });
  }
});

router.patch("/:id/return", authMiddleware, async (req, res) => {
  try {
    const db = await getDB();
    const { id } = req.params;
    const oid = ObjectId.isValid(id) ? new ObjectId(id) : null;
    if (!oid) return res.status(400).json({ error: "Invalid rental id" });
    const rental = await db.collection("rentals").findOne({ _id: oid, user_id: req.user.sub });
    if (!rental) return res.status(404).json({ error: "Rental not found" });
    if (rental.status !== "active") {
      return res.status(400).json({ error: "Rental already completed" });
    }
    const bike = await db.collection("bikes").findOne({ _id: new ObjectId(rental.bike_id) });
    if (!bike) return res.status(404).json({ error: "Bike not found" });
    const startTime = new Date(rental.start_time).getTime();
    const endTime = Date.now();
    const hours = Math.ceil((endTime - startTime) / (1000 * 60 * 60));
    const totalCost = hours * Number(bike.hourly_rate);
    const now = new Date().toISOString();
    await db.collection("rentals").updateOne(
      { _id: oid },
      { $set: { end_time: now, total_cost: totalCost, status: "completed" } }
    );
    await db.collection("bikes").updateOne(
      { _id: new ObjectId(rental.bike_id) },
      { $set: { status: "available", updated_at: now } }
    );
    res.json({ totalCost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to return bike" });
  }
});

export default router;
