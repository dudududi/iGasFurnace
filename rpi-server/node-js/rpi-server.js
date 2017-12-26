const mongoose = require('mongoose');

const config = require('../config');
const server = require('./server/server-utils');
const rest = require('./server/rest-api');
const Repository = require('./db/repository');

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
}