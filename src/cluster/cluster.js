const cluster = require('cluster');
const { cpus } = require('os');

const log = require('./src/log');
const createApp = require('./src/app');

const isMaster = cluster.isMaster;

if (isMaster) {
    // A single instance of Node.js runs in a single thread.
    // To take advantage of multi-core systems, launch a cluster of Node.js processes to handle the load.
    // The cluster module allows easy creation of child processes that ALL SHARE SERVER PORTS!!!
    const numWorkers = cpus().length;
    log(`Forking ${numWorkers} workers`);

    for (let i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('online', (worker) => log(`Worker ${worker.process.pid} is online`));
    cluster.on('exit', (worker, exitCode) => {
        log(`Worker ${worker.process.id} exited with code ${exitCode}`);
        log('Starting a new worker');
        cluster.fork();
    });

} else {
    const app = createApp();
    app.listen(3000);
}