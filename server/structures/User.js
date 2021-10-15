"use strict";

// Imports
const Packet = require("./Packet.js");

class User {
    #connection;

    constructor(connection, data, server, uid) {
        this.#connection = connection;
        this.data = data;
        this.server = server;
        this.uid = uid;
        Object.assign(this, data);
    };

    get joinDate() {
        return new Date(this.data.joinTimestamp);
    };

    toJSON() {
        return {
            bot: this.data.bot,
            joinTimestamp: this.data.joinTimestamp,
            uid: this.uid,
            username: this.data.username
        };
    };

    write(data) {
        this.#connection.write(Packet.pack(data));
    };
};

// Exports
module.exports = User;