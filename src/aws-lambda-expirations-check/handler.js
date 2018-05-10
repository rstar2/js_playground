'use strict';

const moment = require('moment');

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
			const json = JSON.parse(event.body);
			switch (event.path) {
				case '/add':
					responseBody = await dbAdd(json);
					break;
				case '/delete':
					responseBody = await dbRemove(json);
					break;
				default:
					return callback(`Unsupported API gateway with HTTP POST path ${event.path}`);
			}
			break;
		default:
			return callback(`Unsupported API gateway with HTTP method ${event.httpMethod}`);
	}

	const response = {
		statusCode: 200,
		body: JSON.stringify(responseBody),
	};

	console.time("Invoking function api took");
	callback(null, response);
};

const dbCheck = async () => {

};

const dbList = async () => {
	return new Promise((resolve, reject) =>
		setTimeout(() => {
			resolve({id1: "1111", id2: "2222",});
		}, 1000)
	);
};

const dbAdd = async (json) => {

};

const dbRemove = async (json) => {

};
