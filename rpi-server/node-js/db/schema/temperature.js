let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let temperature = new Schema({
    timestamp: Number,
    value: Number,
    type: String,
});

temperature.pre('save', function (next) {
    let error = null;
    next(error);
});

let Temperature = mongoose.model('Temperature', temperature);

module.exports = Temperature;