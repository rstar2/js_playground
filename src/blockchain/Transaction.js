class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    toString() {
        return `Transaction of amount ${this.amount} from ${this.fromAddress} to ${this.toAddress}`;
    }
}

module.exports = Transaction;