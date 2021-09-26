"use strict";

/**
 * Honk.js message
 */
class Message {
    #data = {};

    /**
     * Creates a new message
     * @param {object} data Data
     */
    constructor(data) {
        let parsed = Message.parse(data);
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
     * Returns the creation date of this message
     * @readonly
     * @returns {Date}
     */
    get createdDate() {
        return new Date(this.#data.createdTimestamp);
    };

    /**
     * Returns the data of this message
     * @readonly
     * @returns {object}
     */
    get data() {
        return this.#data;
    };

    /**
     * Parses a message data
     * @static
     * @param {object} data Data
     * @returns {object}
     */
    static parse(data) {
        if(typeof data !== "object") throw new TypeError("Argument is not a function");
        return {
            content: data.content,
            createdTimestamp: data.createdTimestamp,
            server: data.server,
            user: data.user
        };
    };
};

// Exports
module.exports = Message;