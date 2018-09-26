const { exec } = require('child_process');

module.exports.handle = (req, res) => {
    // Jest has no official support for running programmatically for now

    exec('npm start', [], (error, stdout, stderr) => {
        // Jest uses process.stderr for logging no matter for info or error
        if (error) {
            return res.sendErr(stderr);
        }
        res.send(stderr);
    });
};

// // local test if needed
// this.handle(null, {
//     send: console.log,
//     sendErr: console.error,
// });