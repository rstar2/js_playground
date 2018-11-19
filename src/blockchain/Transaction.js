const SHA256 = require('crypto-js/sha256');

const Wallet = require('./Wallet');

class Transaction {
    constructor(fromAddress, toAddress, amount = 0) {
        this.fromAddress = fromAddress;
        if (!toAddress)
            throw new Error(`Transaction from ${fromAddress} to 'nobody`);
        this.toAddress = toAddress;
        this.amount = amount;
    }

    /**
     * @return {String}
     */
    calculateHash() {
        return SHA256((this.fromAddress || '') + this.toAddress + this.amount).toString();
    }

    /**
     * @return {Boolean}
     */
    isSigned() {
        return !!this.signature;
    }

    /**
     * 
     * @param {Wallet} wallet
     * @return {String} 
     */
    sign(wallet) {
        if (!wallet.canSignAddress(this.fromAddress)) {
            throw new Error('You cannot sign transaction for other wallets');
        }

        const hash = this.calculateHash();
        this.signature = wallet.sign(hash);
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

        return Wallet.verify(this.fromAddress, this.calculateHash(), this.signature);
    }

    toString() {
        return `Transaction of amount ${this.amount} from ${this.fromAddress} to ${this.toAddress}`;
    }
}

module.exports = Transaction;