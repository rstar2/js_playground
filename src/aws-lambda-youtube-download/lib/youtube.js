const ytdl = require('ytdl-core');

/**
 * 
 * @param {String} videoUrl 
 * @return {Promise}
 */
module.exports = (videoId) => {
    const timestamp = Date.now().toString();
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    return ytdl.getInfo(videoUrl)
        // Choose the best format and construct the Lambda event.
        .then(({ formats, title }) => {
            // We'll just pick the largest audio source file size for simplicity here,
            // you could prioritize things based on bitrate, file format, etc. if you wanted to.
            const format = formats
                .filter(format => format.audioEncoding != null)
                .filter(format => format.clen != null)
                .sort((a, b) => parseInt(b.clen, 10) - parseInt(a.clen, 10))[0];

            return {
                filename: `${title}.${format.audioEncoding}`,
                logKey: `log/${timestamp} - ${title}.log`,
                mp3Key: `mp3/${timestamp} - ${title}.mp3`,
                url: format.url,
            };
        });
};