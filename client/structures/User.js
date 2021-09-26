"use strict";

/**
 * Honk.js user
 */
class User {
    #data = {};

    /**
     * Creates a new user
     * @param {object} data Data
     */
    constructor(data) {
        let parsed = User.parse(data);
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
     * Returns the data of this user
     * @readonly
     * @returns {object}
     */
    get data() {
        return this.#data;
    };

    /**
     * Returns the join date of this user
     * @readonly
     * @returns {Date}
     */
    get joinedDate() {
        return new Date(this.#data.joinedTimestamp);
    };

    /**
     * Parses a user data
     * @static
     * @param {object} data Data
     * @returns {object}
     */
    static parse(data) {
        if(typeof data !== "object") throw new TypeError("Argument is not a function");
        return {
            bot: data.bot,
            connection: data.connection,
            joinedTimestamp: data.joinedTimestamp,
            server: data.server,
            uid: data.uid,
            username: data.username
        };
    };
};

// Exports
module.exports = User;