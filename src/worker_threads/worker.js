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
