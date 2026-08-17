import EntityForm from "../../../core/crud-engine/EntityForm.jsx";
import roomSchema from "../room.schema.js";

export default function RoomFormPage() {
  return <EntityForm schema={roomSchema} apiPath="/hotel-booking/rooms" basePath="/rooms" />;
}
