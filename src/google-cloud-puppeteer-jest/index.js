const { exec } = require('child_process');

// Named as 'function' by convention from the gcloud API
module.exports.function = async (req, res) => {
    // Jest has no official support for running programmatically for now


    // if in package.json it's defined "start":"jest"
    //const script = 'npm start'; 
    // or just call the jest executable (Note 'path' module will take care of the WIndow/Linux path-separator)
    const file = require('path').resolve('node_modules', '.bin', 'jest');

    exec(file, (error, stdout, stderr) => {
        // Jest uses process.stderr for logging no matter for info or error
        if (error) {
            res.status(500);
            return res.send(stderr);
        }
        res.send(stderr);
    });
};