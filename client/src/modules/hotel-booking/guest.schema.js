export default {
  name: "Guest",
  roles: {
    create: ["frontdesk"],
    update: ["frontdesk"],
    delete: ["frontdesk"],
  },
  listFields: ["name", "email", "phone", "idNumber"],
  fields: {
    name: { label: "Full Name", required: true },
    email: { label: "Email", required: true },
    phone: { label: "Phone", required: true },
    idNumber: { label: "ID / Passport No.", required: true },
  },
};
