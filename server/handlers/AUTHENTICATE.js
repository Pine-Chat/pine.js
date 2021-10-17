"use strict";

// Imports
const PacketError = require("../../src/structures/PacketError.js");
const User = require("../structures/User.js");

// Variables
let seed = Math.max(1000000000000, Date.now());

function handler(meta) {
    let configuration = meta.server.configuration;
    if(configuration.get("locked") === true) throw new PacketError("The server is currently locked", "SERVER_LOCKED");
    let bans = configuration.get("bans");
    if(Array.isArray(bans) && bans.includes(meta.connection.remoteAddress))
        throw new PacketError("This user is banned from the server", "SERVER_BANNED");
    if(meta.user) throw new PacketError("User has already authenticated", "AUTHENTICATE_REPEAT");
    if([
        "bot", "username"
    ].some(v => !(v in meta.data.data))) throw new PacketError("Invalid user data", "AUTHENTICATE_INVALID_DATA");
    let password = configuration.get("password");
    if(
        password !== null &&
        (!("password" in meta.data.data) || `${meta.data.data.password}` !== `${password}`)
    ) throw new PacketError("Incorrect password", "AUTHENTICATE_INVALID_PASSWORD");
    if(!meta.data.data.username) throw new PacketError("Invalid username", "AUTHENTICATE_INVALID_USERNAME"); 
    clearTimeout(meta.timeout);
    let uid = seed += Math.floor(Math.random() * 1000) + 1;
    let user = new User(meta.connection, {
        bot: !!meta.data.data.bot,
        joinedTimestamp: Date.now(),
        system: false,
        uid,
        username: `${meta.data.data.username}`.slice(0, configuration.get("limit.username") ?? 16)
    }, meta.server);
    meta.user = user;
    meta.users.set(uid, user);
    meta.server.emit("join", user);
    user.write({
        data: {
            users: meta.server.users.map(v => v.toJSON()),
            uid
        },
        type: "CONNECT"
    });
    meta.server.broadcast({
        data: user.toJSON(),
        type: "JOIN"
    });
};

// Exports
module.exports = handler;