const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const app = require('./server-utils').serverApp;

function defineApi(repository, scheduler) {
    router.route('/temperatures/outdoor')
        .get(function (req, res) {
            let timestampFrom = req.query.timestampFrom;
            let timestampTo = req.query.timestampTo;

            repository.getTemperatures(repository.TemperatureType.OUTDOOR, timestampFrom, timestampTo)
                .then((results) => {
                    res.status(200).json(results);
                });
        });

    router.route('/temperatures/indoor')
        .get(function (req, res) {
            let timestampFrom = req.query.timestampFrom;
            let timestampTo = req.query.timestampTo;

            repository.getTemperatures(repository.TemperatureType.INDOOR, timestampFrom, timestampTo)
                .then((results) => {
                    res.status(200).json(results);
                });
        })
        .post(function (req, res) {
            scheduler.send(req.body.value.toString());
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

    router.route('/current/temperature/indoor')
        .get(function (req, res) {
            repository.getTemperatures(repository.TemperatureType.INDOOR, undefined, undefined)
                .then((results) => {
                    res.status(200).json(results.pop());
                });
        });

    router.route('/current/temperature/outdoor')
        .get(function (req, res) {
            repository.getTemperatures(repository.TemperatureType.OUTDOOR, undefined, undefined)
                .then((results) => {
                    res.status(200).json(results.pop());
                });
        });

    router.route('/current/furnace/state')
        .get(function (req, res) {
            let status = repository.getFurnaceState();
            res.status(200).json({status: status});
        });

    // TODO: remove below code, for test purposes only
    router.route('/test/temperatures/:type')
        .post(function (req, res) {
            let timestamp = req.body.timestamp;
            let value = req.body.value;
            let type = req.params.type === "outdoor" ? repository.TemperatureType.OUTDOOR : repository.TemperatureType.INDOOR;
            repository.saveTemperature(type, value, timestamp)
                .then(() => res.status(200).json("ok"));
        });
}

function configure(repository, scheduler) {
    app.use('/api', router);
    router.use(bodyParser.urlencoded({extended: false}));
    router.use(bodyParser.json());
    defineApi(repository, scheduler);
}

module.exports = {
    configure: configure
};
