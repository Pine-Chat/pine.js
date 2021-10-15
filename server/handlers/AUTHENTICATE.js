"use strict";

// Imports
const Packet = require("../structures/Packet.js");
const User = require("../structures/User.js");

/**
 * Handles data
 * @param {object} meta Meta data
 */
function handler(meta) {
    if(meta.user) {
        meta.connection.write(Packet.pack({
            data: {
                code:" AUTHENTICATION_EXIST",
                message:" Authenticate: This user has already been authenticated"
            },
            type: "ERROR"
        }));
        return;
    };
    clearTimeout(meta.timeout);
    meta.user = new User(meta.connection, {
        bot: meta.data?.data?.bot || false,
        joinTimestamp: Date.now(),
        username: meta.data?.data?.username || "Guest"
    }, meta.server, meta.uid += Math.floor(Math.random() * 1000));
    meta.connection.write(Packet.pack({
        data: {
            code: "AUTHENTICATION_SUCCESS",
            message: "Authenticate: Successfully authenticated"
        },
        type: "SYSTEM"
    }));
    meta.users.set(meta.user.uid, meta.user);
    meta.server.emit("connect", meta.user);
    meta.server.broadcast({ data: meta.user.toJSON(), type: "AUTHENTICATE" });
};

// Exports
module.exports = handler;