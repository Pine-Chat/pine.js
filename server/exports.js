"use strict";

// Imports
const structures = {
    Message: require("./structures/Message.js"),

    Server: require("./structures/Server.js"),

    User: require("./structures/User.js")
};

// Exports
module.exports = {
    structures, ...structures
};