"use strict";

// Imports
const Address = require("../managers/Address.js");
const Events = require("events");
const Server = require("./Server.js");

/**
 * Client class
 * @extends Events
 */
class Client extends Events {

    /**
     * Creates a new client
     * @param {{
     *     bot: boolean,
     *     username: string
     * }} data Data
     */
    constructor(data) {
        super();
        this.data = Client.parse(data);
        Object.assign(this, this.data);
    };

    /**
     * Connects to a server
     * @param {string} host Host
     * @param {number} port Port
     * @returns {Server}
     */
    connect(host, port) {
        if(this.server(host, port)) throw new TypeError("Server is already connected");
        let server = new Server(this, host, port);
        server.connect();
    };

    /**
     * Disconnects from a server
     * @param {string} host Host
     * @param {number} port Port
     * @returns {Server}
     */
    disconnect(host, port) {
        let server = this.server(host, port);
        if(!server) throw new Error("Server not found");
        server.disconnect();
    };

    /**
     * Parses data for the client
     * @static
     * @param {object} data 
     * @returns {object}
     */
    static parse(data) {
        if(typeof data !== "object") throw new TypeError("Argument is not an object");
        return {
            bot: data.bot,
            cache: new Map([
                [ "servers", {} ]
            ]),
            createdDate: new Date(),
            createdTimestamp: Date.now(),
            username: data.username
        };
    };

    /**
     * Returns the server based on the host and port
     * @param {string} host Host
     * @param {number} port Port
     * @returns {?Server}
     */
    server(host, port) {
        if(!Address.isAddress(host, port)) throw new TypeError("Argument is not a valid address");
        return this.cache.get("servers")[Address.pack(host, port)];
    };

    /**
     * Returns all servers in the server
     * @readonly
     * @returns {Server[]}
     */
    get servers() {
        return Object.values(this.cache.get("servers"));
    };
};

// Exports
module.exports = Client;