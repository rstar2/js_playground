#!/usr/bin/env node

const { promisify } = require('util');
const fs = require('fs');
const program = require('commander');
const prompt = require('co-prompt');
const chalk = require('chalk');
const ProgressBar = require('progress');

// this program has no sub-commands, so there's only one main action
let hasFile = false;
program
    .version('0.1.0')
    // .usage('[options] <file>')
    .arguments('<file>')

    .option('-v, --verbose', 'More or less verbosity')
    // -v => program.verbose === true 

    .option('--no-check', 'Negated value')
    // --no-check => program.check === false

    .option('-u, --username <username>', 'The user to authenticate as')
    // -u 'Rumen Neshev' => program.username === 'Rumen Neshev'

    .option('-p, --password <password>', 'The user\'s password')

    // it's still called synchronously, no matter that it is a callback
    // This is by Commander design as different command actions could be invoked that way,
    // e.g. multiple .action(...) could exist on the same program.
    // Still the 'action' of the command found (e.g. the callback) will be executed synchronously.
    // NOTE - the action call back will be called only if valid 'file' argument is provided to the program
    // otherwise not
    .action(function (file) {
        hasFile = true;
        asyncExec(file);
    })
    .parse(process.argv);

if (!hasFile) {
    // this means that no 'file' argument is provided
    program.outputHelp();
    process.exit(1);
}

async function asyncExec(file) {
    let username = program.username || await promisify(prompt('Username: '))();
    let password = program.password || await promisify(prompt.password('Password: '))();

    // no the real action can be done
    exec(username, password, file);
}

function exec(username, password, file) {
    // add a progress indication
    const total = 5;

    const progress = new ProgressBar('  uploading [:bar] :percent :etas', {
        width: 40,
        total : total,
        clear: true,

        // finish callback
        callback: () => {
            console.log('User:', chalk.bold.cyan(username),
            '\nPassword:', chalk.bold.red(password),
            '\nFile:', chalk.bold.yellow(file));
        } 
    });
    function progressChanged(total, n = 1) {
        progress.tick();
        if (n < total) {
            setTimeout(progressChanged.bind(null, total, n + 1), 1000);
        }
    }
    progressChanged(total);
}