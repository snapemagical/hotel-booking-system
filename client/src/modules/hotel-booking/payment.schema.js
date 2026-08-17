export default {
  name: "Payment",
  roles: {
    create: ["frontdesk"],
    update: ["frontdesk"],
    delete: ["frontdesk"],
  },
  listFields: ["bookingId", "amount", "method", "status"],
  fields: {
    bookingId: { label: "Booking ID", required: true },
    amount: { label: "Amount", type: "Number", required: true },
    method: { label: "Method", enum: ["cash", "card", "upi"], required: true },
    status: { label: "Status", enum: ["pending", "paid", "refunded"], default: "pending", required: true },
  },
};
