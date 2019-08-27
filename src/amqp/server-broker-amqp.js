//static file server
const amqp = require('amqplib');
const JSONStream = require('JSONStream');
const request = require('request');

const server = require('http').createServer(
    require('ecstatic')({root: __dirname + '/www'})
);
const port = process.argv[2] || 8080;
server.listen(port);

const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({server: server});

// use AMQP (in this case RabbitMQ) as message broker
let channel, queue;
amqp.connect('amqp://localhost')
    .then(conn => conn.createChannel())
    .then(ch => {
        channel = ch;
        return channel.assertExchange('chat', 'fanout');
    })
    .then(() => {
        return channel.assertQueue(`chat_srv_${port}`, {exclusive: true});
    })
    .then(q => {
        queue = q.queue;
        return channel.bindQueue(queue, 'chat');
    })
    .then(() => {
        // consume from the message broker any new message
        return channel.consume(queue, msg => {
            msg = msg.content.toString();
            console.log('From queue: ' + msg);
            broadcast(msg);
        }, {noAck: true});
    })
    .catch(err => console.log(err))
;

wss.on('connection', function(ws) {
    console.log('Client connected');
    
    //query the history service when connected
    request('http://localhost:8090')
        .on('error', err => console.log(err))
        .pipe(JSONStream.parse('*'))
        .on('data', msg => ws.send(msg));

    ws.on('message', (msg) => {
        console.log('Message: ' + msg);
        
        // send to the message broker
        channel.publish('chat', '', new Buffer(msg));
    });
});

function broadcast(msg) {
    wss.clients.forEach((client) => client.send(msg));
}


// Start several servers to see it working
// node server-broker-redis.js 8080
// node server-broker-redis.js 8081
// node server-broker-redis.js 8082
