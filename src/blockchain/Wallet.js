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
        return this.key.getPublic() === address;
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
     * @param {String} signature
     * @return {Boolean}
     */
    verify(signature) {

    }
}

module.exports = Wallet;
// https://www.youtube.com/watch?v=kWQ84S13-hw