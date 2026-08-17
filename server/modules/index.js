const { getConfig } = require("../core/config");

// Simple module registry: to add a new module, add one entry here.
const MODULE_MAP = {
  "hotel-booking": {
    routes: {
      rooms: "./hotel-booking/room.routes",
      guests: "./hotel-booking/guest.routes",
      payments: "./hotel-booking/payment.routes",
      bookings: "./hotel-booking/booking.routes",
    },
    nav: "./hotel-booking/nav",
    mountPath: "/api/hotel-booking",
  },
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

    Object.entries(entry.routes || {}).forEach(([key, routePath]) => {
      app.use(`${entry.mountPath}/${key}`, require(routePath));
    });

    const nav = require(entry.nav);
    combinedNav = combinedNav.concat(nav);

    console.log(`[modules] mounted "${moduleId}" at ${entry.mountPath}`);
  });

  return combinedNav;
}

module.exports = { loadModules };
