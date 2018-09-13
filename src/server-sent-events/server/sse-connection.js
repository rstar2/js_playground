/**
 * 
 * @param {HttpResponse} response 
 */
const closeConnection = (response) => {
    if (!response.finished) {
        response.end();
        console.log('Stopped sending events.');
    }
};

/**
 * 
 * @param {HttpRequest} request 
 * @param {HttpResponse} response 
 * @param {Array} eventHistory 
 */
const checkReconnection = (request, response, eventHistory) => {
    if (request.headers['last-event-id']) {
        const eventId = parseInt(request.headers['last-event-id']);

        const eventsToReSend = eventHistory.filter((e) => e.id > eventId);

        eventsToReSend.forEach((e) => {
            if (!response.finished) {
                response.write(e);
            }
        });
    }
}

/**
 * 
 * @param {HttpResponse} response
 * @param {Array} [eventHistory]
 * @param {String} event 
 * @param {Object} payload
 * @param {Number} timeout 
 */
const sendEvent = (response, eventHistory, event, payload, timeout) => {
    const send = () => {
        // SSE protocol for a single event is:
        // id: xxx\n
        // event: xxx\n
        // data: This is a message\n
        // data: A long message\n
        // \n
        // \n


        // sending "global" message - e.g. it the same as if the 'event' is set to 'message'
        // response.write(`data: ${JSON.stringify(data)}`);

        // could update the 'id' of the event as the client will send a 'Last-Event-Id' HTTP header when reconnecting to the SSE endpoint
        // thus the server can start sending it event from where it stopped and not from the begging (and not to skip any that the client has failed to receive)
        let eventString = '';

        // "id" and "event" are optional fields of the event
        const id = eventHistory ? eventHistory.length + 1 : null;
        if (id) {
            eventString += `id: ${id}\n`;
        }
        if (event) {
            eventString += `event: ${event}\n`;
        }

        // the "data" field is obligatory even if empty
        eventString += `data: ${payload ? JSON.stringify(payload) : ''}`;

        // each event must be separated with "\n\n"
        eventString += '\n\n';

        response.write(eventString);

        // cache events if reconnection comes to not send the same again
        if (eventHistory) {
            eventHistory.push(eventString);
        }
    };


    if (timeout || timeout === 0) {
        // async sending - even if the timeout is 0
        setTimeout(() => {
            console.log('Send SSE - async', event, timeout);
            // check if the connection is still open as this is async operation
            if (response.finished) return;

            send();
        }, timeout);
    } else {
        // synchronous
        console.log('Send SSE - sync', event);
        send();
    }
};

module.exports = (request, response) => {

    // keep a history of all events needed to be sent to any new connection (or reconnection)
    const eventHistory = [];

    // NOTE!!! 
    // The Server-Sent Event connection between the client and the server is a streaming connection.
    // This means that the connection will be kept active indefinitely unless the client or the server stops running.
    // and closing the stream from the server side will make the client just try to reconnect again - so in this case
    // the server has to notify it to not do this 

    // Closing the event stream on the client doesn't automatically close the connection on the server side.
    // This means that the server will continue to send events to the client.
    request.on('close', () => {
        closeConnection(response);
    });

    response.writeHead(200, {
        'Connection': 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',

        // Allow CORS if needed
        'Access-Control-Allow-Origin': '*'
    });

    checkReconnection(request, response, eventHistory);

    sendEvent(response, eventHistory, 'flightUpdate', { 'flight': 'I768', 'state': 'started' }, 3000);
    sendEvent(response, eventHistory, 'flightUpdate', { 'flight': 'I768', 'state': 'landing' }, 5000);
    sendEvent(response, eventHistory, 'flightUpdate', { 'flight': 'I768', 'state': 'landed' }, 7000);
    sendEvent(response, eventHistory, 'flightRemove', { 'flight': 'A123' }, 9000);

    // if we the server wants to close the connection it CANNOT simple call response.end();
    // it has to notify the client to do the same
    setTimeout(() => {
        sendEvent(response, null, 'closedConnection');
        response.end();
    }, 14000);
};