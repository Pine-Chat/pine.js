"use strict";

// Imports
const dns = require("dns");
const util = require("util");

// Variables
let parseIP = util.promisify(dns.lookup);

/**
 * Parses an address
 * @async
 * @param {string} address Address
 * @returns {[ string, number ]}
 */
async function parseAddress(address) {
    if(typeof address !== "string") throw new TypeError("Argument is not a string");
    let [ host, port ] = address.split(":");
    if(isNaN(port) || !Number.isInteger(+port) || +port < 0 || +port > 65535) throw new Error(`Invalid TCP port (${port})`);
    let ip;
    try {
        ip = await(parseIP(host));
    }
    catch {
        throw new Error(`Cannot find that hostname ${host}`);
    };
    return [ ip, +port ];
};

// Exports
module.exports = parseAddress;