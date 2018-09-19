#!/usr/bin/env node

const argv = require('yargs').argv

if (argv.digit) {
  console.log(argv.digit + 1)
} else {
  console.log('Hmmm. I\'m confused')
}

// Usage: 
// $ node plusone.js --digit=4