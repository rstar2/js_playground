module.exports = {
    launch: {
        // dumpio: true,
        headless: process.env.HEADLESS !== 'false',
        args: ['--no-sandbox'] // IMPORTANT! Browser can't be run without this in the cloud!
    }
};