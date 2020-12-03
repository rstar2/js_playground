//static file server
const timestamp = require('monotonic-timestamp');
const level = require('level');
const JSONStream = require('JSONStream');
const db = level('./msgHistory');
const amqp = require('amqplib');

//HTTP server for querying the chat history
require('http').createServer((req, res) => {
    res.writeHead(200);
    db.createValueStream()
        .pipe(JSONStream.stringify())
        .pipe(res);
}).listen(8090);

let channel, queue;
amqp.connect('amqp://localhost')
    .then((conn) => conn.createChannel())
    .then((ch) => {
        console.log('AMQP channel to history service created');
        channel = ch;
        return channel.assertExchange('chat', 'fanout');
    })
    .then(() => channel.assertQueue('chat_history'))
    .then((q) => {
        queue = q.queue;
        return channel.bindQueue(queue, 'chat');
    })
    .then(() => {
        console.log('AMQP queue to history service created and bound');
        return channel.consume(queue, (msg) => {
            const content = msg.content.toString();
            console.log('Saving message: ' + content);
            db.put(timestamp(), content, (err) => {
                if(!err) channel.ack(msg);
            });
        });
    })
    .catch((err) => console.log(err));
