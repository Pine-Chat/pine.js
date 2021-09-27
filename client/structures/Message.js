"use strict";

class Message {
    #data;
    #user;

    constructor(data, user) {
        this.#data = data;
        this.#user = user;
    };

    get content() {
        return this.#data.content;
    };

    get data() {
        return this.#data;
    };

    get user() {
        return this.#user;
    };
};

// Exports
module.exports = Message;