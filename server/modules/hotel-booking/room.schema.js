module.exports = {
  name: "Room",
  roles: {
    read: ["admin", "frontdesk", "guest"], // guests can browse rooms read-only
    create: ["frontdesk"],
    update: ["frontdesk"],
    delete: ["frontdesk"],
  },
};
