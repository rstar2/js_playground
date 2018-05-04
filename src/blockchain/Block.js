const SHA256 = require("crypto-js/sha256");

const Transaction = require('./Transaction.js');

class Block {

    /**
     * 
     * @param {String|Number} timestamp 
     * @param {Transaction[]} transactions 
     * @param {String} previousHash 
     */
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = "" + timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;

        this.nonce = 0; // random number - just to create new hashes

        // note this hash is still tno validated by the proof-of-work mechanism
        // so if such block is added to the chain it will be rejected
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp +
            JSON.stringify(this.transactions) + this.nonce).toString();
    }

    /**
     * 
     * @param {(Block) => Boolean } proofOfWorkPredicate 
     */
    mineBlock(proofOfWorkPredicate) {
        while (!proofOfWorkPredicate(this)) {
            // we cannot change anything else but the 'nonce' value ( that's why it's added :) ) 
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("BLOCK MINED: " + this.hash);
    }

    toString() {
        return `Block ${this.timestamp} - ${this.transactions.join(', ')}`;
    }
}

module.exports = Block;