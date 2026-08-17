import EntityList from "../../../core/crud-engine/EntityList.jsx";
import roomSchema from "../room.schema.js";

export default function RoomListPage() {
  return <EntityList schema={roomSchema} apiPath="/hotel-booking/rooms" basePath="/rooms" />;
}
