"use strict";

// Imports
const fs = require("fs");
const net = require("net");
const readline = require("readline");
const Packet = require("./server/structures/Packet");

// Variables
let rif = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let host = null;
let port = null;
let client = null;
let output = fs.createWriteStream(`${Date.now()}.txt`);

function prompt(question) {
    rif.question(`${question}\n> `, answer => {
        if(!host) {
            host = answer;
            return prompt("Please enter the port");
        };
        if(!port) {
            port = parseInt(answer);
            client = net.createConnection(port, host);
            client.on("data", buffer => {
                Packet.unpack(buffer).forEach(data => {
                    output.write(JSON.stringify(data) + "\n");
                });
            });
            prompt("Insert data below");
            return;
        };
        client.write(answer + "\0xdiv");
        prompt("Insert data below");
    });
};
prompt("Please enter the host name");