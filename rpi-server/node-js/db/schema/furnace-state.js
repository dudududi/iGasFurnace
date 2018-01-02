let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let state = new Schema({
    state: Boolean,
    one: String
});

state.pre('save', function (next) {
    let error = null;
    next(error);
});

let FurnaceState = mongoose.model('FurnaceState', state);

module.exports = FurnaceState;