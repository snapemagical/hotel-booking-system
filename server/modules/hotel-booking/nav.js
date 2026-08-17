module.exports = [
  { label: "Rooms", path: "/rooms", icon: "room", roles: ["admin", "frontdesk", "guest"] },
  { label: "Bookings", path: "/bookings", icon: "bookings", roles: ["admin", "frontdesk"] },
  { label: "Guests", path: "/guests", icon: "guests", roles: ["admin", "frontdesk"] },
  { label: "Payments", path: "/payments", icon: "payments", roles: ["admin", "frontdesk"] },
  { label: "My Bookings", path: "/my-bookings", icon: "bookings", roles: ["guest"] },
];
