const mongoose = require('mongoose');

const TemperatureSensor = require('./dht11-sensors');
const Repository = require('../db/repository');
const config = require('../../config');

mongoose.connect(config.databaseUrl, {useMongoClient: true}, (err) => {
    if (err) {
        console.error("#Scheduler: Unable to connect to db. Exiting...", err);
        exit(-1);
    } else {
        console.log("#Scheduler: Established connection to db: " + config.databaseUrl);
    }
});

function readAndSave(sensor){
	TemperatureSensor.read(sensor)
		.then((temperature) => {
			let timestamp = Date.now();
			return Repository.saveTemperature(sensor.name, temperature, timestamp);
		})
		.then(() => {
            console.log("#Scheduler: " + sensor.name +" temperature saved successfully.");
        })
        .catch((err) => {
			console.error("#Scheduler: Unable to save temperature.", err);
		});
}

function measure() {
	readAndSave(TemperatureSensor.IndoorSensor);
	readAndSave(TemperatureSensor.OutdoorSensor);
}

let job = undefined;

process.on('message', (msg) => {
    switch (msg) {
        case "START":
			console.log("#Scheduler: Recieved 'START' message, starting with interval = " + config.schedulerSeconds + " seconds.");
            job = setInterval(measure, config.schedulerSeconds * 1000);
            //job = setInterval(measure, 10);
            break;
        case "END":
			console.log("#Scheduler: Recieved 'END' message");
            clearInterval(job);
            exit(0);
            break;
    }
});
