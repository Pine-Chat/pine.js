"use strict";

// Imports
const Message = require("../structures/Message.js");
const Packet = require("../structures/Packet.js");

/**
 * Handles data
 * @param {object} meta Meta data
 */
function handler(meta) {
    if(!meta.user) {
        meta.connection.write(Packet.pack({
            data: {
                code:"MESSAGE_FAILURE",
                message:" Message: This user hasn't authenticated yet"
            },
            type: "ERROR"
        }));
        return;
    };
    meta.connection.write(Packet.pack({
        data: {
            code: "MESSAGE_SUCCESS",
            message: "Message: Successfully sent the message to the server"
        },
        type: "SYSTEM"
    }));
    let message = new Message({
        content: meta.data.data?.content || "[ EMPTY MESSAGE ]",
        createTimestamp: Date.now(),
    }, meta.user);
    meta.server.broadcast({ data: message.toJSON(), type: "MESSAGE" });
    meta.server.emit("message", message);
};

// Exports
module.exports = handler;