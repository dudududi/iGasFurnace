const TemperatureSensor = require('./dht11-sensors');
const Gpio = require('onoff').Gpio;
const ReedSwitch = new Gpio(6, 'in');
const GasFurnaceSwitch = new Gpio(20, 'out');

class HardwareController{
    _desiredOutdoorTemperature;

    get currentIndoorTemperature() {
        return TemperatureSensor.read(TemperatureSensor.IndoorSensor);
    }

    set desiredIndoorTemperature(value) {
        this._desiredOutdoorTemperature = value;
    }

    get currentOutdoorTemperature() {
        return TemperatureSensor.read(TemperatureSensor.OutdoorSensor);
    }

    set gasFurnaceState(value) {
        GasFurnaceSwitch.writeSync(value); // TODO: probably move to scheduler
    }

    onConsumptionChange(callback) {
        ReedSwitch.watch(callback)
    }
}