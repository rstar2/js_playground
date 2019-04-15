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
   
    worker.on('message', cb.bind(null, null));
    worker.on('error', cb);
   
    worker.on('exit', (exitCode) => {
        if (exitCode === 0) {
            return null;
        }
   
        return cb(new Error(`Worker has stopped with code ${exitCode}`));
    });
   
    return worker;
}

const WORKERS = new Array(5).fill(undefined);
WORKERS.forEach((_, index) => {
    console.log(`Start worker ${index}`);
    
    runWorker(path.join(__dirname,'worker.js'),
        (err, result) => {
            if (err)
                return console.error(`Worker ${index} failed: ${err}`);

            console.log(`Worker ${index} message: ${result}`);
        },
        {id: index, start: 0, range: 500});
});

