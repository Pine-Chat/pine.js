"use strict";

const dutils = require("@dmmdjs/dutils");
// Imports
const Message = require("./Message.js");
const User = require("./User.js");

/**
 * Honk.js server
 */
class Server {
    #data = {};

    /**
     * Creates a new server
     * @param {object} data Data
     */
    constructor(data) {
        let parsed = Server.parse(data);
        for(let k in parsed) {
            Object.defineProperty(this.#data, k, {
                configurable: false,
                enumerable: true,
                value: parsed[k],
                writable: false
            });
        };
        Object.assign(this, this.#data);
    };

    /**
     * Returns the data of this server
     * @readonly
     * @returns {object}
     */
    get data() {
        return this.#data;
    };

    /**
     * Returns the join date of this server
     * @readonly
     * @returns {Date}
     */
    get joinedDate() {
        return new Date(this.#data.joinedTimestamp);
    };

    /**
     * Parses a server data
     * @static
     * @param {object} data Data
     * @returns {object}
     */
    static parse(data) {
        if(typeof data !== "object") throw new TypeError("Argument is not a function");
        return {
            client: data.client,
            connection: data.connection,
            joinedTimestamp: data.joinedTimestamp,
        };
    };

    send(message) {
        if(message instanceof Message) this.#data.connection.write({
            content: message.content,
            createdTimestamp: message.createdTimestamp,
            uid: message.client.uid,
            type: "MESSAGE"
        });
        else this.#data.connection.write({
            content: message,
            createdTimestamp: Date.now(),
            uid: this.#data.client.uid,
            type: "MESSAGE"
        });
    };
};

// Exports
module.exports = Server;