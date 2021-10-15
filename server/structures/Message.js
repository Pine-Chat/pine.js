"use strict";

class Message {
    constructor(data, user) {
        this.data = data;
        this.user = user;
        Object.assign(this, this.data);
    };

    get createDate() {
        return new Date(this.data.createTimestamp);
    };

    get server() {
        return this.user.server;
    };

    toJSON() {
        return {
            content: this.data.content,
            createTimestamp: this.data.createTimestamp,
            uid: this.user.uid
        };
    };
};

// Exports
module.exports = Message;