import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axiosClient";
import { useAuth } from "../../../core/auth/AuthContext.jsx";

// Custom booking form (not the generic EntityForm) because creating a
// booking needs a room picker, date inputs, and a live nights/total
// preview - the same reasoning that made IssueBookPage custom in the
// library reference project.
export default function BookingFormPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isGuest = user?.role === "guest";

  const [rooms, setRooms] = useState([]);
  const [guestName, setGuestName] = useState(isGuest ? user.name : "");
  const [guestEmail, setGuestEmail] = useState(isGuest ? user.email || "" : "");
  const [roomId, setRoomId] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/hotel-booking/rooms").then((res) => {
      setRooms(res.data.data.filter((r) => r.status === "available"));
    });
  }, []);

  const selectedRoom = rooms.find((r) => r._id === roomId);
  const nights =
    checkInDate && checkOutDate
      ? Math.round((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24))
      : 0;
  const total = selectedRoom && nights > 0 ? nights * selectedRoom.rate : 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/hotel-booking/bookings", {
        guestName,
        guestEmail,
        roomId,
        checkInDate,
        checkOutDate,
      });
      navigate(isGuest ? "/my-bookings" : "/bookings");
    } catch (err) {
      setError(err?.response?.data?.error?.message || "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 480 }}>
      <h2>New Booking</h2>

      {!isGuest && (
        <>
          <div className="form-group">
            <label>Guest Name *</label>
            <input value={guestName} onChange={(e) => setGuestName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Guest Email</label>
            <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} />
          </div>
        </>
      )}

      <div className="form-group">
        <label>Room *</label>
        <select value={roomId} onChange={(e) => setRoomId(e.target.value)} required>
          <option value="" disabled>Select an available room...</option>
          {rooms.map((r) => (
            <option key={r._id} value={r._id}>
              {r.roomNumber} — {r.type} (${r.rate}/night)
            </option>
          ))}
        </select>
        {rooms.length === 0 && <p style={{ fontSize: 12, color: "#991b1b" }}>No rooms currently available.</p>}
      </div>

      <div className="form-group">
        <label>Check-in *</label>
        <input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Check-out *</label>
        <input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} required />
      </div>

      {nights > 0 && selectedRoom && (
        <p style={{ fontSize: 14, marginBottom: 14 }}>
          {nights} night{nights > 1 ? "s" : ""} × ${selectedRoom.rate} = <strong>${total}</strong>
        </p>
      )}

      {error && <p className="error-text">{error}</p>}
      <button className="btn" type="submit">Confirm Booking</button>
    </form>
  );
}
