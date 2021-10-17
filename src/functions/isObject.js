"use strict";

function isObject(value) {
    return typeof value === "object" && value !== null;
};

// Exports
module.exports = isObject;