import EntityList from "../../../core/crud-engine/EntityList.jsx";
import bookingSchema from "../booking.schema.js";

export default function BookingListPage() {
  return <EntityList schema={bookingSchema} apiPath="/hotel-booking/bookings" basePath="/bookings" />;
}
