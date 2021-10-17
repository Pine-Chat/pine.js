"use strict";

class PacketError extends Error {
    #code;
    #createdTimestamp = Date.now();
    #message;
    #name = "PacketError";

    constructor(message, code) {
        super();
        this.#message = `${message}`;
        this.#code = `${code}`.toUpperCase();
        Error.captureStackTrace(this, PacketError);
    };

    get code() {
        return this.#code;
    };

    get createdDate() {
        return new Date(this.#createdTimestamp);
    };

    get createdTimestamp() {
        return this.#createdTimestamp;
    };

    static fromError(error) {
        if(!(error instanceof Errror)) throw new Error("Argument is not an error");
        return new PacketError(error.message, "UNKNOWN");
    };

    get message() {
        return this.#message;
    };

    get name() {
        return this.#name;
    };

    toJSON() {
        return {
            code: this.code,
            createdTimestamp: this.createdTimestamp,
            message: this.message,
            name: this.name
        };
    };

    toString() {
        return JSON.stringify(this.toJSON()) + "\0xdiv";
    };
};

// Exports
module.exports = PacketError;