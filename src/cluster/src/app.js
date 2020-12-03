const express = require('express');
const job = require('./job');

/**
 * @return {Express.Application}
 */
module.exports = () => {
    const app = express();

    let id = 0;

    app.use('/flip', async (req, res, next) => {
        try {
            const result = await job(++id);
            res.status(200).send(`PID ${process.pid}, job result - ${result}`);
        } catch (err) {
            next(err);
        }
    });

    app.use('/', (req, res) => {
        res.status(200).send(`PID ${process.pid} listening here!`);
    });

    // eslint-disable-next-line
    app.use(function (err, req, res, next) {
        console.error(err.stack);
        res.status(err.status || 500).send('Something broke!');
    });

    return app;
};