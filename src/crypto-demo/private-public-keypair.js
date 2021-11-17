
// 5. Asymmetric keys - 5.1 generate keys - later store/send them (private is to be kept private) 
const {generateKeyPairSync} = require('crypto');

// RSA - the most common/best for now
const {privateKey, publicKey} = generateKeyPairSync('rsa', {
    modulusLength: 2048, // the length in bits of the key 
    
    // the recommended settings by NodeJS docs
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
});

module.exports = {
    publicKey,
    privateKey,
};