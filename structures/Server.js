"use strict";

// Imports
const Address = require("../managers/Address.js");
const Events = require("events");
const net = require("net");
const Message = require("./Message.js");
const Packet = require("../managers/Packet.js");
const User = require("./User.js");

/**
 * Server class
 * @extends Events
 */
class Server extends Events {

    /**
     * Creates a new server
     * @param {Client} client Client
     * @param {string} host Host
     * @param {port} port Port
     */
    constructor(client, host, port) {
        super();
        this.data = Server.parse({ client, host, port });
        Object.assign(this, this.data);
    };

    /**
     * Broadcasts an event
     * @param {string} event Event name
     * @param  {...any} data Data
     */
    broadcast(event, ...data) {
        if(typeof event !== "string") throw new TypeError("Argument is not a string");
        super.emit(event, ...data);
        this.client.emit(event, ...data, this);
    };

    /**
     * Connects to the server
     */
    connect() {
        if(this.connection) throw new Error("A connection has already been established");
        this.client.cache.get("servers")[Address.pack(this.host, this.port)] = this;
        this.connection = net.createConnection({ host: this.host, port: this.port });
        this.connection.write(Packet.pack({
            action: "identify",
            bot: this.client.bot,
            engine: "Honk.js",
            username: this.client.username
        }));
        this.connection.on("data", data => {
            Packet.unjam(data).forEach(packet => {
                this.broadcast("data", packet);
                switch(packet.status) {
                    case 101: {
                        let user = new User(this.client, this, packet.affects);
                        this.cache.get("users")[user.username] = user;
                        this.broadcast("join", user);
                        break;
                    };
                    case 102: {
                        let user = this.user(packet.affects.username);
                        delete this.cache.get("users")[packet.affects.username];
                        this.broadcast("leave", user);
                        break;
                    };
                    case 103: {
                        this.cache.set("users", Object.fromEntries(packet.server.users.map(u => [
                            u.username,
                            new User(this.client, this, u)
                        ])));
                        this.cache.get("users")["System"] = new User(this.client, this, {
                            bot: false,
                            engine: "Honk.js",
                            joinedDate: new Date(0),
                            joinedTimestamp: 0,
                            server: this,
                            system: true,
                            username: "System"
                        });
                        this.connectedDate = new Date();
                        this.connectedTimestamp = Date.now();
                        this.createdDate = new Date(packet.createdTimestamp);
                        this.createdTimestamp = packet.createdTimestamp;
                        this.name = packet.server.name;
                        this.broadcast("connect");
                        break;
                    };
                    case 200: {
                        this.broadcast("message", new Message(this.client, this.user(packet.author.username), packet));
                        break;
                    };
                    case 201: {
                        this.broadcast("notification", new Message(this.client, this.user("System"), packet));
                        break;
                    };
                };
            });
        });
        this.connection.on("end", () => {
            this.broadcast("disconnect");
            this.cache.set("users", {});
            this.connection = null;
            this.connectedDate = null;
            this.connectedTimestamp = null;
            this.createdDate = null;
            this.createdTimestamp = null;
            this.name = null;
        });
        this.connection.on("error", error => {
            this.broadcast("error", error);
            this.disconnect();
        });
    };

    /**
     * Disconnects from the server
     */
    disconnect() {
        if(!this.connection) throw new Error("No connection has been established yet");
        delete this.client.cache.get("servers")[Address.pack(this.host, this.port)];
        this.connection.end(Packet.pack({ action: "disconnect" }));
    };

    /**
     * Parses data for the server
     * @static
     * @param {object} data 
     * @returns {object}
     */
    static parse(data) {
        if(typeof data !== "object") throw new TypeError("Argument is not an object");
        return {
            cache: new Map([
                [ "users", {} ]
            ]),
            connectedDate: null,
            connectedTimestamp: null,
            connection: null,
            client: data.client,
            createdDate: null,
            createdTimestamp: null,
            host: data.host,
            name: data.name,
            port: data.port
        };
    };

    send(string) {
        if(!this.connection) throw new Error("No connection has been established yet");
        this.connection.write(Packet.pack({
            action: "send",
            data: `${string}`
        }));
    };

    /**
     * Returns the user based on the username
     * @param {string} username Username
     * @returns {?User}
     */
    user(username) {
        if(typeof username !== "string") throw new TypeError("Argument is not a string");
        return this.cache.get("users")[username];
    };

    /**
     * Returns all users in the server
     * @readonly
     * @returns {User[]}
     */
    get users() {
        return Object.values(this.cache.get("users"));
    };
};

// Exports
module.exports = Server;