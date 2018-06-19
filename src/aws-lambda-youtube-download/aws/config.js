// TODO: get from somewhere - environment
const service = 'my-youtube-download';
const stage = 'dev';

exports.AWS_REGION = 'eu-central-1';
exports.AWS_S3_BUCKET = `${service}-${stage}`;
exports.AWS_LAMBDA_TRANSCODE = `${service}-${stage}-transcode`;