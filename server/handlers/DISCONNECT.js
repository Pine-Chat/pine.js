"use strict";

// Imports
const Packet = require("../structures/Packet.js");

/**
 * Handles data
 * @param {object} meta Meta data
 */
function handler(meta) {
    if(!meta.user) {
        meta.connection.write(Packet.pack({
            data: {
                code:" DISCONNECT_FAILURE",
                message:" Disconnect: This user hasn't authenticated yet"
            },
            type: "ERROR"
        }));
        return;
    };
    meta.connection.end(Packet.pack({
        data: {
            code: "DISCONNECT_SUCCESS",
            message: "Disconnect: Successfully disconnected"
        },
        type: "SYSTEM"
    }));
    meta.server.emit("disconnect", meta.user);
    meta.server.broadcast({ data: meta.user.toJSON(), type: "DISCONNECT" });
    meta.users.delete(meta.user.uid);
};

// Exports
module.exports = handler;