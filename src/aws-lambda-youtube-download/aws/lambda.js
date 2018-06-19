const fs = require('fs');
const path = require('path');

const AWS = require('aws-sdk');
const request = require('request');
const tempy = require('tempy');

require('../utils/promise');

const transcode = require('../lib/transcode');
const { AWS_REGION, AWS_S3_BUCKET } = require('./config');

const s3 = new AWS.S3(AWS_REGION);

exports.transcode = (event, context, callback) => {
    // We're going to do the transcoding asynchronously, so we callback immediately.
    callback();


    let params;
    if (event.httpMethod === 'GET') {
        // extracting query parameters from HTTP GET/POST request
        // if the function is triggered by HTTP event
        // e.g. https://jm2f52kt06.execute-api.eu-central-1.amazonaws.com/dev/execute?name=RUMEN
        params = event.queryStringParameters;
    } else {
        // assume that the whole event is the params placeholder
        params = event;
    }

    // Extract the event parameters.
    const { key, filename, url } = params;
    const mp3Key = `mp3/${key}.mp3`;
    const logKey = `log/${key}.log`;

    // Create temporary input/output filenames that we can clean up afterwards.
    const inputFilename = tempy.file();
    const mp3Filename = tempy.file({ extension: 'mp3' });

    // Download the source file.
    new Promise((resolve, revoke) => {
        const writeStream = fs.createWriteStream(inputFilename);
        writeStream.on('finish', resolve);
        writeStream.on('error', revoke);
        request(url).pipe(writeStream);
    })
        // Perform the actual transcoding.
        .then(() => transcode(inputFilename, mp3Filename))

        // Upload the generated MP3 to S3.
        .then(logContent => {
            return s3.putObject({
                Bucket: AWS_S3_BUCKET,
                Key: mp3Key,
                Body: fs.createReadStream(mp3Filename),
                ContentDisposition: `attachment; filename="${filename.replace('"', '\'')}"`,
                ContentType: 'audio/mpeg',
            }).promise()
                .then(() => {
                    const logFilename = path.basename(logKey);
                    return s3.putObject({
                        Bucket: AWS_S3_BUCKET,
                        Key: logKey,
                        Body: logContent,
                        ContentType: 'text/plain',
                        ContentDisposition: `inline; filename="${logFilename.replace('"', '\'')}"`,
                    }).promise();
                });
        })

        // Always delete the temporary files.
        .always(() => {
            [inputFilename, mp3Filename].forEach((filename) => {
                if (fs.existsSync(filename)) {
                    fs.unlinkSync(filename);
                }
            });
        })
        // just trace it and rethrow it
        .catch(error => {
            console.error(error);
            throw error;
        });
};