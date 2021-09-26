const net = require("net");
let socket = net.createConnection(2075, "10.0.0.200");
socket.on("data", data => {
    console.log(JSON.parse(data.toString().split("\0xdiv")[0]));
});

setTimeout(() => {
    socket.write(JSON.stringify({
        type: "authenticate"
    }) + "\0xdiv");
}, 1000);
setTimeout(() => {
    console.log("test");
    socket.write(JSON.stringify({
        content: "yo",
        type: "message"
    }) + "\0xdiv");
}, 3000);