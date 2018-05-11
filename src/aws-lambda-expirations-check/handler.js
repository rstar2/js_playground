'use strict';

const moment = require('moment');
const uuid = require('uuid');

// initialize a DynamoDB client for the specific region
const dynamodbUtils = require('./lib/dynamodb-utils')(process.env.AWS_REGION);
const dynamodb_TableName = "my-expirations-check-dev-expirations";

const dateUtils = require('./lib/date-utils');

// initialize a Twilio client to send SMS
const twilioUtils = require('./lib/twilio-utils');

module.exports.check = async (event, context, callback) => {
	console.time("Invoking function check took");

	const data = await dbList();
	// data of the type { "Items":[...], "Count": 1, "ScannedCount":1 }
	const list = data.Items;

	if (list) {
		const expireAfter3days = list
			.map(item => item.expiresAt)
			.filter(date => dateUtils.isExpiredDay(date, -3));

		await twilioUtils.sendSMS(expireAfter3days);
	}

	const response = {
		statusCode: 200,
		body: JSON.stringify({
			message: `Checked on ${moment().format("MMM Do YY")}`,
			event,
			context,
			env: process.env,
		}),
	};

	console.timeEnd("Invoking function check took");
	callback(null, response);
};


module.exports.api = async (event, context, callback) => {
	console.time("Invoking function api took");

	try {
		let responseBody;
		switch (event.httpMethod) {
			case 'GET':
				switch (event.path) {
					case '/list':
						responseBody = await dbList();
						break;
					default:
						return callback(`Unsupported API gateway with HTTP GET path ${event.path}`);
				}
				break;

			// eslint-disable-next-line no-case-declarations
			case 'POST':
				// assume it's JSON ("application/json")
				const data = JSON.parse(event.body);
				switch (event.path) {
					case '/add':
						responseBody = await dbAdd(data);
						break;
					case '/delete':
						responseBody = await dbDelete(data);
						break;
					default:
						return callback(`Unsupported API gateway with HTTP POST path ${event.path}`);
				}
				break;
			default:
				return callback(`Unsupported API gateway with HTTP method ${event.httpMethod}`);
		}

		console.timeEnd("Invoking function api took");
		callback(null, createResponse(200, responseBody));
	} catch (error) {
		console.timeEnd("Invoking function api took", "- failed");
		callback(null, createResponse(500, { status: false, error, }));
	}
};

const createResponse = (status, body) => {
	return {
		statusCode: 200,
		body: JSON.stringify(body),
	};
};

const dbList = async () => {
	const params = {
		TableName: dynamodb_TableName,
		Limit: 1000,
	};
	return dynamodbUtils.exec("scan", params);
};

const dbAdd = async (data) => {
	const params = {
		TableName: dynamodb_TableName,
		Item: {
			// userId: event.requestContext.identity.cognitoIdentityId,
			id: uuid.v1(),
			name: data.name,
			expiresAt: data.expiresAt,
			createdAt: Date.now(),
		},
	};
	return dynamodbUtils.exec("put", params);
};

const dbDelete = async (data) => {
	const params = {
		TableName: dynamodb_TableName,
		Key: {
			// userId: event.requestContext.identity.cognitoIdentityId,
			id: data.id,
		},
	};
	return dynamodbUtils.exec("delete", params);
};
