# Honk.js

Honk.js - Plain Node.js terminal chatting program made by DmmD and iiPython.

## Features

- Zero Dependencies
- Optimized
- Easy to understand syntax

## Installation

Open a bash terminal with Node.js properly installed:

```
npm i honk.js@latest --save
```

## Requirements

Recommended:

-Node: `v16.4.0`
-npm: `v7.18.1`

Minimum (Not Yet Tested):

-Node: `v14.17.1`
-npm: `v7.18.1`

## Examples

Simple Interface:

```js
"use strict";

// Imports
const { Client } = require("honk.js");

// Creates client
let client = new Client({ username: "USERNAME" });

// Events
client.on("connect", server => {
    console.log(`I've joined a server called ${server.name}!`);
});
client.on("message", (message, server) => {
    console.log(`${server.name} >> ${message.user.username} | ${message.content}`);
});

// Joins server
client.connect("0.0.0.0", 6969);
```

Simple API Bot:

```js
"use strict";

// Imports
const { Client } = require("honk.js");

// Creates client
let client = new Client({
    bot: true,
    username: "USERNAME"
});

// Events
client.on("connect", server => {
    console.log(`I've joined a server called ${server.name}!`);
});
client.on("message", (message, server) => {
    let args = message.content.split(" ");
    if(args[0] === "ping") server.send("Pong!");
});

// Joins server
client.connect("0.0.0.0", 2075);
```

## Credits & Special Thanks
iiPython

- Bug finding & supporting

# Contact Information
- Discord Username: `DmmD - Dm123321_31mD Gaming#9423`
- Discord Server (Fastest Approach): https://discord.gg/7yvKJfh3fa
- Email: `dm12332131mdgaming@gmail.com`
- Github: https://github.com/Dm12332131mD