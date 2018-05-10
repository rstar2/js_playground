'use strict';

const moment = require('moment');

// access the environment variables
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_SENDER = process.env.TWILIO_SENDER;

module.exports.check = (event, context, callback) => {
  console.time("Invoking function check took");

  const now = moment(Date.now()).format("MMM Do YY");;

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `Checked on ${now} - SMS sender ${TWILIO_SENDER}`,
      event,
    }),
  };

  console.timeEnd("Invoking function check took");
  callback(null, response);
};


module.exports.api = (event, context, callback) => {
  console.time("Invoking function api took");
  switch (event.httpMethod) {
    case 'GET':
      break;
    case 'POST':
      break;
    default:
      return callback(`Unsupported API gateway with HTTP method ${event.httpMethod}`);
  }

  let name = "Anonymous";

  if (event.queryStringParameters && event.queryStringParameters.name) {
    // extract parameters from the request's query
    name = event.queryStringParameters.name;
  } else if (event.httpMethod === 'POST') {
    // extract parameters from HTTP POST request

    // assume it's JSON ("application/json")
    const json = JSON.parse(event.body);
    if (json.name) {
      name = json.name;
    }
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello ${name}`,
      event,
    }),
  };

  console.time("Invoking function api took");
  callback(null, response);
};

const apiList = () => {

};

const apiAdd = () => {

};

const apiRemove = () => {

};