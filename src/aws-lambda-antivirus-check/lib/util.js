const constants = require('./config');
const execSync = require('child_process').execSync;

/**
 * Generates the set of tags that will be used to tag the files of S3.
 * @param virusScanStatus String representing the status.
 * @return {{TagSet: *[]}} TagSet ready to be attached to an S3 file.
 */
function generateTagSet(virusScanStatus) {
    return {
        TagSet: [
            {
                Key: constants.VIRUS_STATUS_STATUS_KEY,
                Value: virusScanStatus
            },
            {
                Key: constants.VIRUS_SCAN_TIMESTAMP_KEY,
                Value: new Date().getTime().toString()
            }
        ]
    };
}

/**
 * Cleanup the specific folder by removing all of its content.
 */
function cleanupFolder(folderToClean) {
    let result = execSync(`ls -l ${folderToClean}`);

    logSystem('-- Folder before cleanup--');
    log(result.toString());

    execSync(`rm -rf ${folderToClean}*`);

    result = execSync(`ls -l ${folderToClean}`);

    logSystem('-- Folder after cleanup --');
    log(result.toString());
}

/**
 * Extract the key from an S3 event.
 * @param s3Event Inbound S3 event.
 * @return {string} decoded key.
 */
function extractKeyFromS3Event(s3Event) {
    let key = s3Event['Records'][0]['s3']['object']['key'];

    if (!key) {
        throw new Error('Unable to retrieve key information from the event');
    }

    return key.replace(/\+/g, ' ');
}

/**
 * Extract the bucket from an S3 event.
 * @param s3Event Inbound S3 event.
 * @return {string} Bucket
 */
function extractBucketFromS3Event(s3Event) {
    let bucketName = s3Event['Records'][0]['s3']['bucket']['name'];

    if (!bucketName) {
        throw new Error('Unable to retrieve bucket information from the event');
    }

    return bucketName;
}

/**
 * Logs a system message (simple --- the message here ---)
 * @param message Inbound message to log and generate.
 */
function logSystem(message) {
    log(`--- ${message} ---`);
}

/**
 * Logs a system message
 * @param message Inbound message to log and generate.
 */
const log = console.log;

module.exports = {
    generateTagSet,
    cleanupFolder,
    extractKeyFromS3Event,
    extractBucketFromS3Event,
    logSystem,
    log,
};