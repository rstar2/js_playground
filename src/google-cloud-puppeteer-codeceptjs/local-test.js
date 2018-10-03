
process.env.HEADLESS = false;
const { function: fn } = require('./index');

fn(null, {
    send: console.log
});