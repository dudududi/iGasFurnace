let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let consumption = new Schema({
    timestamp: Number,
    value: Number
});

consumption.pre('save', function (next) {
    let error = null;
    next(error);
});

let Consumption = mongoose.model('Consumption', consumption);

module.exports = Consumption;