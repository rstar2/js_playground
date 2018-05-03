const SHA256 = require("crypto-js/sha256");

const Transaction = require('./Transaction.js');

class Block {

    /**
     * 
     * @param {Date} timestamp 
     * @param {Transaction[]} transactions 
     * @param {String} previousHash 
     */
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;

        this.nonce = 0; // random number - just to create new hashes
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp +
            JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        const difficultyStart = Array(difficulty + 1).join("0");
        // so for difficulty=4 => difficultyStart="0000";

        while (this.hash.substring(0, difficulty) !== difficultyStart) {
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