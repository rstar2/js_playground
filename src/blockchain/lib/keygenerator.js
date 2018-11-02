const EC = require('elliptic').ec;

// create e elliptic curve (with the same algorithm as used in Bitcoin wallet) 
const ec = new EC('secp256k1');

const key = ec.genKeyPair();
const privateKey = key.getPrivate('hex');
const publicKey = key.getPublic('hex');
console.log('Private key', privateKey);
console.log('Public key', publicKey);

/**
 * 
 * @param {EC.KeyPair} key 
 * @param {String} msg 
 * @param {String} [encSign]
 * @param {String} [enc]
 */
const _sign = (key, msg, encSign = 'base64', enc = 'hex') => {
    const signature = ec.sign(msg, key, encSign);
    return signature.toDER(enc);
};

const _verify = (key, msg, signature, enc) => {
    return ec.verify(msg, signature, key, enc);
};

/**
 * 
 * @param {EC.KeyPair} key
 * @param {String} [enc]
 * @return {String}
 */
const _getPrivate = (key, enc = 'hex') => {
    return key.getPrivate(enc);
};

/**
 * 
 * @param {EC.KeyPair} key
 * @param {String} [enc]
 * @return {String}
 */
const _getPublic = (key, enc = 'hex') => {
    return key.getPublic(enc);
};

const _verify = (key, signature)

module.exports = {
    /**
     * @return {KeyPair}
     */
    generateKey() {

        const key = ec.genKeyPair();

        return {

            /**
             * @param {String} [enc]
             * @return {String}
             */
            getPrivate(enc) {
                return _getPrivate(key, enc);
            },

            /**
             * @param {String} [enc]
             * @return {String}
             */
            getPublic(enc) {
                return _getPublic(key, enc);
            },
            /**
             * 
             * @param {String} msg 
             * @param {String} [enc]
             * @return {String}
             */
            sign(msg, enc) {
                return _sign(key, msg, enc);
            },

            /**
             * @return {Boolean}
             */
            verify() {

                _verify()
                
                return 
            },
        };
    },

};

