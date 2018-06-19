const youtube = require('../lib/youtube');

const aws_transcode = require('../aws/invoke');
const aws_check = require('../aws/check');

const store = require('../lib/store');
const download = require('../lib/download');

module.exports = (app) => {
    app.get('/transcode/:videoId', (req, res) => {
        const { videoId } = req.params;
        // Get information on the available video file formats.
        youtube(videoId)
            // transcode by invoking the AWS Lambda - e.g in the cloud
            .then(data => aws_transcode(data).then(() => data))

            // Send a response
            .then(data => res.status(200).send(JSON.stringify(data)))
            // Handle errors
            .catch((error) => res.status(500).send(`Something went wrong: ${error.message}`));
    });

    app.get('/check/:logKey/:mp3Key', (req, res) => {
        const logKey = decodeURIComponent(req.params.logKey);
        const mp3Key = decodeURIComponent(req.params.mp3Key);

        aws_check(logKey, mp3Key)
            .then(data => res.status(200).send(JSON.stringify(data)))
            .catch(error => res.status(500).send(`Something went wrong: ${error.message}`));
    });

    app.get('/store/:videoId', (req, res) => {
        const { videoId } = req.params;
        // Get information on the available video file formats.
        youtube(videoId)
            // download locally
            .then(data => {
                const { filename, url } = data;
                const mp3Filename = filename + '.mp3';
                return store(url, filename, mp3Filename)
                    .then(() => data);
            })

            // Send a response
            .then(data => res.status(200).send(JSON.stringify(data)))
            // Handle errors
            .catch((error) => res.status(500).send(`Something went wrong: ${error.message}`));
    });

    app.get('/download/:videoId', (req, res) => {
        const { videoId } = req.params;
        // Get information on the available video file formats.
        youtube(videoId)
            // initiate download response
            .then(data => {
                const { filename, url } = data;
                const mp3Filename = filename + '.mp3';
                const stream = download(url);

                return { stream, mp3Filename };
            })

            // Send a response
            .then(({ stream, mp3Filename }) => {
                res.setHeader('Content-disposition', 'attachment; filename=' + mp3Filename);
                res.setHeader('Content-type', 'audio/mpeg');

                stream.pipe(res);
            })
            // Handle errors
            .catch((error) => res.status(500).send(`Something went wrong: ${error.message}`));
    });

};