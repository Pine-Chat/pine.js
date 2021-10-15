"use strict";

/**
 * Packet handler
 * @extends {null}
 */
class Packet extends null {

    /**
     * Returns whether or not a value is a valid JSON
     * @static
     * @param {string|Buffer} value value
     * @returns {boolean}
     */
    static isJSON(value) {
        try { 
            JSON.parse(value);
            return true;
        }
        catch { return false }
    };

    /**
     * Packs an object into a packet
     * @static
     * @param {object} object Object
     * @returns {string}
     */
    static pack(object) {
        if(typeof object !== "object") throw new TypeError("Argument is not an object");
        return JSON.stringify(object) + "\0xdiv";
    };

    /**
     * Unpacks a buffer packet into an array of objects
     * @static
     * @param {Buffer} buffer Buffer
     * @returns {object[]}
     */
    static unpack(buffer) {
        let string = buffer.toString();
        if(!string.endsWith("\0xdiv")) throw new Error("Data is not a valid packet");
        let chunks = buffer.toString().split("\0xdiv").slice(0, -1);
        if(!chunks.every(c => Packet.isJSON(c))) throw new Error("Data is not a valid packet");
        return chunks.map(c => JSON.parse(c));
    };
};

// Exports
module.exports = Packet;