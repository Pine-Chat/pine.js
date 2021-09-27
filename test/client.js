"use strict";

// Imports
const net = require("net");

// Variables
let socket = net.createConnection(2075, "10.0.0.200");

setTimeout(() => {
    socket.write(JSON.stringify({
        type: "authenticate"
    }) + "\0xdiv");
}, 1000);
setTimeout(() => {
    socket.write(JSON.stringify({
        content: "Yo",
        type: "message"
    }) + "\0xdiv");
}, 1500);