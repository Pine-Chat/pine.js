"use strict";

// Imports
const fs = require("fs");
const path = require("path");

function getFiles(directory) {
    if(!fs.existsSync(directory)) throw new Error("Directory does not exist");
    return Object.fromEntries(fs.readdirSync(directory).filter(f => f.endsWith(".js")).map(f => [
        f.slice(0, -3), require(path.join(directory, f))
    ]));
};

// Exports
module.exports = getFiles;