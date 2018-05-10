'use strict';

const moment = require('moment');
const uuid = require('uuid');

// access the environment variables
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_SENDER = process.env.TWILIO_SENDER;

module.exports.check = async (event, context, callback) => {
	console.time("Invoking function check took");

	const now = moment(Date.now()).format("MMM Do YY");

	await dbCheck();

	const response = {
		statusCode: 200,
		body: JSON.stringify({
			message: `Checked on ${now}`,
			event,
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
						responseBody = await dbRemove(data);
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

const dynamoDB = require('./lib/dynamoDB');
// TODO: fix the DynamoDB table name and keys usage

const dbCheck = async () => {

	const list = await dbList();

	// TODO: check the list
	// TODO: send SMS with Twilio
	
	return new Promise((resolve, reject) =>
		setTimeout(() => {
			resolve({ id1: "1111", id2: "2222", });
		}, 1000)
	);
};

const dbList = async () => {
	const params = {
		TableName: "notes",
		// 'KeyConditionExpression' defines the condition for the query
		// - 'userId = :userId': only return items with matching 'userId'
		//   partition key
		// 'ExpressionAttributeValues' defines the value in the condition
		// - ':userId': defines 'userId' to be Identity Pool identity id
		//   of the authenticated user
		KeyConditionExpression: "userId = :userId",
		ExpressionAttributeValues: {
			":userId": event.requestContext.identity.cognitoIdentityId
		},
	};
	return dynamoDB.call("query", params);
};

const dbAdd = async (data) => {
	const params = {
		TableName: "notes",
		Item: {
			userId: event.requestContext.identity.cognitoIdentityId,
			noteId: uuid.v1(),
			content: data.content,
			attachment: data.attachment,
			createdAt: Date.now(),
		},
	};
	return dynamoDB.call("put", params);
};

const dbRemove = async (data) => {
	const params = {
		TableName: "notes",
		// 'Key' defines the partition key and sort key of the item to be removed
		// - 'userId': Identity Pool identity id of the authenticated user
		// - 'noteId': path parameter
		Key: {
			userId: event.requestContext.identity.cognitoIdentityId,
			noteId: data.id,
		},
	};
	return dynamoDB.call("delete", params);
};
