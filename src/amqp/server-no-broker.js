//static file server
const server = require('http').createServer(
    require('ecstatic')({root: __dirname + '/www'})
);
server.listen(process.argv[2] || 8080);

const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({server: server});

wss.on('connection', function(ws) {
    console.log('Client connected');

    ws.on('message', function(msg) {
        console.log('Message: ' + msg);
        broadcast(msg);
    });
});

function broadcast(msg) {
    wss.clients.forEach(function(client) {
        client.send(msg);
    });
}

// NOTE: this does not scale for more then NodeJS server instance, e.g. cannot be load-balanced
// In order to be able to have multiple load-balanced servers a message broker is needed
