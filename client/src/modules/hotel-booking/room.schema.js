export default {
  name: "Room",
  roles: {
    create: ["frontdesk"],
    update: ["frontdesk"],
    delete: ["frontdesk"],
  },
  listFields: ["roomNumber", "type", "rate", "status"],
  fields: {
    roomNumber: { label: "Room Number", required: true },
    type: { label: "Type", enum: ["Single", "Double", "Suite"], required: true },
    rate: { label: "Rate / Night", type: "Number", required: true },
    status: { label: "Status", enum: ["available", "occupied", "maintenance"], default: "available", required: true },
  },
};
