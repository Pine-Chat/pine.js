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
    MESSAGE: require("../handlers/MESSAGE.js")
};

class Server extends Events {
    #socket = null;
    #uid = null;
    #users = new Map();

    constructor(host, port) {
        if(typeof host !== "string") throw new Error("Invalid host name");
        if(!Number.isInteger(port) || port < 0 || port > 65535) throw new Error("Invalid port");
        super();
        this.createTimestamp = Date.now();
        this.host = host;
        this.port = port;
        this.startTimestamp = Date.now();
    };

    broadcast(data) {
        if(!this.#socket) throw new Error("Server is not online yet");
        this.#users.forEach(u => u.write(data));
        super.emit("broadcast", data);
    };

    get createDate() {
        return new Date(this.createTimestamp);
    };

    end() {
        if(!this.#socket) throw new Error("Server is not online yet");
        this.#socket.close();
    };

    start() {
        if(this.#socket) throw new Error("Server is already online");
        this.#socket = net.createServer()
            .on("close", () => {
                super.emit("end");
                this.#socket = this.startTimestamp = this.#uid = null;
            })
            .on("connection", connection => {
                let user = null, timeout = setTimeout(() => connection.end(Packet.pack({
                    data: {
                        code: "AUTHENTICATION_TIMEOUT",
                        message: "Authenticate: Authentication timed out"
                    },
                    type: "ERROR"
                })), 10000);
                connection
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
                function handle(type, meta, server) {
                    if(type in handlers) handlers[type](Object.assign({
                        connection,
                        server,
                        socket: server.#socket,
                        timeout,
                        get uid() { return server.#uid },
                        set uid(uid) { server.#uid = uid },
                        get user() { return user },
                        set user(value) { user = value },
                        users: server.#users
                    }, meta));
                };
            })
            .on("error", error => super.emit("error", error))
            .on("listening", () => {
                this.startTimestamp = Date.now();
                this.#uid = Math.floor(Date.now() * (0.5 + Math.random()) % 3000000000000);
                super.emit("start");
            })
            .listen(this.port, this.host);
    };

    get startDate() {
        return this.startTimestamp ? new Date(this.startTimestamp) : null;
    };

    get users() {
        return this.#users.values();
    };
};

// Exports
module.exports = Server;