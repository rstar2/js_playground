/**
 * Lambda function that will be perform the scan and tag the file accordingly.
 */

const path = require('path');
const fs = require('fs');

const AWS = require('aws-sdk');

const clamav = require('./lib/clamav');
const util = require('./lib/util');
const constants = require('./lib/config');

const s3 = new AWS.S3();

function downloadFileFromS3(s3ObjectKey, s3ObjectBucket) {
    const downloadDir = constants.CLAMAV_WORK_DIR;

    util.ensureExistFolder(downloadDir);

    const localPath = path.join(downloadDir, path.basename(s3ObjectKey));

    const writeStream = fs.createWriteStream(localPath);

    const options = {
        Bucket: s3ObjectBucket,
        Key: s3ObjectKey,
    };

    util.logSystem(`Downloading file s3://${s3ObjectBucket}/${s3ObjectKey}`);
    return new Promise((resolve, reject) => {
        s3.getObject(options).createReadStream().on('end', function () {
            util.logSystem(`Finished downloading new object ${s3ObjectKey}`);
            resolve(localPath);
        }).on('error', function (err) {
            util.log(err);
            reject();
        }).pipe(writeStream);
    });
}


module.exports.handle = async (event, context, callback) => {
    process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];
    
    const s3ObjectKey = util.extractKeyFromS3Event(event);
    const s3ObjectBucket = util.extractBucketFromS3Event(event);

    await clamav.downloadAVDefinitions(constants.CLAMAV_BUCKET_NAME, constants.PATH_TO_AV_DEFINITIONS);

    const pathToFile = await downloadFileFromS3(s3ObjectKey, s3ObjectBucket);

    const virusScanStatus = clamav.scanLocalFile(pathToFile);

    try {
        util.logSystem(`Tag scanned file ${pathToFile}`);

        const taggingParams = {
            Bucket: s3ObjectBucket,
            Key: s3ObjectKey,
            Tagging: util.generateTagSet(virusScanStatus)
        };
        
        await s3.putObjectTagging(taggingParams).promise();
    } catch (err) {
        util.log(err);
    }

    callback(null);
};