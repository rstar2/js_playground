const AWS = require('aws-sdk');

// Global configuration variables. TODO: get from env
const AWS_REGION = 'us-east-2';
const AWS_LAMBDA_NAME = 'YoutubeMp3TranscoderFunction';

// AWS SDK objects for interacting with Lambda and S3.
const lambda = new AWS.Lambda({ region: AWS_REGION });

/**
 * Transcode using a AWS Lambda function, e.g trigger the AWS Lambda function.
 * @param {Object} data 
 * @return {Promise}
 */
module.exports = (data) => {
    return lambda.invoke({
        FunctionName: AWS_LAMBDA_NAME,
        InvocationType: 'Event',
        Payload: JSON.stringify(data),
    });
};
