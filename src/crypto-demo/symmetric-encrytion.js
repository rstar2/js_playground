const { createCipheriv, createDecipheriv, randomBytes } = require('crypto');

// key- must be 16 B
const key = randomBytes(32); // 'supersecret';

// initial vector
const iv = randomBytes(16);

const cipher = createCipheriv('aes256', key, iv);

const message = 'Hello';
const encMessage = cipher.update(message, 'utf8', 'hex') + cipher.final('hex');

// send to someone who knows same key and iv

const decipher = createDecipheriv('aes256', key, iv);

const decMessage =
  decipher.update(encMessage, 'hex','utf8') + decipher.final('utf8');


console.log(message === decMessage);