const Temperature = require('./schema/temperature');
const Consumption = require('./schema/consumption');

class Repository {

    /**
     * Saves current temperature at given date and time to db.
     *
     * @param {String} type of temperature to be saved, can be "INDOOR" or "OUTDOOR", mandatory
     * @param {Number} temperature's value to be saved, mandatory
     * @param {Number} timestamp of temperature's which is being saved (usually Date.now()), mandatory
     */
    static saveTemperature(type, temperature, timestamp) {
        return new Promise(((resolve, reject) => {
            let temperatureObj = new Temperature({
                type: type, value: temperature, timestamp: timestamp
            });
            console.log("Saving temp " + temperature + " " + type + " " + timestamp);
            temperatureObj.save((err) => {
                if (err) {
					console.error("Smuteczek", err);
					reject(err);
				}
                else resolve();
            })
            .catch((err) => {
				console.log("Smuteczek2", err);
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
    static getTemperatures(type, timestampFrom, timestampTo) {
        return new Promise(function (resolve, reject) {
            let query = Temperature
                .find({})
                .where('type').equals(type)
                .select({"_id": 0, "__v": 0})
                .sort("timestamp");
            if (timestampFrom) {
                query = query.where('timestamp').gt(timestampFrom);
                console.log("timestampFrom " + timestampFrom);
            }
            if (timestampTo) {
                query = query.where('timestamp').lt(timestampTo);
                console.log("timestampTo " + timestampTo);
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
    static updateConsumption(consumption, timestamp) {
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
    static getConsumption(timestampFrom, timestampTo) {
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

    static get TemperatureType() {
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
module.exports = Repository;
