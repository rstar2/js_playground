#!/usr/bin/env node

const fs = require('fs');
const filesize = require('filesize');

const files = fs.readdirSync('./');
files.forEach(file => {
    const fsize = filesize(fs.statSync(file).size)

    console.log(`${file} - ${fsize}`);
});