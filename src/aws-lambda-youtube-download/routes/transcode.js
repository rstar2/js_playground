const youtube = require('../lib/youtube');

module.exports = (app) => {
    app.get('/transcode/:videoId', (req, res) => {
        const { videoId } = req.params;
        // Get information on the available video file formats.
        youtube(videoId)
            // transcode by invoking the AWS Lambda - e.g in the cloud
            .then(data => require('../aws/invoke')(data).then(() => data))

            // Send a response
            .then(({ logKey, mp3Key }) => {
                res.status(200).send(JSON.stringify({ logKey, mp3Key }));
            })
            // Handle errors
            .catch((error) => {
                return res.status(500).send(`Something went wrong: ${error.message}`);
            });
    });

    app.get('/store/:videoId', (req, res) => {
        const { videoId } = req.params;
        // Get information on the available video file formats.
        youtube(videoId)
            // download locally
            .then(data => {
                const { filename, url } = data;
                const mp3Filename = filename + '.mp3';
                return require('../lib/store')(url, filename, mp3Filename)
                    .then(() => data);
            })

            // Send a response
            .then(({ mp3Key }) => {
                res.status(200).send(JSON.stringify({ mp3Key }));
            })
            // Handle errors
            .catch((error) => {
                return res.status(500).send(`Something went wrong: ${error.message}`);
            });
    });

    app.get('/download/:videoId', (req, res) => {
        const { videoId } = req.params;
        // Get information on the available video file formats.
        youtube(videoId)
            // initiate download response
            .then(data => {
                const { filename, url } = data;
                const mp3Filename = filename + '.mp3';
                const stream = require('../lib/download')(url);

                return {stream, mp3Filename};
            })

            // Send a response
            .then(({ stream, mp3Filename }) => {
                res.setHeader('Content-disposition', 'attachment; filename=' + mp3Filename);
                res.setHeader('Content-type', 'audio/mpeg');

                stream.pipe(res);
            })
            // Handle errors
            .catch((error) => {
                return res.status(500).send(`Something went wrong: ${error.message}`);
            });
    });

};