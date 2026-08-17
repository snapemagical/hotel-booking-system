# Hotel Booking System
### (Instructor reference — Phase 2: hotel-booking module complete)

A working MERN application built on a reusable **core** (auth, RBAC, generic
CRUD engine, notifications, audit log) plus a **hotel-booking** domain module
(Rooms, Bookings, Guests, Payments). Follows the same platform pattern as the
Smart Library Management System reference project.

## Prerequisites
- Node.js 18+
- MongoDB running locally (or an Atlas connection string)

## 1. Server setup
```
cd server
npm install
cp .env.example .env      # then edit .env with your Mongo URI + JWT secret
npm run seed                # creates demo admin/frontdesk/guest accounts + sample rooms
npm run dev                 # starts the API on http://localhost:5000
```

## 2. Client setup
```
cd client
npm install
npm run dev                 # starts the React app on http://localhost:5173
```

## 3. Log in
Open http://localhost:5173 and sign in with one of the seeded demo accounts:

| Role | Email | Password |
|---|---|---|
| Admin | admin@demo.com | password123 |
| Front Desk | frontdesk@demo.com | password123 |
| Guest | guest@demo.com | password123 |

## What to try
- Log in as **frontdesk**: add/edit Rooms, add a Guest record, create a
  Booking (pick a room, dates — total is calculated live from nights ×
  room rate), then open the booking again to change its status: setting it
  to **checked-in** marks the room `occupied`; **checked-out** or
  **cancelled** frees it back up to `available`. Record a Payment against
  a booking.
- Log in as **guest**: browse Rooms (read-only), make a booking for
  yourself under **My Bookings**, cancel it if still `confirmed`.
- Log in as **admin**: everything above, plus the Audit Log, plus the only
  role that can delete a booking outright.

## Project layout
```
server/
  core/               - auth, RBAC, generic CRUD engine, audit log, notifications (module-agnostic)
  config/             - project.config.js: app name, roles, enabled modules
  models/             - User model
  modules/
    index.js          - module registry (mounts hotel-booking's routes + nav)
    hotel-booking/     - Room/Guest/Payment (generic CRUD) + Booking (custom: rate calc, room status sync)
  seed/                - demo accounts + sample rooms
client/
  src/core/            - auth context/pages, generic CRUD-driven EntityList/EntityForm, layout
  src/components/      - shadcn/ui primitives + the app's Sidebar
  src/modules/
    hotel-booking/ui/   - Room/Guest/Payment list+form pages (generic), Booking pages (custom)
```

## Design notes worth walking through with students
- **Room, Guest, Payment** are plain CRUD — their entire UI is just a
  schema object (`room.schema.js` etc.) fed into the shared `EntityList`
  / `EntityForm` components. No new UI code was written for them.
- **Booking** is *not* plain CRUD: creating one needs to look up the
  room's rate, validate availability, and compute `nights` / `totalAmount`;
  changing its status has a side-effect on the room. That's why it gets
  its own routes (`booking.routes.js`) and its own pages (`BookingFormPage`,
  `BookingEditPage`) instead of the generic ones — a good example of "when
  do you break out of the generic CRUD engine."
- **RBAC** is enforced in two places on purpose: the server is the source
  of truth (`requireRole` on every route), the client's `EntityList`
  hides buttons the user can't use — but only as a UX nicety, never as
  the actual security boundary.
- Everything under `server/core/` and `client/src/core/` is byte-for-byte
  reusable for a third project (Student Management, Inventory, ...) —
  only `modules/` and `App.jsx`'s route list change.

## Turning this into a different project
Same recipe as `docs/adding-a-module.md` in the Library reference project:
add a new module folder, one entry in `server/modules/index.js`, one set of
imports/routes in `client/src/App.jsx`, update `project.config.js`. Nothing
under `core/` needs to change.
