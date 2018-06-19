const AWS = require('aws-sdk');

const { AWS_REGION, AWS_LAMBDA_TRANSCODE } = require('./config');

// AWS SDK objects for interacting with Lambda and S3.
const lambda = new AWS.Lambda({ region: AWS_REGION });

/**
 * Transcode using a AWS Lambda function, e.g trigger the AWS Lambda function.
 * @param {Object} data 
 * @return {Promise}
 */
module.exports = (data) => {
    return lambda.invoke({
        FunctionName: AWS_LAMBDA_TRANSCODE,
        InvocationType: 'Event',
        Payload: JSON.stringify(data),
    }).promise();
};
