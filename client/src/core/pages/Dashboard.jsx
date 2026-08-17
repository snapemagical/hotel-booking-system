import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ rooms: null, available: null, activeBookings: null });

  useEffect(() => {
    async function loadCounts() {
      try {
        const roomsRes = await api.get("/hotel-booking/rooms");
        const rooms = roomsRes.data.data;

        let activeBookings = null;
        if (user.role === "guest") {
          const mineRes = await api.get("/hotel-booking/bookings/mine");
          activeBookings = mineRes.data.data.filter((b) => b.status === "confirmed" || b.status === "checked-in").length;
        } else {
          const bookingsRes = await api.get("/hotel-booking/bookings");
          activeBookings = bookingsRes.data.data.filter((b) => b.status === "confirmed" || b.status === "checked-in").length;
        }

        setCounts({
          rooms: rooms.length,
          available: rooms.filter((r) => r.status === "available").length,
          activeBookings,
        });
      } catch {
        // endpoint not accessible for this role - fine, just skip
      }
    }
    loadCounts();
  }, [user]);

  return (
    <div>
      <h2>Welcome, {user?.name}</h2>
      <div className="card-grid">
        <div className="card"><h3>Total Rooms</h3><p>{counts.rooms ?? "-"}</p></div>
        <div className="card"><h3>Available Now</h3><p>{counts.available ?? "-"}</p></div>
        <div className="card"><h3>{user.role === "guest" ? "My Active Bookings" : "Active Bookings"}</h3><p>{counts.activeBookings ?? "-"}</p></div>
      </div>
    </div>
  );
}
