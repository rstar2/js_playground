#!/usr/bin/env node

if (process.argv.length < 4) {
    console.log("Usage: Pass at least 2 arguments.\nExample: calc 45 + 45");
    process.exit(1);
}
const args = process.argv.slice(2);

const sum = args.reduce((sum, arg) => sum + (+arg), 0);

console.log('Result is:', sum);

// Usage:
// $ node sum.js 10 20

