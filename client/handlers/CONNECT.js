"use strict";

// Imports
const User = require("../structures/User.js");

function handler(meta) {
    let server = meta.server, users = meta.users;
    meta.data.data.users.forEach(v => users.set(v.uid, new User(v, server)));
    meta.uid = meta.data.data.uid;
    meta.server.emit("connect");
};

// Exports
module.exports = handler;