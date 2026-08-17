# Hotel Booking System
### (Instructor reference — core platform, Phase 1)

This is a working MERN application built on a reusable **core** (auth, RBAC,
generic CRUD engine, notifications, audit log). It follows the same platform
pattern as the Smart Library Management System reference project — a domain
module (`hotel-booking`: rooms, bookings, guests, payments) plugs into this
core without touching anything under `core/`.

> **Status:** Phase 1 (this commit) ships the core platform only — auth,
> RBAC, the generic CRUD engine, audit log, notifications, and a working
> (empty) dashboard shell. The `hotel-booking` domain module (Rooms,
> Bookings, Guests, Payments) lands in Phase 2.

## Prerequisites
- Node.js 18+
- MongoDB running locally (or an Atlas connection string)

## 1. Server setup
```
cd server
npm install
cp .env.example .env      # then edit .env with your Mongo URI + JWT secret
npm run dev                 # starts the API on http://localhost:5000
```
There's no seed data yet — register your first user via:
```
POST http://localhost:5000/api/auth/register
{ "name": "Admin", "email": "admin@demo.com", "password": "password123", "role": "admin" }
```
Valid roles right now: `admin`, `frontdesk`, `guest` (see `server/config/project.config.js`).

## 2. Client setup
```
cd client
npm install
npm run dev                 # starts the React app on http://localhost:5173
```

## 3. Log in
Open http://localhost:5173 and sign in with the account you registered above.
You'll land on an empty dashboard with a working sidebar, profile page, and
(if admin) an audit log — no hotel data yet, since the `hotel-booking` module
isn't built in this commit.

## Project layout
```
server/
  core/           - auth, RBAC, generic CRUD engine, audit log, notifications (untouched by modules)
  config/         - project.config.js: app name, roles, enabled modules
  models/         - User model
  modules/        - module registry (empty until hotel-booking lands)
client/
  src/core/       - auth context/pages, generic CRUD-driven EntityList/EntityForm, layout
  src/components/ - shadcn/ui primitives + the app's Sidebar
```

## What's next (Phase 2)
Add the `hotel-booking` module:
- `server/modules/hotel-booking/` — Room, Booking, Guest, Payment schemas + routes, wired into `server/modules/index.js`
- `client/src/modules/hotel-booking/ui/` — list/form pages for each entity, reusing `EntityList`/`EntityForm`
- A seed script with demo rooms + a few bookings

This mirrors exactly how `docs/adding-a-module.md` in the Library reference
project describes adding a new module — nothing under `core/` needs to change.
