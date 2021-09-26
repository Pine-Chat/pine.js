"use strict";

// Imports
const { Server } = require(".").server;

// Variables
let server = new Server("localhost:2075");

// Events
server.on("connect", (c, uid) => console.log(`User #${uid} joined`));
server.on("data", data => console.log(data));
server.on("end", () => console.log(`Server has stopped`));
server.on("error", () => { /* Backend Log */ });
server.on("start", () => console.log(`Server is online on ${server.address}`));

// Start
server.start();