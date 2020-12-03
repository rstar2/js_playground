const EC = require('elliptic').ec;

// create e elliptic curve (with the same algorithm as used in Bitcoin wallet) 
const ec = new EC('secp256k1');

class Wallet {
    constructor() {
        this.key = ec.genKeyPair();
    }

    /**
     * @return {String}
     * @param {String} [enc]
     */
    getAddress(enc = 'hex') {
        return this.key.getPublic(enc);
    }

    /**
     * 
     * @param {String} address 
     */
    canSignAddress(address) {
        // wallet can sign only his address (e.g. public key - as it's the address)
        // we can only spend coins from the wallet for which we have privateKey
        return this.getAddress() === address;
    }

    /**
     * 
     * @param {String} transaction
     * @param {String} [encSign]
     * @param {String} [enc]
     * @return {String}
     */
    sign(transaction, encSign = 'base64', enc = 'hex') {
        const signature = ec.sign(transaction, this.key, encSign);
        return signature.toDER(enc);
    }

    /**
     * 
     * @param {String} transaction
     * @param {String} signature
     * @param {String} [encSign]
     * @return {Boolean}
     */
    verify(transaction, signature, encSign = 'base64') {
        return Wallet._verify(transaction, signature, this.key, encSign);
    }
}

/**
 * 
 * @param {String} address
 * @param {String} transaction
 * @param {String} signature
 * @param {String} [enc]
 * @param {String} [encSign]
 * @return {Boolean}
 */
Wallet.verify = (address, transaction, signature, enc = 'hex', encSign = 'base64') => {
    const key = ec.keyFromPublic(address, enc);
    return Wallet._verify(transaction, signature, key, encSign);
};

/**
 * 
 * @param {ec.KeyPair} key
 * @param {String} transaction
 * @param {String} signature
 * @param {String} [encSign]
 * @return {Boolean}
 */
Wallet._verify = (transaction, signature, key, encSign = 'base64') => {
    return ec.verify(transaction, signature, key, encSign);
};

module.exports = Wallet;
// https://www.youtube.com/watch?v=kWQ84S13-hw