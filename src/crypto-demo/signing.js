// 7. - Digital Signature (using the private/public keypair)
// When no need to encrypt/decrypt
// just wanted to validate that the message from trusted party

const {publicKey, privateKey} = require('./private-public-keypair');

const {createSign, createVerify} = require('crypto');

const message = 'Public message';

// SIGH
const signer = createSign('rsa-sha256');
signer.update(message);
const signature = signer.sign(privateKey, 'hex');

// send to someone both the message and the signature


// VERIFY
const verifier = createVerify('rsa-sha256');

verifier.update(message);

const isVerified = verifier.verify(publicKey, signature, 'hex');

console.log(isVerified);