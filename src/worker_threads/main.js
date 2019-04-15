const path = require('path');
const { Worker /*, isMainThread, parentPort*/ } = require('worker_threads');

/**
 * 
 * @param {String} path 
 * @param {Function} cb 
 * @param {Object} [workerData] 
 */
function runWorker(path, cb, workerData) {
    const worker = new Worker(path, { workerData });
   
    // Emitted whenever a worker stops parsing the JavaScript code and starts the execution.
    // It’s not used very often, but it can be informative in specific cases.
    worker.on('online', () => {});

    // Emitted whenever there’s an uncaught exception inside the worker.
    // The worker is then terminated, and the error is available as the first argument in the provided callback.
    worker.on('error', cb);
   
    // Emitted whenever a worker exits. If process.exit() was called inside the worker, exitCode would be provided to the callback.
    // If the worker was terminated with worker.terminate(), the code would be 1.
    worker.on('exit', (exitCode) => {
        if (exitCode === 0) {
            return null;
        }
   
        return cb(new Error(`Worker has stopped with code ${exitCode}`));
    });

    // Emitted whenever a worker sends data to the parent thread.
    worker.on('message', cb.bind(null, null));
   
    return worker;
}

const WORKERS = new Array(5).fill(undefined);
WORKERS.forEach((_, index) => {
    console.log(`Start worker ${index}`);
    
    const worker = runWorker(path.join(__dirname,'worker.js'),
        (err, result) => {
            if (err)
                return console.error(`Worker ${index} failed: ${err}`);

            console.log(`Worker ${index} message: ${result}`);
        },
        {id: index, start: 0, range: 500});

    // // send some data to the worker if needed
    // worker.postMessage({});
});

