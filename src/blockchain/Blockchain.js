const Block = require('./Block.js');
const Transaction = require('./Transaction');

class Blockchain {
    constructor(difficulty = 3) {
        this.difficulty = difficulty;
        this.miningReward = 100;
        this.pendingTransactions = [];
        this.chain = [this._createGenesisBlock()];
    }

    _createGenesisBlock() {
        const root = new Block("01/01/2017", [], "");
        root.mineBlock(this.getProofOfWorkPredicate());
        return root;
    }

    getProofOfWorkPredicate() {
        // it should start with at least 'this.difficulty' zeros
        // e.g if this.difficulty === 1 => '0asdasdasdadasdasdasd...'
        const difficultyStart = Array(this.difficulty + 1).join("0");
        
        return (block) => {
            return block.hash.substring(0, this.difficulty) === difficultyStart;
        };
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(rewardMinerAddress) {
        // in reality not all pending transactions can fit into a single block as they can be too many
        const newBlock = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);

        newBlock.mineBlock(this.getProofOfWorkPredicate());
        console.log(`New block successfully mined - ${newBlock}`);

        this.chain.push(newBlock);

        // give reward to the miner
        this.pendingTransactions = [
            new Transaction(null, rewardMinerAddress, this.miningReward)
        ];
    }

    createTransaction(newTransaction) {
        this.pendingTransactions.push(newTransaction);
    }

    getBalanceOf(address) {
        // there's no "stored" wallet/balance of each address
        // it is calculated each time by looking through the blockchain

        let balance = 0;
        for (const block of this.chain) {
            for (const transaction of block.transactions) {
                if (transaction.fromAddress === address) {
                    balance -= transaction.amount;
                } else if (transaction.toAddress === address) {
                    balance += transaction.amount;
                }
            }
        }

        return balance;
    }

    isChainValid() {
        const proofOfWorkPredicate = this.getProofOfWorkPredicate();

        // validate the genesis root/block
        if (this.chain[0].hash !== this.chain[0].calculateHash() ||
            // check proof-of-work
            !proofOfWorkPredicate(this.chain[0])) {
            return false;
        }

        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash() ||
                // check proof-of-work
                !proofOfWorkPredicate(currentBlock)) {
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