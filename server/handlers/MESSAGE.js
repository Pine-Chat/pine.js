"use strict";

// Imports
const Message = require("../structures/Message.js");
const PacketError = require("../../src/structures/PacketError.js");

// Variables
let seed = Math.max(1000000000000, Date.now());

function handler(meta) {
    if(!meta.user) new PacketError("User hasn't authenticated yet", "AUTHENTICATE_NONE");
    if([
        "content"
    ].some(v => !(v in meta.data.data))) throw new PacketError("Invalid message data", "MESSAGE_INVALID_DATA");
    if(!meta.data.data.content) throw new PacketError("Invalid message content", "MESSAGE_INVALID_CONTENT");
    let mid = seed += Math.floor(Math.random() * 1000) + 1;
    let message = new Message({
        content: `${meta.data.data.content}`.slice(0, meta.server.configuration.get("limit.username") ?? 250),
        createdTimestamp: Date.now(),
        mid,
        system: false
    }, meta.user);
    meta.server.emit("message", message);
    meta.server.broadcast({
        data: message.toJSON(),
        type: "MESSAGE"
    });
};

// Exports
module.exports = handler;