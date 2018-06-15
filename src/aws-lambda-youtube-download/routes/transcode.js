const youtube = require('../lib/youtube');

module.exports = (app) => {
    app.get('/transcode/:videoId', (req, res) => {
        const { videoId } = req.params;
        // Get information on the available video file formats.
        youtube(videoId)
            // download locally
            .then(data => {
                const { filename, url } = data;
                const mp3Filename = filename + '.mp3';
                return require('../lib/download')(url, filename, mp3Filename)
                    .then(() => data);
            })

            // transcode by invoking the AWS Lambda - e.g in the cloud
            // .then(data => require('../aws/transcode')(data).then(() => data))

            // Send a response
            .then(({ logKey, mp3Key }) => {
                res.status(200).send(JSON.stringify({ logKey, mp3Key }));
            })
            // Handle errors
            .catch((error) => {
                return res.status(500).send(`Something went wrong: ${error.message}`);
            });
    });
};