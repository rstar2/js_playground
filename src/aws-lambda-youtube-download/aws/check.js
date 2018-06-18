const AWS = require('aws-sdk');

const s3 = new AWS.S3();

module.exports = (logKey, mp3Key) => {
    s3.headObject({
        Bucket: s3Bucket,
        Key: logKey,
    }, (error) => {
        if (error) {
            if (error.code === 'NotFound')
                return { url: null };
            else
                throw Error();
        } else {
            s3.getSignedUrl('getObject', {
                Bucket: s3Bucket,
                Expires: 3600,
                Key: mp3Key,
            }, (error, url) => {
                res.status(200).send(JSON.stringify({ url }));
            });
        }
    });
};