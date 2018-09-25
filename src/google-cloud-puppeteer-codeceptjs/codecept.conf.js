exports.config = {
    tests: "./tests/*.test.js",
    timeout: 10000,
    output: "./output",
    helpers: {
        Puppeteer: {
            url: 'https://github.com', // base url
            show: process.env.HEADLESS === 'false',
            windowSize: "1280x800"
        }
    },
    include: {
        I: './steps_file.js'
    },
    bootstrap: false,
    mocha: {},
    name: '"google-cloud-puppeteer-codeceptjs',
};