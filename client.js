"use strict";

// Imports
const { Client } = require(".").client;

// Variables
let client = new Client("DmmD");

// Events
client.on("connect", () => {

});
client.on("data", (data, server) => {
    console.log(data, server);
});
client.on("disconnect", () => {

});
client.on("error", () => {

});

// Connect
client.connect("localhost:2075");