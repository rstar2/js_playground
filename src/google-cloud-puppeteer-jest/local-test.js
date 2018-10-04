
process.env.HEADLESS = false;
const { function: fn } = require('./index');

fn(null, {
    status: () => { },
    send: console.log
});