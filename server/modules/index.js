const { getConfig } = require("../core/config");

// Simple module registry: to add a new module, add one entry here.
// The "hotel-booking" module isn't built yet (that's Phase 2) - once its
// route files exist, uncomment the entry below.
const MODULE_MAP = {
  // "hotel-booking": {
  //   roomRoutes: "./hotel-booking/room.routes",
  //   bookingRoutes: "./hotel-booking/booking.routes",
  //   nav: "./hotel-booking/nav",
  //   mountPath: "/api/hotel-booking",
  // },
};

// Mounts every enabled module's routes on the Express app, and returns
// the combined nav list for the frontend /api/config endpoint to expose.
function loadModules(app) {
  const config = getConfig();
  let combinedNav = [];

  config.enabledModules.forEach((moduleId) => {
    const entry = MODULE_MAP[moduleId];
    if (!entry) {
      console.warn(`[modules] "${moduleId}" is enabled in project.config.js but has no entry in modules/index.js yet`);
      return;
    }

    if (entry.roomRoutes) {
      app.use(`${entry.mountPath}/rooms`, require(entry.roomRoutes));
    }
    if (entry.bookingRoutes) {
      app.use(`${entry.mountPath}/bookings`, require(entry.bookingRoutes));
    }

    const nav = require(entry.nav);
    combinedNav = combinedNav.concat(nav);

    console.log(`[modules] mounted "${moduleId}" at ${entry.mountPath}`);
  });

  return combinedNav;
}

module.exports = { loadModules };
