"use strict";

// Imports
const isObject = require("../../src/functions/isObject.js");

class Configuration {
    #configuration;

    constructor(configuration) {
        if(!isObject(configuration)) throw new TypeError("Configuration is not an object");
        this.#configuration = new Map(Object.entries(configuration));
    };

    delete(key) {
        let cache = null;
        `${key}`.split(".").forEach((v, i, a) => {
            if(i === a.length - 1) i === 0 ? this.#configuration.delete(v) : delete cache?.[v];
            else cache = i === 0 ? this.#configuration.get(v) : cache?.[v];
        });
    };

    edit(key, value) {
        let cache = null;
        `${key}`.split(".").forEach((v, i, a) => {
            if(i === a.length - 1) i === 0 ? this.#configuration.set(v, value) : cache[v] = value;
            else cache = i === 0 ? this.#configuration.get(v) : cache?.[v];
        });
    };

    ensure(key, value) {
        if(!this.exists(key)) this.edit(key, value);
    };

    exists(key) {
        let cache = null;
        `${key}`.split(".").forEach((v, i, a) => {
            if(i === a.length - 1) return i === 0 ? this.#configuration.has(v) : v in cache;
            else cache = i === 0 ? this.#configuration.get(v) : cache?.[v];
        });
    };

    get(key) {
        let cache = null;
        `${key}`.split(".").forEach((v, i) => cache = i === 0 ? this.#configuration.get(v) : cache?.[v]);
        return cache;
    };

    toJSON() {
        return JSON.parse(JSON.stringify(Object.fromEntries(this.#configuration.entries())));
    };

    toString() {
        return JSON.stringify(Object.fromEntries(this.#configuration.entries())) + "\0xdiv";
    };
};

// Exports
module.exports = Configuration;