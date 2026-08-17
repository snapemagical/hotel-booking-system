const makeCrudRouter = require("../../core/crud-engine/makeCrudRouter");
const Room = require("./room.model");
const schema = require("./room.schema");

module.exports = makeCrudRouter(Room, schema);
