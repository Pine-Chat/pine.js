"use strict";

/**
 * Message class
 */
class Message {

    /**
     * Creates a new message
     * @param {Client} client Client 
     * @param {User} user User
     * @param {object} data Data
     */
    constructor(client, user, data) {
        this.data = Message.parse({ client, user, ...data });
        Object.assign(this, this.data);
    };

    /**
     * Parses data for the message
     * @static
     * @param {object} data 
     * @returns {object}
     */
    static parse(data) {
        if(typeof data !== "object") throw new TypeError("Argument is not an object");
        return {
            client: data.client,
            content: data.content,
            createdDate: data.createdDate ?? new Date(),
            createdTimestamp: data.createdTimestamp ?? Date.now(),
            server: data?.user?.server ?? null,
            user: data?.user ?? null,
        };
    };
};

// Exports
module.exports = Message;