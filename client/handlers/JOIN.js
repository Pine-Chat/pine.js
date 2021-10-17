"use strict";

function handler(meta) {
    meta.server.emit("join", meta.server.users.find(v => v.uid === meta.data.data.uid));
};

// Exports
module.exports = handler;