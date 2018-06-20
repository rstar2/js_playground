const request = require('request');

const ffmpeg = require('fluent-ffmpeg');


// TODO: split into download - return Promise<Stream> and transcode which again returns Promise<Stream>
/**
 * 
 * @param {Object} url 
 * @return {stream.PassThrough}
 */
module.exports = (url, transcodeMP3 = false) => {
    if (!transcodeMP3)
        return request(url);

    // Perform the actual transcoding while streaming
    return ffmpeg(request(url))
        .format('mp3')
        .audioBitrate(128)
        .stream(); //this will create a pipe-able PassThrough stream
};