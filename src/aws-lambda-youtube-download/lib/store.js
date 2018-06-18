const fs = require('fs');
const request = require('request');

const transcode = require('./transcode');

/**
 * 
 * @param {String} url 
 * @param {String} inputFilename 
 * @param {String} outputFilename 
 * @return {Promise}
 */
module.exports = (url, inputFilename, outputFilename) => {
    // Download the source file.
    return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(inputFilename);
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
        request(url).pipe(writeStream);
    })
        // Perform the actual transcoding.
        .then(() => transcode(inputFilename, outputFilename));
};