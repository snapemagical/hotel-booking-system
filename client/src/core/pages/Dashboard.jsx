import { useAuth } from "../auth/AuthContext.jsx";

// Generic placeholder - Phase 2 (hotel-booking module) will add real
// occupancy/booking counts here, the same way the library reference
// project's Dashboard queries its own module's endpoints.
export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div>
      <h2>Welcome, {user?.name}</h2>
      <p style={{ color: "#667" }}>
        This dashboard will show room availability and booking stats once the
        hotel-booking module is wired up.
      </p>
    </div>
  );
}
