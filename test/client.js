"use strict";

// Imports
const { Client } = require("../index.js").client;

// Variables
let client = new Client({
    bot: false,
    username: "DmmD"
});

// Events
client
    // System
    .on("error", error => console.log(`Error: ${error.content}`))
    .on("online", () => console.log(`Client is now online`))
    .on("offline", () => console.log(`Client is not offline`))

    // Server
    .on("connect", server => console.log(`Server Connected: ${server.name} (${server.address})`))
    .on("disconnect", server => console.log(`Server Disconnected: ${server.name} (${server.address})`))
    .on("join", user => console.log(`${user.server.name} | ${user.tag} joined the server`))
    .on("leave", user => console.log(`${user.server.name} | ${user.tag} left the server`))
    .on("message", message => console.log(`${message.server.name} | ${message.user.tag} > ${message.content}`))

// Connect
client.connect("localhost:2075", "honknet");