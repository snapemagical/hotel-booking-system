import { useEffect, useState } from "react";
import api from "../../../api/axiosClient";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await api.get("/hotel-booking/bookings/mine");
    setBookings(res.data.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCancel(id) {
    if (!confirm("Cancel this booking?")) return;
    await api.put(`/hotel-booking/bookings/${id}`, { status: "cancelled" });
    load();
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>My Bookings</h2>
      <table>
        <thead>
          <tr><th>Room</th><th>Check-in</th><th>Check-out</th><th>Status</th><th>Total</th><th></th></tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b._id}>
              <td>{b.roomNumber}</td>
              <td>{new Date(b.checkInDate).toLocaleDateString()}</td>
              <td>{new Date(b.checkOutDate).toLocaleDateString()}</td>
              <td><span className={`badge ${b.status === "cancelled" ? "overdue" : "active"}`}>{b.status}</span></td>
              <td>${b.totalAmount}</td>
              <td>
                {b.status === "confirmed" && (
                  <a href="#" onClick={(e) => { e.preventDefault(); handleCancel(b._id); }}>Cancel</a>
                )}
              </td>
            </tr>
          ))}
          {bookings.length === 0 && <tr><td colSpan={6}>No bookings yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
