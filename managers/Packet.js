"use strict";

/**
 * Packet manager
 * @extends null
 */
class Packet extends null {

    /**
     * Returns whether or not a value is a valid JSON
     * @static
     * @param {Buffer|object|string} v Value
     * @returns {boolean}
     */
    static isJSON(v) {
        if(typeof v === "object") return true;
        try {
            JSON.parse(v instanceof Buffer ? v.toString() : v);
            return true;
        }
        catch { return false };
    };

    /**
     * Unjams a weirdly formatted JSON
     * @static
     * @param {Buffer|object|string} v Value
     * @returns {object}
     */
    static unjam(v) {
        if(!(v instanceof Buffer) && typeof v !== "string") throw new TypeError("Argument is not a valid json");
        let packets = (v instanceof Buffer ? v.toString() : v).split("\0x55").slice(-1);
        return packets.map(p => Packet.unpack(p));
    };

    /**
     * Unpacks a JSON string into an object
     * @static
     * @param {Buffer|string} v Value
     * @returns {object}
     */
    static unpack(v) {
        if(!Packet.isJSON(v)) throw new TypeError("Argument is not a valid json");
        return JSON.parse(v instanceof Buffer ? v.toString() : v);
    };
    
    /**
     * Packs an object into a JSON string
     * @static
     * @param {object} v Value
     * @returns {string}
     */
    static pack(v) {
        if(typeof v !== "object") throw new TypeError("Argument is not an object");
        return JSON.stringify(v);
    };
};

// Exports
module.exports = Packet;