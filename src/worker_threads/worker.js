const {/*Worker, isMainThread, */ parentPort, workerData } = require('worker_threads');

const { id } = workerData;

console.log(`Worker ${id} running`);

const min = 2;
let primes = [];

function generatePrimes(start, range) {
    let isPrime = true;
    let end = start + range;
    for (let i = start; i < end; i++) {
        for (let j = min; j < Math.sqrt(end); j++) {
            if (i !== j && i % j === 0) {
                isPrime = false;
                break;
            }
        }
        if (isPrime) {
            primes.push(i);
        }
        isPrime = true;
    }
}

generatePrimes(workerData.start, workerData.range);
parentPort.postMessage(primes);
// here the worker exits
// NOTE: BUT if we have attached listener then the worker will not exit but will wait for a new task
// parentPort.on('message', (data) => {
//     const result = doSomething(data);
//     parentPort.postMessage(result);
// });



// we can create exchange MessageChannel between the main and worker threads
// // main.js
// const worker = new Worker(path.join(__dirname, 'worker.js'));
// const { /*MessagePort*/ port1, /*MessagePort*/ port2 } = new MessageChannel();
// port1.on('message', (message) => {
//     console.log('message from worker:', message);
// });
// worker.postMessage({ port: port2 }, [port2]);

// // worker.js
// parentPort.on('message', (data) => {
//     const { /*MessagePort*/ port } = data;
//     port.postMessage('heres your message!');
// });
