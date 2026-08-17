const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    guestName: { type: String, required: true, trim: true },
    guestEmail: { type: String, trim: true, lowercase: true },
    // Set automatically when a logged-in "guest" role user books for themself.
    // Left null for walk-in bookings front desk creates on a guest's behalf.
    guestUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    roomNumber: { type: String, required: true }, // denormalized for easy display

    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    nights: { type: Number, required: true },
    totalAmount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["confirmed", "checked-in", "checked-out", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
