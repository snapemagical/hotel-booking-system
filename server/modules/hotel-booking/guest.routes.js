const makeCrudRouter = require("../../core/crud-engine/makeCrudRouter");
const Guest = require("./guest.model");
const schema = require("./guest.schema");

module.exports = makeCrudRouter(Guest, schema);
