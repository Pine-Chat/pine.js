"use strict";

// Imports
const isObject = require("../../src/functions/isObject.js");

class User {
    #data;
    #server;

    constructor(data, server) {
        if(!isObject(data)) throw new TypeError("Data is not an object");
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
        return this.#data.bot;
    };

    get joinedDate() {
        return new Date(this.#data.joinedTimestamp);
    };

    get joinedTimestamp() {
        return this.#data.joinedTimestamp;
    };

    get server() {
        return this.#server;
    };

    get status() {
        return +this.#server.users.some(v => v.uid === this.#data.uid);
    };

    get system() {
        return this.#data.system;
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
        return this.#data.uid;
    };

    get username() {
        return this.#data.username;
    };
};

// Exports
module.exports = User;