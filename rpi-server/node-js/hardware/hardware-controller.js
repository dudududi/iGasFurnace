const Gpio = require('onoff').Gpio;
const ReedSwitch = new Gpio(4, 'in', 'falling', {debounceTimeout: 200});
const GasFurnaceSwitch = new Gpio(18, 'out');

class HardwareController{
    static onConsumptionChange(callback) {
		console.log("Watching reed sensor...");
        ReedSwitch.watch(callback)
    }
    
    static cleanup() {
		console.log("Unexporting hardware...");
		ReedSwitch.unexport();
		GasFurnaceSwitch.unexport();
	}
	
	static changeFurnaceState(value) {
		GasFurnaceSwitch.writeSync(value);
	}
}

module.exports = HardwareController;
