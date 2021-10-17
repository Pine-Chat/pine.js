"use strict";

// Imports
const isObject = require("../../src/functions/isObject.js");

class Message {
    #data;
    #user;
    
    constructor(data, user) {
        if(!isObject(data)) throw new TypeError("Data is not an object");
        this.#data = {
            content: data.content,
            createdTimestamp: data.createdTimestamp,
            mid: data.mid,
            system: data.system
        };
        this.#user = user;
    };

    get content() {
        return `${this.#data.content}`;
    };

    get createdDate() {
        return new Date(this.#data.createdTimestamp);
    };

    get createdTimestamp() {
        return +this.#data.createdTimestamp;
    };

    get mid() {
        return +this.#data.mid;
    };

    get server() {
        return this.#user.server;
    };

    get system() {
        return !!this.#data.system;
    };

    toJSON() {
        return {
            content: this.content,
            createdTimestamp: this.createdTimestamp,
            mid: this.mid,
            system: this.system,
            uid: this.#user.uid
        };
    };

    toString() {
        return JSON.stringify(this.toJSON()) + "\0xdiv";
    };

    get user() {
        return this.#user;
    };
};

// Exports
module.exports = Message;