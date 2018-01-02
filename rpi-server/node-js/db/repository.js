const Temperature = require('./schema/temperature');
const Consumption = require('./schema/consumption');
const FurnaceState = require('./schema/furnace-state');

class Repository {

    constructor() {
        this.isFurnaceEnabled = false;
    }

    /**
     * Saves current temperature at given date and time to db.
     *
     * @param {String} type of temperature to be saved, can be "INDOOR" or "OUTDOOR", mandatory
     * @param {Number} temperature's value to be saved, mandatory
     * @param {Number} timestamp of temperature's which is being saved (usually Date.now()), mandatory
     */
     saveTemperature(type, temperature, timestamp) {
        return new Promise(((resolve, reject) => {
            let temperatureObj = new Temperature({
                type: type, value: temperature, timestamp: timestamp
            });
            temperatureObj.save((err) => {
                if (err) {
					reject(err);
				}
                else resolve();
            })
            .catch((err) => {
				reject(err);
			});
        }));
    }

    /**
     * Fetch list of temperatures within given dates.
     *
     * @param {String} type of temperature to be saved, can be "INDOOR" or "OUTDOOR", mandatory
     * @param {Number} timestampFrom - date from which temperatures should be returned in timestamp format, optional
     * @param {Number} timestampTo - date to which temperatures should be returned in timestamp format, optional.
     */
     getTemperatures(type, timestampFrom, timestampTo) {
        return new Promise(function (resolve, reject) {
            let query = Temperature
                .find({})
                .where('type').equals(type)
                .select({"_id": 0, "__v": 0})
                .sort("timestamp");
            if (timestampFrom) {
                query = query.where('timestamp').gt(timestampFrom);
            }
            if (timestampTo) {
                query = query.where('timestamp').lt(timestampTo);
            }
            query.exec((err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    /**
     * Updates current gas consumption with given value at given time.
     *
     * @param {Number} consumption to being updated, mandatory
     * @param {Number} timestamp of consumption, mandatory
     */
     updateConsumption(consumption, timestamp) {
        return new Promise(function (resolve, reject) {
            let consumptionObj = new Consumption({
                value: consumption, timestamp: timestamp
            });
            consumptionObj.save((err) => {
                if (err) reject(err);
                else resolve();
            })
        });
    }

    /**
     * Fetch list of consumption issued by the hardware controller.
     *
     * @param timestampFrom - date from which consumption should be returned in timestamp format, mandatory
     * @param timestampTo - date to which consumption should be returned in timestamp format, optional.
     */
     getConsumption(timestampFrom, timestampTo) {
        return new Promise(function (resolve, reject) {
            let query = Consumption.find({})
                .select({"_id": 0, "__v": 0})
                .sort("timestamp");
            if (timestampFrom) {
                query = query.where('timestamp').gt(timestampFrom);
            }
            if (timestampTo) {
                query = query.where('timestamp').lt(timestampTo);
            }
            query.exec((err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    getFurnaceState() {
         return new Promise(function (resolve, reject) {
             FurnaceState.findOne({one: 'one'}, function (err, doc) {
                 if (err) reject(err);
                 else resolve(doc);
             })
         });
    }

    setFurnaceState(isEnabled, thermostatTemperature) {
        return new Promise(function (resolve, reject) {
            let query = {'one': 'one'};
            let newData = {
                state: isEnabled,
                one: 'one',
                thermostat: thermostatTemperature
            };
            FurnaceState.findOneAndUpdate(query, newData, {upsert: true}, function (err, doc) {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    get TemperatureType() {
        return TemperatureType;
    }
}

class TemperatureType {
    static get INDOOR() {
        return "indoor";
    }

    static get OUTDOOR() {
        return "outdoor";
    }
}
module.exports = new Repository();
