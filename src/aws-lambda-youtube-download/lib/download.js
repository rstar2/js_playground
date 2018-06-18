const request = require('request');

const ffmpeg = require('fluent-ffmpeg');

/**
 * 
 * @param {Object} url 
 * @return {stream.PassThrough}
 */
module.exports = (url) => {
    // Perform the actual transcoding while streaming
    return ffmpeg(request(url))
        .format('mp3')
        .audioBitrate(128)
        .stream(); //this will create a pipe-able PassThrough stream
};