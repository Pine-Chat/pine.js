"use strict";

// Imports
const { DCache, DJSON } = require("@dmmdjs/dutils");
const Events = require("events");
const net = require("net");
const parseAddress = require("../../utils/parseAddress.js");

class Client extends Events {
    #bot;
    #createdTimestamp = Date.now();
    #servers = new DCache();
    #username;
    
    constructor(username, bot = false) {
        if(typeof username !== "string") throw new TypeError("Argument is not a string");
        if(typeof bot !== "boolean") throw new TypeError("Argument is not a boolean");
        this.#username = username;
        this.#bot = bot;
    };

    get bot() {
        return this.#bot;
    };

    async connect(h, p) {
        let [ ip, port ] = await parseAddress(`${h}:${p}`);
        let address = `${ip}:${port}`;
        this.#servers[address] = new net.createConnection(port, ip)
            .on("connect", () => super.emit("connect"))
            .on("data", raw => {
                for(let chunk of raw.toString().split("\0xdiv").slice(0, -1)) {
                    let data = DJSON.parse(chunk);
                    if(typeof data !== "object" || !("type" in data)) continue;
                    super.emit("data", data);
                    switch(data.type) {
                        case "message": {
                            super.emit("message", data);
                            break;
                        };
                    };
                };
            })
            .on("end", () => {
                let server = this.server(address);
                super.emit("disconnecting", server);
                server.end();
                delete this.#servers[address];
                super.emit("disconnect", server);
            })
            .on("error", error => {
                super.emit("error", error);
                let server = this.server(address);
                super.emit("disconnecting", server);
                server.end();
                delete this.#servers[address];
                super.emit("disconnect", server);
            });
        super.emit("connecting");
    };

    get createdDate() {
        return new Date(this.#createdTimestamp);
    };

    get createdTimestamp() {
        return this.#createdTimestamp;
    };

    server(ip, port) {
        let address = `${port}:${ip}`;
        return address in this.#servers ? this.#servers[address] : null;
    };

    get servers() {
        return this.#servers;
    };

    get username() {
        return this.#username;
    };
};

// Exports
module.exports = Client;