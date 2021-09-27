"use strict";

// Imports
const { Server } = require("../index.js").server

// Variables
let server = new Server("localhost:2075");

// Events
server
    .on("start", () => console.log(`Server is now online on: ${server.address}`))
    .on("end", () => {
        console.log(`Server is shutting down`);
        server.start();
    })
    .on("error", error => {})
    .on("connect", user => console.log(`User (#${user.uid}) has joined the server`))
    .on("disconnect", user => console.log(`User (#${user.uid}) left the server`))
    .on("message", message => console.log(`${message.user.uid} > ${message.content}`));

// Start
server.start();



setTimeout(() => server.end(), 10000);