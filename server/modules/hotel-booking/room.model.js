const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true, trim: true },
    type: { type: String, enum: ["Single", "Double", "Suite"], required: true },
    rate: { type: Number, required: true }, // per night
    status: { type: String, enum: ["available", "occupied", "maintenance"], default: "available" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
