"use strict";

// Imports
const { DJSON, DCache } = require("@dmmdjs/dutils");
const Events = require("events");
const Message = require("./Message.js");
const net = require("net");
const parseAddress = require("../../utils/parseAddress.js");
const User = require("./User.js");

/**
 * Honk.js server
 * @extends Events
 */
class Server extends Events {
    #address;
    #createdTimestamp = Date.now();
    #socket = null;
    #uid = 0;
    #users = new DCache();

    /**
     * Creates a new server
     * @param {string} address Address
     */
    constructor(address) {
        super();
        this.#address = address;
    };

    /**
     * Returns the address of this server
     * @readonly
     * @returns {string}
     */
    get address() {
        return this.#address;
    };

    /**
     * Braodcasts a message to everyone
     * @param {any} data Data
     */
    broadcast(data) {
        if(!this.#socket) throw new Error("Server is currently offline");
        for(let user of this.#users) this.send(user.uid, data);
    };

    /**
     * Returns the creation date of this server
     * @readonly
     * @returns {Date}
     */
    get createdDate() {
        return new Date(this.#createdTimestamp);
    };

    /**
     * Returns the creation timestamp of this server
     * @readonly
     * @returns {number}
     */
    get createdTimestamp() {
        return this.#createdTimestamp;
    };

    /**
     * Ends this server
     */
    end() {
        if(!this.#socket) throw new Error("Server is currently offline");
        this.#socket.close();
        this.#socket.on("close", () => {
            super.emit("ending");
            this.#socket = null;
            this.#uid = 0;
            this.#users.clear();
            super.emit("end");
        });
    };

    /**
     * Returns if this server is online
     * @readonly
     * @returns {boolean}
     */
    get isOnline() {
        return !!this.#socket;
    };

    /**
     * Sends a data to a user
     * @param {number|string} uid User ID
     * @param {any} data Data
     */
    send(uid, data) {
        if(!this.#socket) throw new Error("Server is currently offline");
        if(!(uid in this.#users)) throw new Error("Cannot find the user");
        this.#users[uid].connection.write(DJSON.stringify(data) + "\0xdiv");
    };

    /**
     * Returns the socket of this server
     * @readonly
     * @returns {net.Socket}
     */
    get socket() {
        return this.#socket;
    };

    /**
     * Starts this server
     * @async
     */
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
                        super.emit("disconnect", user);
                        delete this.#users[user.uid];
                    })
                    .on("error", error => {
                        if(!(uid in this.#users)) return;
                        let user = this.#users[uid];
                        super.emit("disconnect", user);
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
        super.emit("starting");
    };
    
    /**
     * Finds a user by their user ID
     * @param {number|string} uid User ID
     * @returns {?User}
     */
    user(uid) {
        return uid in this.#users ? this.#users[uid] : null;
    };

    /**
     * Returns all users in this server
     * @readonly
     * @returns {DCache}
     */
    get users() {
        return this.#users;
    };
};

// Exports
module.exports = Server;