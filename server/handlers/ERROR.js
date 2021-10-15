"use strict";

// Imports
const Packet = require("../structures/Packet.js");

/**
 * Handles data
 * @param {object} meta Meta data
 */
function handler(meta) {
    meta.server.emit("error", meta.error);
    if(!meta.user) return;
    meta.connection.end(Packet.pack({
        data: {
            code: "ERROR",
            message: `Error: ${meta.error?.message || "An error occurred"}`
        },
        type: "SYSTEM"
    }));
    meta.server.emit("disconnect", meta.user);
    meta.users.delete(meta.user.uid);
};

// Exports
module.exports = handler;