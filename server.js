"use strict";

// Imports
const Server = require("./server/structures/Server.js");

// Variables
let server = new Server("10.0.0.200", 2075);

// Events
server.on("start", () => {
    console.log(`Server is now online on ${server.host}:${server.port}`);
});
server.on("connect", user => {
    console.log(`User ${user.username} has joined`);
});
server.on("disconnect", user => {
    console.log(`User ${user.username} has left`);
});
server.on("message", message => {
    console.log(`${message.user.username} > ${message.content}`);
});
server.on("error", error => {});

// Starts
server.start();