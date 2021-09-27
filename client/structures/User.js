"use strict";

class User {
    #connection;
    #data;
    #server;
    #uid;
    
    constructor(data, connection, uid, server) {
        this.#data = data;
        this.#connection = connection;
        this.#uid = uid;
        this.#server = server;    
    };

    get connection() {
        return this.#connection;
    };

    get data() {
        return this.#data;
    };

    get server() {
        return this.#server;
    };

    get uid() {
        return this.#uid;
    };
};

// Exports
module.exports = User;