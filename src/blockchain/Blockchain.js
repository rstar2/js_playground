const Block = require('./Block.js');

class Blockchain {
    constructor() {
        this.chain = [this._createGenesisBlock()];
        this.difficulty = 3;
        this.miningReward = 100;
        this.pendingTransactions = [];
    }

    _createGenesisBlock() {
        return new Block("01/01/2017", [], "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        // attach it to the previous
        newBlock.previousHash = this.getLatestBlock().hash;

        // calculate the hash - but with proof-of-work (e.g. mine it)
        const timeId = `Block ${this.chain.length-1} - ${newBlock} mined for`;
        console.time(timeId);

        newBlock.mineBlock(this.difficulty);

        console.timeEnd(timeId);
        
        // put into the chain
        this.chain.push(newBlock);
    }

    isChainValid() {
        // validate the genesis root/block
        this.chain[0].hash = this.chain[0].calculateHash(); 

        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

module.exports = Blockchain;