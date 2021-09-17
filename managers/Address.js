"use strict";

// Imports
const net = require("net");

/**
 * Address manager
 * @extends null
 */
class Address extends null {

    /**
     * Returns whether or not the values are a valid address
     * @static
     * @param {string} host Host
     * @param {number} port Port
     * @returns {boolean}
     */
    static isAddress(host, port) {
        if(!net.isIP(host) || isNaN(port)) return false;
        return true;
    };

    /**
     * Packs an address into a string
     * @static
     * @param {string} host Host
     * @param {number} port Port
     * @returns {string}
     */
    static pack(host, port) {
        if(!Address.isAddress(host, port)) throw new TypeError("Argument is not a valid address");
        return `${host}:${port}`;
    };

    /**
     * Unpacks a string into an address
     * @static
     * @param {string} string String
     * @returns {{ host: string, port: number }}
     */
    static unpack(string) {
        if(typeof string !== "string") throw new TypeError("Argument is not a string");
        let [ host, port ] = string.split(":");
        if(!Address.isAddress(host, port)) throw new TypeError("Argument is not a valid address");
        return { host, port };
    };
};

// Exports
module.exports = Address;