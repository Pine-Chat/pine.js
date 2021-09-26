"use strict";

// Imports
const { DCache, DJSON } = require("@dmmdjs/dutils");
const Events = require("events");
const net = require("net");
const parseAddress = require("../../utils/parseAddress.js");
const Message = require("./Message.js");
const User = require("./User.js");

/**
 * Honk.js server
 * @extends Events
 */
class Server extends Events {
    #address;
    #cache = new DCache();
    #connection = null;
    #createdTimestamp = Date.now();
    #uid = 0;
    #users = new DCache();
    #startedTimestamp = null;

    /**
     * Creates a new server
     * @param {string} address Address
     */
    constructor(address) {
        super();
        this.#address = address;
    };

    /**
     * Returns the address the server is connecting to
     * @readonly
     * @returns {string}
     */
    get address() {
        return this.#address;
    };

    /**
     * Broadcasts a message to all users
     * @param {any} data Data
     */
    broadcast(data) {
        if(!this.started) throw new Error("Server hasn't started yet");
        for(user of this.#users) user.write(DJSON.stringify(data));
        super.emit("broadcast", data);
    };

    /**
     * Returns the cache of this server
     * @readonly
     * @returns {DCache}
     */
    get cache() {
        return this.#cache;
    };

    /**
     * Returns the connection
     * @readonly
     * @returns {net.Socket}
     */
    get connection() {
        return this.#connection;
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
     * Ends the connection of this server
     */
    end() {
        if(!this.started) throw new Error("Server hasn't started yet");
        this.#connection.end(() => {
            this.#cache.clear();
            this.#connection = null;
            this.#uid = 0;
            this.#users.clear();
            this.#startedTimestamp = null;
            super.emit("end");
        });
    };

    /**
     * Returns whether or not this server has been started
     * @readonly
     * @returns {boolean}
     */
    get started() {
        return !!this.#connection;
    };
    
    /**
     * Starts the connection of this server
     * @async
     */
    async start() {
        if(this.started) throw new TypeError("Server has already been started");
        let [ ip, port ] = await parseAddress(this.#address);
        this.#connection = net.createServer();
        this.#connection.listen(port, ip);
        this.#connection.on("connect", connection => {
            connection.on("data", data => {
                for(let chunk of data.toString().split("\0xdiv").slice(0, -1)) {
                    let parsed = DJSON.parse(chunk);
                    if(typeof parsed !== "object" || !("type" in parsed)) continue;
                    super.emit("data", parsed);
                    switch(parsed.type) {
                        case "connect": {
                            this.#uid += Math.floor(Math.random() * 50);
                            this.#users[this.#uid] = new User(this.#uid, connection, this);
                            break;
                        };
                        case "disconnect": {
    
                        };
                        case "message": {
    
                        };
                    };
                };
            });
            connection.on("error", error => {
                super.emit("error", error);
                
            });
        });
        this.#connection.on("error", error => {
            super.emit("error", error);
            this.end();
        });
    };

    /**
     * Returns the starting date of this server
     * @readonly
     * @returns {Date|null}
     */
    get startedDate() {
        if(this.#startedTimestamp === null) return null;
        return new Date(this.#startedTimestamp);
    };

    /**
     * Returns the starting timestamp of this server
     * @readonly
     * @returns {number|null}
     */
    get startedTimestamp() {
        return this.#startedTimestamp;  
    };

    /**
     * Returns the current uid counter
     * @readonly
     * @returns {number}
     */
    get uid() {
        return this.#uid;
    };

    /**
     * Finds a user in this server based on its uid
     * @param {number} uid UID
     * @returns {User|null}
     */
    user(uid) {
        if(!(uid in this.#users)) return null;
        return this.#users[uid];
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