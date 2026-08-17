// Creates demo accounts + sample rooms so you can log in and test right away.
// Run with: npm run seed  (from the server/ directory)
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Room = require("../modules/hotel-booking/room.model");

const DEMO_PASSWORD = "password123";

async function upsertUser(name, email, role) {
  const existing = await User.findOne({ email });
  if (existing) return existing;
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  return User.create({ name, email, passwordHash, role });
}

async function upsertRoom(roomNumber, type, rate, status = "available") {
  const existing = await Room.findOne({ roomNumber });
  if (existing) return existing;
  return Room.create({ roomNumber, type, rate, status });
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB - seeding demo data...");

  await upsertUser("Admin", "admin@demo.com", "admin");
  await upsertUser("Front Desk", "frontdesk@demo.com", "frontdesk");
  await upsertUser("Demo Guest", "guest@demo.com", "guest");

  await upsertRoom("101", "Single", 60);
  await upsertRoom("102", "Single", 60);
  await upsertRoom("201", "Double", 90);
  await upsertRoom("202", "Double", 90, "maintenance");
  await upsertRoom("301", "Suite", 150);

  console.log("Done. Demo accounts (password: password123):");
  console.log("  admin@demo.com");
  console.log("  frontdesk@demo.com");
  console.log("  guest@demo.com");

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
