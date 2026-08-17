import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import api from "./api/axiosClient";
import DashboardShell from "./core/layout/DashboardShell.jsx";
import ProtectedRoute from "./core/auth/ProtectedRoute.jsx";
import LoginPage from "./core/auth/LoginPage.jsx";
import Dashboard from "./core/pages/Dashboard.jsx";
import Profile from "./core/pages/Profile.jsx";
import AuditLogPage from "./core/pages/AuditLogPage.jsx";
import NotFound from "./core/pages/NotFound.jsx";

import RoomListPage from "./modules/hotel-booking/ui/RoomListPage.jsx";
import RoomFormPage from "./modules/hotel-booking/ui/RoomFormPage.jsx";
import GuestListPage from "./modules/hotel-booking/ui/GuestListPage.jsx";
import GuestFormPage from "./modules/hotel-booking/ui/GuestFormPage.jsx";
import PaymentListPage from "./modules/hotel-booking/ui/PaymentListPage.jsx";
import PaymentFormPage from "./modules/hotel-booking/ui/PaymentFormPage.jsx";
import BookingListPage from "./modules/hotel-booking/ui/BookingListPage.jsx";
import BookingFormPage from "./modules/hotel-booking/ui/BookingFormPage.jsx";
import BookingEditPage from "./modules/hotel-booking/ui/BookingEditPage.jsx";
import MyBookingsPage from "./modules/hotel-booking/ui/MyBookingsPage.jsx";

export default function App() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    api.get("/config").then((res) => setConfig(res.data.data));
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <DashboardShell config={config}>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route
                  path="/audit-log"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AuditLogPage />
                    </ProtectedRoute>
                  }
                />

                {/* hotel-booking module routes */}
                <Route path="/rooms" element={<RoomListPage />} />
                <Route
                  path="/rooms/new"
                  element={
                    <ProtectedRoute allowedRoles={["frontdesk"]}>
                      <RoomFormPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/rooms/:id/edit"
                  element={
                    <ProtectedRoute allowedRoles={["frontdesk"]}>
                      <RoomFormPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/guests"
                  element={
                    <ProtectedRoute allowedRoles={["frontdesk"]}>
                      <GuestListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/guests/new"
                  element={
                    <ProtectedRoute allowedRoles={["frontdesk"]}>
                      <GuestFormPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/guests/:id/edit"
                  element={
                    <ProtectedRoute allowedRoles={["frontdesk"]}>
                      <GuestFormPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/payments"
                  element={
                    <ProtectedRoute allowedRoles={["frontdesk"]}>
                      <PaymentListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payments/new"
                  element={
                    <ProtectedRoute allowedRoles={["frontdesk"]}>
                      <PaymentFormPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payments/:id/edit"
                  element={
                    <ProtectedRoute allowedRoles={["frontdesk"]}>
                      <PaymentFormPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/bookings"
                  element={
                    <ProtectedRoute allowedRoles={["frontdesk"]}>
                      <BookingListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bookings/new"
                  element={
                    <ProtectedRoute allowedRoles={["frontdesk", "guest"]}>
                      <BookingFormPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bookings/:id/edit"
                  element={
                    <ProtectedRoute allowedRoles={["frontdesk"]}>
                      <BookingEditPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-bookings"
                  element={
                    <ProtectedRoute allowedRoles={["guest"]}>
                      <MyBookingsPage />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </DashboardShell>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
