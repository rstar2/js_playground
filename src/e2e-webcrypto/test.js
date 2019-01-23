/* eslint-disable quotes */
const crypto = require('crypto');

// ---------- Generate
// const { generateKeyPairSync } = require('crypto');
// const { publicKey, privateKey } = generateKeyPairSync('rsa', {
//     modulusLength: 4096,
//     publicKeyEncoding: {
//         type: 'spki',
//         format: 'pem'
//     },
//     privateKeyEncoding: {
//         type: 'pkcs8',
//         format: 'pem'
//     }
// });



// ------- Encrypting

// const { publicKey } = require('./keys');
// const message = "Hello from NodeJS";

// const bufferEnc = crypto.publicEncrypt({
//     key: publicKey,
// }, Buffer.from(message));
// const messageEnc = bufferEnc.toString('base64');
// console.log(messageEnc);

// ------- Decrypting

const { privateKeyPEM } = require('./keys');

const messageEnc = "A+ECQX/jFVoTd565GwhgmpdD3BPWolxbI698pbnHasCtC317s1/O1iBMlD3n3x4z78J8SK5GyJxekcmVfEmIR8OiQGLZMR5WdN1yatAZfK6p79mfVCCxu3sI/wGLAMXmH+GSJ83tUAb4XSRnJ/dlubTpOIqOG6nKNs4OUMNBJBs3IO/093SXE+NrcgzDvvSWm7JlxX3jrjmIb+MkWdsz9ecoZKyH3yAZGq+JoiJPP1QW/XpiDXIqB4eEyt7YBxq5he88+NkavR3UtetvWbFZfWL+nHRYFIPRJUJRdarrQQqLXtR42jx4rbIyepgEuvd0reMYElkjw5lwk1yf2VU8GA==";
const bufferEnc = Buffer.from(messageEnc, 'base64');

const bufferDec = crypto.privateDecrypt(privateKeyPEM, bufferEnc);

const messageDec = bufferDec.toString();

console.log(messageDec);
