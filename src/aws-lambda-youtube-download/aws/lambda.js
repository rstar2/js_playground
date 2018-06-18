const fs = require('fs');
const path = require('path');

const AWS = require('aws-sdk');
const request = require('request');
const tempy = require('tempy');

const transcode = require('../lib/transcode');

const s3 = new AWS.S3();

exports.handler = (event, context, callback) => {
    // We're going to do the transcoding asynchronously, so we callback immediately.
    callback();

    // Extract the event parameters.
    const { mp3Key, url } = event;
    const filename = event.filename || path.basename(mp3Key);
    const logKey = event.logKey || `${mp3Key}.log`;
    const s3Bucket = event.s3Bucket || 'youtube-mp3-downloader';

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
                Bucket: s3Bucket,
                Key: mp3Key,
                Body: fs.createReadStream(mp3Filename),
                ContentDisposition: `attachment; filename="${filename.replace('"', '\'')}"`,
                ContentType: 'audio/mpeg',
            }).then(() => {
                const logFilename = path.basename(logKey);
                return s3.putObject({
                    Bucket: s3Bucket,
                    Key: logKey,
                    Body: logContent,
                    ContentType: 'text/plain',
                    ContentDisposition: `inline; filename="${logFilename.replace('"', '\'')}"`,
                });
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