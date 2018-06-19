const AWS = require('aws-sdk');

const { AWS_REGION, AWS_S3_BUCKET } = require('./config');

const s3 = new AWS.S3(AWS_REGION);

/**
 * 
 * @param {String} logKey 
 * @param {String} mp3Key
 * @return {Promise} 
 */
module.exports = (logKey, mp3Key) => {
    return new Promise((resolve, reject) => {
        s3.headObject({
            Bucket: AWS_S3_BUCKET,
            Key: logKey,
        }, (error) => {
            if (error) {
                if (error.code === 'NotFound') {
                    return resolve({ url: null });
                }
                return reject(error);
            }

            s3.getSignedUrl('getObject', {
                Bucket: AWS_S3_BUCKET,
                Expires: 3600,
                Key: mp3Key,
            }, (error, url) => {
                if (error) {
                    return reject(error);
                }
                resolve({ url });
            });
        });
    });
};