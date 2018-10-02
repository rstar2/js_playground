const { codecept: Codecept, event } = require('codeceptjs');

// load the Codecept configuration
const { config: codeceptConfig } = require('./codecept.conf');

// the GoogleCloudFunction HTTP trigger
module.exports.function = async (req, res) => {

    let message = '';

    // merge custom teardown callback
    let config = {
        ...codeceptConfig,

        // Once a tests are finished - send back result via HTTP
        teardown: () => {
            res.send(`Finished\n${message}`);
        }
    };

    // pass more verbose output
    let opts = { debug: true };

    // a simple reporter, let's collect all passed and failed tests
    event.dispatcher.on(event.test.passed, (test) => {
        message += `- Test "${test.title}" passed 😎`;
    });
    event.dispatcher.on(event.test.failed, (test) => {
        message += `- Test "${test.title}" failed 😭`;
    });

    // create runner
    let codecept = new Codecept(config, opts);

    codecept.init(__dirname, (err) => {
        if (err) throw new Error(`Error while initializing CodeceptJS :${err}`);

        // load tests
        codecept.loadTests();

        // run tests
        codecept.run();
    });
}

// // local test if needed
// this.handle(null, {
//     send: console.log
// });