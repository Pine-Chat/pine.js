"use strict";

// Imports
const Configuration = require("./Configuration.js");
const CONFIGURATION_DEFAULT = require("../src/CONFIGURATION_DEFAULT.json");
const Events = require("events");
const getFiles = require("../../src/functions/getFiles.js");
const isObject = require("../../src/functions/isObject.js");
const net = require("net");
const Packet = require("../../src/structures/Packet.js");
const PacketError = require("../../src/structures/PacketError.js");
const path = require("path");
const User = require("./User.js");

// Variables
let handlers = getFiles(path.join(__dirname, "../handlers/"));

class Server extends Events {
    #configuration;
    #createdTimestamp;
    #socket;
    #system = null;
    #users = new Map();

    constructor(configuration) {
        super();
        if(configuration instanceof Configuration) this.#configuration = configuration;
        else this.#configuration = new Configuration(isObject(configuration) ? configuration : CONFIGURATION_DEFAULT);
    };

    get address() {
        return `${this.#configuration.get("host")}:${this.#configuration.get("port")}`;
    };

    ban(uid) {
        if(!this.#users.has(uid)) throw new Error("Cannot find that user");
        let user = this.#users.get(uid);
        this.#configuration.get("bans").push(user.ip.address);
        user.disconnect();
    };

    broadcast(data) {
        this.#users.forEach(v => v.write(data));
        super.emit("broadcast", data);
    };

    get configuration() {
        return this.#configuration;
    };

    get createdDate() {
        return this.#createdTimestamp ? new Date(this.#createdTimestamp) : null;
    };

    get createdTimestamp() {
        return this.#createdTimestamp ?? null;
    };

    end() {
        if(!this.#socket) throw new Error("The server is offline already");
        this.#socket.close();
    };

    kick(uid) {
        if(!this.#users.has(uid)) throw new Error("Cannot find that user");
        this.#users.get(uid).disconnect();
    };

    get online() {
        return !!this.#socket;
    };

    start() {
        if(this.#socket) throw new Error("The server is online already");
        let host = this.#configuration.get("host");
        let port = this.#configuration.get("port");
        if(!host || !port) throw new TypeError("The host or port is missing in the configuration");
        if(!Number.isInteger(port) || port <= 0 || port > 65535) throw new Error("Invalid port number");
        this.#socket = net.createServer()
            .on("close", () => {
                super.emit("end");
                this.#createdTimestamp = null;
                this.#socket = null;
                this.#users.clear();
            })
            .on("connection", connection => {
                let user = null, timeout = setTimeout(() => {
                    if(user !== null) connection.end();
                }, 10000);
                connection
                    .on("close", () => {
                        if(!user) return;
                        this.#users.delete(user.uid);
                        super.emit("leave", user);
                        this.broadcast({
                            data: user.toJSON(),
                            type: "LEAVE"
                        });
                    })
                    .on("data", buffer => {
                        try {
                            Packet.parse(buffer).forEach(packet => {
                                let data = packet.toJSON();
                                if(!("type" in data) || !(data.type in handlers))
                                    throw new PacketError("Packet type is invalid or does not exist", "PACKET_INVALID_TYPE");
                                if(!("data" in data) || typeof data !== "object")
                                    throw new PacketError("Packet data is invalid or does not exist", "PACKET_INVALID_DATA");
                                handlers[data.type]({
                                    connection,
                                    data,
                                    packet,
                                    server: this,
                                    system: this.#system,
                                    timeout,
                                    get user() { return user },
                                    set user(v) { return user = v },
                                    users: this.#users
                                });
                            });
                        }
                        catch(error) {
                            super.emit("error", error);
                            let packetError = error instanceof PacketError ? error : PacketError.fromError(error);
                            super.emit("packetError", packetError);
                            if(!connection.destroyed) user.write({
                                data: packetError.toJSON(),
                                type: "ERROR"
                            });
                        };
                    })
                    .on("error", error => {
                        super.emit("error", error);
                        if(!connection.destroyed) connection.end();
                    });
            })
            .on("error", error => {
                super.emit("error", error);
                this.end();
            })
            .on("listening", () => {
                this.#createdTimestamp = Date.now();
                this.#system = new User(this.#socket, {
                    bot: false,
                    joinedTimestamp: this.#createdTimestamp,
                    system: true,
                    uid: 1,
                    username: "System"
                }, this);
                super.emit("start");
            })
            .listen(port, host);
    };

    toJSON() {
        return {
            address: this.address,
            configuration: this.#configuration.toJSON(),
            createdTimestamp: this.createdTimestamp,
            uptime: this.uptime,
            users: this.users.map(v => v.toJSON())
        };
    };

    toString() {
        return JSON.stringify(this.toJSON()) + "\0xdiv";
    };

    get uptime() {
        return this.#socket ? Date.now() - this.#createdTimestamp : null;
    };

    get users() {
        return Array.from(this.#users.values());
    };
};

// Exports
module.exports = Server;