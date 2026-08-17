import EntityForm from "../../../core/crud-engine/EntityForm.jsx";
import guestSchema from "../guest.schema.js";

export default function GuestFormPage() {
  return <EntityForm schema={guestSchema} apiPath="/hotel-booking/guests" basePath="/guests" />;
}
