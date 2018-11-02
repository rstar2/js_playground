const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddress, toAddress, amount = 0) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    // TODO: https://www.youtube.com/watch?v=kWQ84S13-hw
    sign(signingKey) {
        // if our publicKey of the 'signingKey' equals the fromAddress
        // we can only spend coins from the wallet for which we have privateKey
        if (signingKey.getPublic() !== this.fromAddress) {
            throw new Error('You cannot sign transaction for other wallets');
        }

        const hash = this.calculateHash();
        this.signature = signingKey.sign(hash);
    }

    /**
     * @return {Boolean}
     */
    verify() {
        // special case - the mining-reward transaction

        // such transactions are not signed
        if (this.fromAddress === null) return true;

        if (!this.signature) {
            throw new Error('Cannot verify not signed transaction');
        }

        return true;
    }

    toString() {
        return `Transaction of amount ${this.amount} from ${this.fromAddress} to ${this.toAddress}`;
    }
}

module.exports = Transaction;