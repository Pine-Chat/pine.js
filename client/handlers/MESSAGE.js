"use strict";

// Imports
const Message = require("../structures/Message.js");

function handler(meta) {
    meta.server.emit("message", new Message(meta.data.data, meta.server.users.find(v => v.uid === meta.data.data.uid)));
};

// Exports
module.exports = handler;