const mongoose = require('mongoose');

const TemperatureSensor = require('./dht11-sensors');
const HardwareController = require('./hardware-controller');
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
			if (sensor.name === "indoor") {
				currentIndoorTemperature = temperature;
			}
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
	if (currentIndoorTemperature < termosthatValue) {
		console.log("#Scheduler: Furnace enabled");
		HardwareController.changeFurnaceState(1);
		Repository.setFurnaceState(true);
	} else {
		console.log("#Scheduler: Furnace disabled");
		HardwareController.changeFurnaceState(0);
		Repository.setFurnaceState(false);
	}
}

function watchConsumption(){
	HardwareController.onConsumptionChange(function(err, value){
		console.log("#Scheduler: Consumption change detected, updating db.");
		Repository.updateConsumption(config.gasConsumptionOnTick, Date.now())
			.then(() => {
				console.log("#Scheduler: Consumption updated successfully");
			})
			.catch((err) => {
				console.error("#Scheduler: Unable to update gas consumption", err);
			});
	});
}

function cleanup() {
	clearInterval(job);
}

let job = undefined;
let termosthatValue = config.defaultThermostatValue;
let currentIndoorTemperature = config.defaultThermostatValue;

process.on('message', (msg) => {
    switch (msg) {
        case "START":
			console.log("#Scheduler: Recieved 'START' message, starting with interval = " + config.schedulerSeconds + " seconds.");
			watchConsumption();
            job = setInterval(measure, config.schedulerSeconds * 1000);
            break;
        case "END":
			console.log("#Scheduler: Recieved 'END' message");
            cleanup();
            exit(0);
            break;
        default:
			let value = parseInt(msg);
            console.log("#Scheduler: Recieved 'UPDATE_THERMOSTAT' message with value: " + value);
            termosthatValue = value;
            break;
    }
});
