const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddress, toAddress, amount = 0) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    /**
     * @return {String}
     */
    calculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
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
     * 
     * @param {Wallet} wallet
     * @return {Boolean}
     */
    verify(wallet) {
        // special case - the mining-reward transaction

        // such transactions are not signed
        if (this.fromAddress === null) return true;

        if (!this.signature) {
            throw new Error('Cannot verify not signed transaction');
        }

        return wallet.verify(this.signature);
    }

    toString() {
        return `Transaction of amount ${this.amount} from ${this.fromAddress} to ${this.toAddress}`;
    }
}

module.exports = Transaction;