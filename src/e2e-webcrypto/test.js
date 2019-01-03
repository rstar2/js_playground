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

const messageEnc = "JPWKSomFiY4myiUAOe7KLFE+0RRSrqgXb9JSX63JR1L2aIT9LqvKd91GfDUgViWK7D9a3bm4EyO8+w+dy9ylwGv0g8k++5V5GbE6Mp+Gwl9mY2HT1fg5qs53c9SMzBPUTGsIaT6V1uH+iD883PV0u49Y7bqRBhuLSZWYsYuNbRAHrvi1j/01QDF5LaLarugxL4Kj1xfVfKjZVxDzr3Y2ik+NjGMDZDTtn6sYGSPYzY401qDDsmkK1hjKxaDXvxKYn5tpZzfWTWuVmtwwY+iU2BY16XUWk+O0VQ7uPAK1/grYohp5PexG9HSgdZnSxNMJafKxQZdFTFUArzBoORkT2Ui/YVHI/my7CCXdqfQywmdLhkadU5mfrMb7QlUJTPJasVXgTKuKvn6+5ZvganeuIBf9sn95bDNEtDW7XZdrqNe8Hp41llnHadvYitijxXfyW4pcrcqnkKABGYDLH5330qUYNncBrOhpAkNVE9uAQ/9S/Wnc/Tj/msS5yzOZaRDw4a2G5o+x+nCbnVHW6/XQifHCGv3L2D4X7KZlJqrNHE93svUann8eK8RAEUxHVh2nYlWtkOGadUsKtswzr4i/Kswxahj7wgbQQFuoG5OscpcwyR8iKHLs2eFVBae0jfUgMWH4HsBjJaKWmZjvq68ckrkTCd0X2EYpmwYWWfUY8OY=";
const bufferEnc = Buffer.from(messageEnc, 'base64');

const bufferDec = crypto.privateDecrypt(privateKeyPEM, bufferEnc);

const messageDec = bufferDec.toString();

console.log(messageDec);
