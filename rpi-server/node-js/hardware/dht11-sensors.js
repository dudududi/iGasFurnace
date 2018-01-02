const sensorLib = require("node-dht-sensor");
const { exec } = require('child_process');


class TemperatureSensor {

    static read(sensor) {
		/* below snippet would work, but there is bug in BCM2835 library for RPi3, so we need to ommit this library
        let results = sensorLib.read(sensor.type, sensor.pin);
		console.log(`Reading ${sensor.name} Sensor.
                     Temperature = ${results.temperature.toFixed(1)}°C 
                     Humidity: ${results.humidity.toFixed(1)}%, 
                     Valid: ${results.isValid}, 
                     Errors: ${results.errors}`);
        return results;             
        */ 
        return new Promise((resolve, reject) => {
			exec('./node-js/hardware/dht-core.py ' + sensor.pin, (error, stdout, stderr) => {
				if (error) {
					reject(error);
					return;
				}
				let value = parseFloat(stdout);
				console.log("Obtained temperature value for " + sensor.name + " sensor = " + value);
				resolve(value);
			});
		});
        
    }

    static get IndoorSensor() {
        return {
            name: "indoor",
            pin: 5
        };
    }

    static get OutdoorSensor() {
        return {
            name: "outdoor",
            pin: 6
        };
    }
}

module.exports = TemperatureSensor;
