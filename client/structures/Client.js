"use strict";

// Imports
const Events = require("events");
const net = require("net");
const Packet = require("./Packet.js");

// Variables
let handlers = {
    AUTHENTICATE: require("../handlers/AUTHENTICATE.js"),
    DISCONNECT: require("../handlers/DISCONNECT.js"),
    ERROR: require("../handlers/ERROR.js"),
    SYSTEM: require("../handlers/SYSTEM.js")
};

class Client extends Events {
    #servers = new Map();
    #sid = Math.floor(Date.now() * (0.5 + Math.random()) % 3000000000000);

    constructor(username = "Guest", bot = false) {
        super();
        this.username = username;
        this.bot = bot;
    };

    connect(host, port) {
        try {
            let socket = net.createConnection(port, host), server;
            socket
                .on("connect", () => socket.write(Packet.pack({
                    bot: !!this.bot,
                    username: `${this.username}`
                })))
                .on("data", buffer => {
                    Packet.unpack(buffer).forEach(data => {
                        try {
                            super.emit("data", data);
                            handle(data?.type, { data }, this);
                        }
                        catch(error) { return handle("ERROR", { error }, this) };
                    });
                })
                .on("end", () => handle("DISCONNECT", {}, this))
                .on("error", error => handle("ERROR", { error }, this));
            function handle(type, meta, client) {
                if(type in handlers) handlers[type](Object.assign({
                    client,
                    get sid() { return client.#sid },
                    set sid(sid) { client.#sid = sid },
                    get server() { return user },
                    set server(value) { server = value },
                    servers: client.#servers,
                    socket
                }, meta));
            };
        }
        catch { throw new Error("Cannot connect to that server") };
    };

    disconnect(sid) {
        if(!this.#servers.has(sid)) throw new Error("Cannot find that server");

    };

    servers() {
        return this.#servers.values();
    };
};

// Exports
module.exports = Client;