import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axiosClient";

const STATUS_OPTIONS = ["confirmed", "checked-in", "checked-out", "cancelled"];

// Editing a booking really means changing its status (check the guest in,
// check them out, or cancel) - the room's status is kept in sync
// server-side, so this page just shows the details and a status dropdown.
export default function BookingEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/hotel-booking/bookings/${id}`).then((res) => {
      setBooking(res.data.data);
      setStatus(res.data.data.status);
    });
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.put(`/hotel-booking/bookings/${id}`, { status });
      navigate("/bookings");
    } catch (err) {
      setError(err?.response?.data?.error?.message || "Something went wrong");
    }
  }

  if (!booking) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 480 }}>
      <h2>Booking — {booking.guestName}</h2>
      <p style={{ fontSize: 14, color: "#667" }}>
        Room {booking.roomNumber} · {new Date(booking.checkInDate).toLocaleDateString()} →{" "}
        {new Date(booking.checkOutDate).toLocaleDateString()} · {booking.nights} night(s) · ${booking.totalAmount}
      </p>

      <div className="form-group">
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {error && <p className="error-text">{error}</p>}
      <button className="btn" type="submit">Save</button>
    </form>
  );
}
