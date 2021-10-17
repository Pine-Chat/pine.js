"use strict";

// Imports
const client = {
    structures: {
        Client: require("./client/structures/Client.js"),
        Message: require("./client/structures/Message.js"),
        Server: require("./client/structures/Server.js"),
        User: require("./client/structures/User.js")
    }
};
const server = {
    structures: {
        Configuration: require("./server/structures/Configuration.js"),
        Message: require("./server/structures/Message.js"),
        Server: require("./server/structures/Server.js"),
        User: require("./server/structures/User.js")
    }
};

// Exports
module.exports = { client, server };