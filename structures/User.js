"use strict";

/**
 * User class
 */
class User {

    /**
     * Creates a new user
     * @param {Client} client Client 
     * @param {Server} server Server
     * @param {object} data Data
     */
    constructor(client, server, data) {
        this.data = User.parse({ client, server, ...data });
        Object.assign(this, this.data);
    };

    /**
     * Parses data for the user
     * @static
     * @param {object} data 
     * @returns {object}
     */
    static parse(data) {
        if(typeof data !== "object") throw new TypeError("Argument is not an object");
        return {
            bot: data.bot,
            engine: data.engine,
            joinedDate: new Date(data.joinedTimestamp),
            joinedTimestamp: data.joinedTimestamp,
            server: data.server,
            username: data.username
        };
    };
};

// Exports
module.exports = User;