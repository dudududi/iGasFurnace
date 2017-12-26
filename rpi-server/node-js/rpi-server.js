const mongoose = require('mongoose');

const config = require('../config');
const server = require('./server/server-utils');
const rest = require('./server/rest-api');
const Repository = require('./db/repository');
const { fork } = require('child_process');

let scheduler;

mongoose.connect(config.databaseUrl, {useMongoClient: true}, (err) => {
    if (err) {
        console.error("Unable to connect to db. ", err);
    } else {
        console.log("Established connection to db: " + config.databaseUrl);
        start();
    }
});


function start() {
    server.configure("8080");
    rest.configure(Repository);
    scheduler = fork('node-js/hardware/measurement-scheduler.js');
    scheduler.send('START');
}

function exit() {
    console.log("Stopping scheduler...");
    scheduler.send("STOP");
    process.exit(0);
}

process.on('exit', exit.bind(null));
process.on('SIGTERM', exit.bind(null));
process.on('SIGINT', exit.bind(null));
process.on('uncaughtException', exit.bind(null));
