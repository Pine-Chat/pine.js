"use strict";

// Imports
const { DJSON, DCache } = require("@dmmdjs/dutils");
const Events = require("events");
const Message = require("./Message.js");
const net = require("net");
const parseAddress = require("../../utils/parseAddress.js");
const User = require("./User.js");

class Server extends Events {
    #address;
    #createdTimestamp = Date.now();
    #socket = null;
    #uid = 0;
    #users = new DCache();

    constructor(address) {
        super();
        this.#address = address;
    };

    get address() {
        return this.#address;
    };

    broadcast(data) {
        if(!this.#socket) throw new Error("Server is currently offline");
        for(let user of this.#users) this.send(user.uid, data);
    };

    get createdDate() {
        return new Date(this.#createdTimestamp);
    };

    get createdTimestamp() {
        return this.#createdTimestamp;
    };

    end() {
        if(!this.#socket) throw new Error("Server is currently offline");
        this.#socket.on("close", () => {
            this.#socket = null;
            this.#uid = 0;
            this.#users.clear();
        });
    };

    get isOnline() {
        return !!this.#socket;
    };

    send(uid, data) {
        if(!this.#socket) throw new Error("Server is currently offline");
        if(!(uid in this.#users)) throw new Error("Cannot find the user");
        this.#users[uid].connection.write(DJSON.stringify(data) + "\0xdiv");
    };

    get socket() {
        return this.#socket;
    };

    async start() {
        if(this.#socket) throw new Error("Server is already running");
        let [ ip, port ] = await parseAddress(this.#address);
        this.#socket = net.createServer()
            .on("connection", connection => {
                this.#uid += Math.floor(Math.random() * 100);
                let uid = this.#uid;
                let timeout = setTimeout(() => connection.end(), 10000);
                connection
                    .on("data", raw => {
                        for(let chunk of raw.toString().split("\0xdiv").slice(0, -1)) {
                            let data = DJSON.parse(chunk);
                            if(typeof data !== "object" || !("type" in data)) continue;
                            switch(data.type) {
                                case "authenticate": {
                                    if(uid in this.#users) return;
                                    clearTimeout(timeout);
                                    let user = new User(data, connection, uid, this);
                                    this.#users[uid] = user;
                                    super.emit("connect", user);
                                    break;
                                };
                                case "message": {
                                    if(!(uid in this.#users)) return;
                                    this.broadcast({
                                        content: data.content,
                                        createdTimestamp: Date.now(),
                                        uid,
                                        type: "message"
                                    });
                                    let user = this.user(uid);
                                    super.emit("message", new Message(data, user));
                                    break;
                                };
                            };
                        };
                    })
                    .on("end", () => {
                        if(!(uid in this.#users)) return;
                        let user = this.user(uid);
                        super.emit("disconect", user);
                        delete this.#users[user.uid];
                    })
                    .on("error", error => {
                        if(!(uid in this.#users)) return;
                        let user = this.#users[uid];
                        super.emit("disconect", user);
                        super.emit("error", error);
                        user.connection.end();
                        delete this.#users[user.uid];
                    });

            })
            .on("error", error => {
                super.emit("error", error);
                this.end();
            })
            .on("listening", () => super.emit("start"));
        this.#socket.listen(port, ip);
    };
    
    user(uid) {
        return uid in this.#users ? this.#users[uid] : null;
    };

    get users() {
        return this.#users;
    };
};

// Exports
module.exports = Server;