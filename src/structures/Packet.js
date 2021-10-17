"use strict";

class Packet {
    #data;
    constructor(data) {
        if(typeof data !== "object") throw new TypeError("Argument is not an object");
        this.#data = data;
    };

    get data() {
        return this.#data;
    };

    static parse(raw) {
        try {
            if(typeof raw === "object" && !Buffer.isBuffer(raw)) return new Packet(raw);
            let string = raw.toString();
            if(!string.endsWith("\0xdiv")) throw new Error("Provided data is not parsable");
            return raw.toString().split("\0xdiv").slice(0, -1).map(v => new Packet(JSON.parse(v)));
        }
        catch { throw new Error("Provided data is not parsable") };
    };

    toJSON() {
        return JSON.parse(JSON.stringify(this.#data));
    };

    toString() {
        return JSON.stringify(this.#data) + "\0xdiv";
    };
};

// Exports
module.exports = Packet;