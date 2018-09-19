const prompt = require('co-prompt');
const { promisify } = require('util');

function promptAsPromise(msg) {
    return new Promise((resolve, reject) => {
        const doPrompt = prompt(msg);
        doPrompt((error, value) => {
            if (error) {
                reject(value);
            } else {
                resolve(value);
            }
        });
    });
}


// I. Without generators, async/await and etc.. - just callbacks
// const doPrompt = prompt("Username: ");
// doPrompt(function (error, value) {
//     console.log(`Username is ${value}`);
//     process.exit();
// });

// II. using generator functions and co
// const co = require('co');
// co(function* generatorExec() {
//     // co can yield :
//     // 1. Promises
//     // 2. thunks (functions with one argument another function)
//     // 3. arrays - parallel executions
//     // 4. objects - parallel executions
//     // 5. other generators  or generator functions
//     const promise = yield new Promise(function (resolve, reject) {
//         setTimeout(() => resolve("Promised you to wait a little!"), 3000);
//     });

//     // prompt as 'thunk'
//     const firstname = yield prompt("First Name: ");

//     // prompt turned to a Promise - custom
//     const lastname = yield promptAsPromise("Last Name: ");

//     // prompt turned to a Promise - using NodeJS util.promisify() - then returns a function creating a Promise
//     // as the 'prompt' API returns a proper format
//     // they accept a callback function with first param 'error' and second a 'value')
//     const password = yield promisify(prompt.password("Password: "))();

//     console.log(`Hello ${firstname} ${lastname} - password is: ${password}`);
//     process.exit();
// });

// III. Using async/await
async function main() {
    // prompt turned to a Promise - custom
    const name = await promptAsPromise("Name: ");

    // prompt turned to a Promise - using NodeJS util.promisify()
    // as the 'prompt' API returns a proper format
    // they accept a callback function with first param 'error' and second a 'value')
    const password = await promisify(prompt.password("Password: "))();

    console.log(`Hello ${name}- password is: ${password}`);
    process.exit();
}

main();

// Usage:
// $ node prompt.js

