#!/usr/bin/env node

/* 
   USAGE:
   -----
   1. Passing a file as input:
      $ node countlines.js < filename - 
   2  Using the output of another program as input, e.g piping:
      $ cat package.json | node countlines.js      - Unix
      $ type package.json | node countlines.js     - Windows
 */

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
});

let count = 0;

rl.on('line', (line) => {
    count++;
});

rl.on('close', () => {
    console.log(`Read ${count} lines`);
});


