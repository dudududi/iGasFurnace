const TemperatureSensor = require('./dht11-sensors');
const Repository = require('../db/repository');
const config = require('../../config');

function measure() {
    let indoor = TemperatureSensor.read(TemperatureSensor.IndoorSensor);
    let outdoor = TemperatureSensor.read(TemperatureSensor.IndoorSensor);
    let timestamp = Date.now();

    Repository.saveTemperature(Repository.TemperatureType.INDOOR, indoor.temperature, timestamp)
        .then(() => {
            return Repository.saveTemperature(Repository.TemperatureType.OUTDOOR, outdoor.temperature, timestamp);
        })
        .then(() => {
            console.log("Scheduler: temperatures saved successfully");
        });

}

let job;

process.on('message', (msg) => {
    switch (msg) {
        case "START":
            job = setInterval(measure, config.schedulerMinutes * 60 * 10e3);
            //job = setInterval(measure, 10);
            break;
        case "END":
            clearInterval(job);
            break;
    }
});