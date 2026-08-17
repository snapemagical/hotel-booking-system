// Booking isn't rendered with the generic EntityForm (see BookingFormPage /
// BookingEditPage) because creating one needs a room picker + computed
// total, and editing one is really just a status change. This schema still
// powers the generic EntityList table (column labels + role checks).
export default {
  name: "Booking",
  roles: {
    create: ["frontdesk"],
    update: ["frontdesk"],
    delete: [], // admin only, via the automatic admin bypass
  },
  listFields: ["guestName", "roomNumber", "checkInDate", "checkOutDate", "status", "totalAmount"],
  fields: {
    guestName: { label: "Guest" },
    roomNumber: { label: "Room" },
    checkInDate: { label: "Check-in" },
    checkOutDate: { label: "Check-out" },
    status: { label: "Status" },
    totalAmount: { label: "Total" },
  },
};
