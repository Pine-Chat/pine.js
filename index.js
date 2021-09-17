"use strict";

// Imports
const managers = {
    Address: require("./managers/Address.js"),
    Packet: require("./managers/Packet.js")
};
const structures = {
    Client: require("./structures/Client.js"),
    Message: require("./structures/Message.js"),
    Server: require("./structures/Server.js"),
    User: require("./structures/User.js")
};

// Exports
module.exports = {
    managers, ...managers,
    structures, ...structures
};