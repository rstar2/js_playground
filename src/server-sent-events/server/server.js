const http = require('http');

const sse = require('./sse-connection');


// create a simple HTTP server 
http.createServer((request, response) => {
    console.log(`Request url: ${request.url}`);

    // this is the SSE endpoint
    if (request.url.toLowerCase() === '/events') {
        sse(request, response);
    } else {
        // could have other endpoints here
        response.writeHead(404);
        response.end();
    }
}).listen(5000, () => {
    console.log('Server running at http://127.0.0.1:5000/');
});
