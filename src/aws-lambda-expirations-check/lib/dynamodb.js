const AWS = require("aws-sdk");

module.exports = (region) => {
	AWS.config.update({ region, });
	const dynamoDb = new AWS.DynamoDB.DocumentClient();

	return {
		exec(action, params) {
			return dynamoDb[action](params).promise();
		},
	};
};
