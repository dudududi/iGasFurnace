const express = require('express');
const app = express();
const server = require('http').createServer(app);


function configure(serverPort) {
    if (!serverPort) {
        serverPort = 8080;
    }
    server.listen(serverPort)
}

module.exports = {
    serverApp: app,
    configure: configure
};