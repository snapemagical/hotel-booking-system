import EntityList from "../../../core/crud-engine/EntityList.jsx";
import guestSchema from "../guest.schema.js";

export default function GuestListPage() {
  return <EntityList schema={guestSchema} apiPath="/hotel-booking/guests" basePath="/guests" />;
}
