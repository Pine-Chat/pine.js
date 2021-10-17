"use strict";

// Imports
const Events = require("events");
const getFiles = require("../../src/functions/getFiles.js");
const isObject = require("../../src/functions/isObject.js");
const net = require("net");
const Packet = require("../../src/structures/Packet.js");
const PacketError = require("../../src/structures/PacketError.js");
const path = require("path");

// Variables
let handlers = getFiles(path.join(__dirname, "../handlers/"));

class Server extends Events {
    #client;
    #createdTimestamp;
    #data;
    #socket;
    #uid;
    #users = new Map();
    
    constructor(data, client) {
        super();
        if(!isObject(data)) throw new TypeError("Data is not an object"); 
        this.#data = {
            host: data.host,
            port: data.port
        };
        this.#client = client;
    };

    get client() {
        return this.#client;
    };

    get createdDate() {
        return this.#createdTimestamp ? new Date(this.#createdTimestamp) : null;
    };

    get createdTimestamp() {
        return this.#createdTimestamp ?? null;
    };

    connect() {
        if(this.#socket) throw new Error("The client is already connected to the server");
        this.#socket = net.createConnection(this.#data.port, this.#data.host)
            .on("close", () => {
                this.emit("disconnect");
                this.#createdTimestamp = null;
                this.#socket = null;
                this.#users.clear();
            })
            .on("data", buffer => {
                try {
                    Packet.parse(buffer).forEach(packet => {
                        let data = packet.toJSON();
                        if(!("type" in data) || !(data.type in handlers))
                            throw new PacketError("Packet type is invalid or does not exist", "PACKET_INVALID_TYPE");
                        if(!("data" in data) || typeof data !== "object")
                            throw new PacketError("Packet data is invalid or does not exist", "PACKET_INVALID_DATA");
                        let server = this;
                        handlers[data.type]({
                            data,
                            packet,
                            server,
                            get uid() { return server.#uid },
                            set uid(v) { return server.#uid = v },
                            users: server.#users
                        });
                    });
                }
                catch(error) {
                    this.emit("error", error);
                    this.emit("packetError", error instanceof PacketError ? error : PacketError.fromError(error));
                };
            })
            .on("error", error => {
                this.emit("error", error);
                this.disconnect();
            })
            .on("ready", () => {
                this.#createdTimestamp = Date.now();
                this.write({
                    data: {
                        bot: this.#client.bot,
                        username: this.#client.username
                    },
                    type: "AUTHENTICATE"
                });
            });
    };

    disconnect() {
        if(!this.#socket) throw new Error("The client isn't connected to the server");
        this.#socket.end();
    };

    emit(event, ...args) {
        super.emit(event, ...args);
        this.#client.emit(event, ...args, this);
    };
    
    get ip() {
        let host = this.#data.host;
        let port = this.#data.port;
        return {
            full: `${host}:${port}`,
            host,
            port
        };
    };

    get self() {
        return this.#socket ? this.#users.values().find(v => v.uid === this.#uid) : null;
    };

    send(message) {
        this.write({
            data: {
                content: message
            },
            type: "MESSAGE"
        });
    };

    get users() {
        return Array.from(this.#users.values());
    };

    write(data) {
        if(!this.#socket) throw new Error("The client isn't connected to the server");
        this.#socket.write(new Packet(data).toString());
    };
};

// Exports
module.exports = Server;