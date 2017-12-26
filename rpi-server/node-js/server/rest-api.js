const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const app = require('./server-utils').serverApp;

function defineApi(repository) {
    router.route('/temperatures/exterior')
        .get(function (req, res) {
            let timestampFrom = req.query.timestampFrom;
            let timestampTo = req.query.timestampTo;

            repository.getTemperatures(repository.TemperatureType.EXTERIOR, timestampFrom, timestampTo)
                .then((results) => {
                    res.status(200).json(results);
                });
        });

    router.route('/temperatures/interior')
        .get(function (req, res) {
            let timestampFrom = req.query.timestampFrom;
            let timestampTo = req.query.timestampTo;

            repository.getTemperatures(repository.TemperatureType.INTERIOR, timestampFrom, timestampTo)
                .then((results) => {
                    res.status(200).json(results);
                });
        })
        .post(function (req, res) {
            // TODO: set wanted interior temp here with some rpi service ?
            res.status(200).json({status: "ok"});
        });

    router.route('/gas/consumption')
        .get(function (req, res) {
            let timestampFrom = req.body.timestampFrom;
            let timestampTo = req.body.timestampTo;
            repository.getConsumption(timestampFrom, timestampTo)
                .then((results) => {
                    res.status(200).json(results);
                })
        });

    // TODO: remove below code, for test purposes only
    router.route('/test/temperatures/:type')
        .post(function (req, res) {
            let timestamp = req.body.timestamp;
            let value = req.body.value;
            let type = req.params.type === "exterior" ? repository.TemperatureType.EXTERIOR : repository.TemperatureType.INTERIOR;
            repository.saveTemperature(type, value, timestamp)
                .then(() => res.status(200).json("ok"));
        });
}

function configure(repository) {
    app.use('/api', router);
    router.use(bodyParser.urlencoded({extended: false}));
    router.use(bodyParser.json());
    defineApi(repository);
}

module.exports = {
    configure: configure
};