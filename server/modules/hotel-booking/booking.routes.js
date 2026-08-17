// Bookings aren't plain CRUD: creating one has to look up the room's rate,
// compute nights/total, and a status change has a side-effect on the room.
// This is the same shape as library-books/loan.routes.js in the reference
// project - custom routes sitting next to the generic CRUD ones.
const router = require("express").Router();
const requireAuth = require("../../core/auth/auth.middleware");
const requireRole = require("../../core/rbac/requireRole");
const { logAction } = require("../../core/audit/auditLogger");
const Room = require("./room.model");
const Booking = require("./booking.model");

function nightsBetween(checkIn, checkOut) {
  const ms = new Date(checkOut) - new Date(checkIn);
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

// GET /api/hotel-booking/bookings - front desk / admin see everything
router.get("/", requireAuth, requireRole(["frontdesk"]), async (req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 });
  res.json({ data: bookings });
});

// GET /api/hotel-booking/bookings/mine - a logged-in guest's own bookings
router.get("/mine", requireAuth, requireRole(["guest"]), async (req, res) => {
  const bookings = await Booking.find({ guestUserId: req.user.userId }).sort({ createdAt: -1 });
  res.json({ data: bookings });
});

// GET /api/hotel-booking/bookings/:id
router.get("/:id", requireAuth, requireRole(["frontdesk"]), async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Booking not found" } });
  res.json({ data: booking });
});

// POST /api/hotel-booking/bookings - front desk (walk-in) or a guest (self-service)
router.post("/", requireAuth, requireRole(["frontdesk", "guest"]), async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate } = req.body;
    let { guestName, guestEmail } = req.body;

    if (!roomId || !checkInDate || !checkOutDate) {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "roomId, checkInDate, checkOutDate are required" } });
    }

    const nights = nightsBetween(checkInDate, checkOutDate);
    if (nights <= 0) {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "checkOutDate must be after checkInDate" } });
    }

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Room not found" } });
    if (room.status !== "available") {
      return res.status(409).json({ error: { code: "CONFLICT", message: `Room ${room.roomNumber} is not available` } });
    }

    // A logged-in guest can only ever book for themself.
    let guestUserId = null;
    if (req.user.role === "guest") {
      guestUserId = req.user.userId;
      guestName = req.user.name;
    }

    const booking = await Booking.create({
      guestName,
      guestEmail,
      guestUserId,
      roomId: room._id,
      roomNumber: room.roomNumber,
      checkInDate,
      checkOutDate,
      nights,
      totalAmount: nights * room.rate,
      status: "confirmed",
    });

    await logAction(req.user, "CREATE", "Booking", booking._id);
    res.status(201).json({ data: booking });
  } catch (err) {
    res.status(400).json({ error: { code: "VALIDATION_ERROR", message: err.message } });
  }
});

// PUT /api/hotel-booking/bookings/:id - status changes (check-in / check-out / cancel)
// side-effect: keeps the room's status in sync with the booking's status.
router.put("/:id", requireAuth, requireRole(["frontdesk"]), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Booking not found" } });

    const { status } = req.body;
    if (status) booking.status = status;
    await booking.save();

    if (status === "checked-in") {
      await Room.findByIdAndUpdate(booking.roomId, { status: "occupied" });
    } else if (status === "checked-out" || status === "cancelled") {
      await Room.findByIdAndUpdate(booking.roomId, { status: "available" });
    }

    await logAction(req.user, "UPDATE", "Booking", booking._id);
    res.json({ data: booking });
  } catch (err) {
    res.status(400).json({ error: { code: "VALIDATION_ERROR", message: err.message } });
  }
});

// DELETE /api/hotel-booking/bookings/:id - admin only in practice (requireRole([]) + admin bypass)
router.delete("/:id", requireAuth, requireRole([]), async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Booking not found" } });
  await logAction(req.user, "DELETE", "Booking", req.params.id);
  res.json({ data: { id: req.params.id } });
});

module.exports = router;
