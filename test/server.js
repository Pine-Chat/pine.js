"use strict";

// Imports
const { Server } = require("../index.js").server;

// Variables
let server = new Server("localhost:2075", {
    bots: true,
    limit: -1,
    name: "Honknet",
    password: "honknet",
    private: true
});

// Events
server
    // System
    .on("error", error => console.log(`Error: ${error.content}`))
    .on("online", () => console.log(`Server is now online`))
    .on("offline", () => console.log(`Server is not offline`))

    // Server
    .on("join", user => console.log(`${server.name} | ${user.tag} joined the server`))
    .on("leave", user => console.log(`${server.name} | ${user.tag} left the server`))
    .on("message", message => console.log(`${message.server.name} | ${message.user.tag} > ${message.content}`))

// Connect
server.start();