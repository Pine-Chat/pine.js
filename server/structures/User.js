"use strict";

// Imports
const isObject = require("../../src/functions/isObject.js");
const Packet = require("../../src/structures/Packet.js");

class User {
    #connection;
    #data;
    #server;
    
    constructor(connection, data, server) {
        if(!isObject(data)) throw new TypeError("Data is not an object");
        this.#connection = connection;
        this.#data = {
            bot: data.bot,
            joinedTimestamp: data.joinedTimestamp,
            system: data.system,
            uid: data.uid,
            username: data.username
        };
        this.#server = server;
    };

    get bot() {
        return !!this.#data.bot;
    };

    disconnect() {
        this.#connection.end();
    };

    get ip() {
        let address = this.#connection.remoteAddress;
        let port = this.#connection.remotePort;
        return {
            address,
            full: `${address}:${port}`,
            port
        };
    };

    get joinedDate() {
        return new Date(this.#data.joinedTimestamp);
    };

    get joinedTimestamp() {
        return +this.#data.joinedTimestamp;
    };

    get server() {
        return this.#server;
    };

    get status() {
        return +!this.#connection.destroyed;
    };

    get system() {
        return !!this.#data.system;
    };

    toJSON() {
        return {
            bot: this.bot,
            joinedTimestamp: this.joinedTimestamp,
            status: this.status,
            system: this.system,
            uid: this.uid,
            username: this.username
        };
    };

    toString() {
        return JSON.stringify(this.toJSON()) + "\0xdiv";
    };

    get uid() {
        return +this.#data.uid;
    };

    get username() {
        return `${this.#data.username}`;
    };

    write(data) {
        this.#connection.write(new Packet(data).toString());
        this.#server.emit("write", data, this);
    };
};

// Exports
module.exports = User;