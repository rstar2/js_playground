const AWS = require("aws-sdk");

// TODO: Make this dynamic - pass from the function context - create HOF (higher-order function)
AWS.config.update({ region: "eu-central-1", });

exports.call = (action, params) => {
	const dynamoDb = new AWS.DynamoDB.DocumentClient();

	return dynamoDb[action](params).promise();
};
