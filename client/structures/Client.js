"use strict";

// Imports
const Events = require("events");
const isObject = require("../../src/functions/isObject");
const Server = require("./Server.js");

class Client extends Events {
    #data;
    #servers = new Map();
    
    constructor(data) {
        super();
        if(!isObject(data)) throw new TypeError("Data is not an object");
        this.#data = {
            bot: data.bot ?? false,
            username: data.username
        };
    };

    get bot() {
        return !!this.#data.bot;
    };

    connect(host, port) {
        let server = new Server({
            host, port
        }, this);
        server
            .on("connect", () => this.#servers.set(server.ip.full, server))
            .on("disconnect", () => this.#servers.delete(server.ip.full, server))
            .connect();
    };

    disconnect(server) {
        if(!this.#servers.has(server.addresss)) throw new Error("Client is not connected to the server");
        this.server.disconnect();
    };

    get servers() {
        return Array.from(this.#servers.values());
    };

    toJSON() {
        return {
            bot: this.bot,
            servers: this.servers.map(v => v.toJSON()),
            username: this.username
        }
    };

    toString() {
        return JSON.stringify(this.toJSON()) + "\0xdiv";
    };

    get username() {
        return `${this.#data.username}`;
    };
};

// Exports
module.exports = Client;