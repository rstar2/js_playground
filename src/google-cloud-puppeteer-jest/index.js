const { exec } = require('child_process');

// Named as 'function' by convention from the gcloud API
module.exports.function = (req, res) => {
    // Jest has no official support for running programmatically for now

    exec('jest', [], (error, stdout, stderr) => {
        // Jest uses process.stderr for logging no matter for info or error
        if (error) {
            res.status(500);
            return res.send(stderr);
        }
        res.send(stderr);
    });
};

// // local test if needed
// this.handle(null, {
//     send: console.log,
//     sendErr: console.error,
// });