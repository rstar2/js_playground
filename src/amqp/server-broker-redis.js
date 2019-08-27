//static file server
const server = require('http').createServer(
    require('ecstatic')({root: __dirname + '/www'})
);
server.listen(process.argv[2] || 8080);

const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({server: server});

// use Redis as message broker
const redis = require('redis');
const redisSub = redis.createClient();
const redisPub = redis.createClient();
redisSub.subscribe('chat_messages');
redisSub.on('message', function(channel, msg) {
    broadcast(msg);
});

wss.on('connection', function(ws) {
    console.log('Client connected');

    ws.on('message', function(msg) {
        console.log('Message: ' + msg);
        redisPub.publish('chat_messages', msg);
    });
});

function broadcast(msg) {
    wss.clients.forEach(function(client) {
        client.send(msg);
    });
}


// Start several servers to see it working
// node server-broker-redis.js 8080
// node server-broker-redis.js 8081
// node server-broker-redis.js 8082
