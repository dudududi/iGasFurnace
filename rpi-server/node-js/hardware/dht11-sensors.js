const sensorLib = require("node-dht-sensor");

class TemperatureSensor {

    static read(sensor) {
        let results = sensorLib.read(sensor.type, sensor.pin);
        console.log(`Reading ${sensor.name} Sensor: temperature = ${results.temperature} °C`);
        return results;
    }

    static get IndoorSensor() {
        return {
            name: "Indoor",
            type: 11,
            pin: 17
        };
    }

    static get OutdoorSensor() {
        return {
            name: "Outdoor",
            type: 11,
            pin: 4
        };
    }
}

module.exports = TemperatureSensor;