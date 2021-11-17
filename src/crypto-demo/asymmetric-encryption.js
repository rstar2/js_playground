// 6. Asymmetric encrypt/decrypt - using the private/public keypair
const {publicKey, privateKey} = require('./private-public-keypair');

const {publicEncrypt, privateDecrypt} = require('crypto');

const message = 'Hi';

const encMessageData = publicEncrypt(publicKey, Buffer.from(message));
//  console.log(encMessageData.toString('hex'));


const decMessageData = privateDecrypt(privateKey, encMessageData);
const decMessage = decMessageData.toString('utf8');

console.log(decMessage === message);
