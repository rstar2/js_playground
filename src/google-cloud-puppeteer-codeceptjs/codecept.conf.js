// this dynamic JS file will take precedence over the 'codecept.json'
exports.config = {
    tests: "./src/*.test.js",
    timeout: 10000,
    output: "./output",
    helpers: {
        Puppeteer: {
            url: 'https://github.com', // base url
            show: process.env.HEADLESS === 'false',
            windowSize: "1280x800",
            disableScreenshots: true, // don't store screenshots on failure
            waitForAction: 1000, // increase timeout for clicking
            // waitForNavigation: 'domcontentloaded', // wait for document to load
            // possible values'load' (dafault), 'domcontentloaded', 'networkidle0', 'networkidle2'
            chrome: {
                args: ['--no-sandbox'] // IMPORTANT! Browser can't be run without this in the cloud!
            }
        }
    },
    include: {
        I: './codecept.steps.js'
    },
    // bootstrap: './codecept.bootstrap.js',
    // teardown: './codecept.teardown.js',
    // mocha: {},
    name: '"google-cloud-puppeteer-codeceptjs',
};