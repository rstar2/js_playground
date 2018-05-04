const Blockchain = require('../../src/blockchain/Blockchain');
const Block = require('../../src/blockchain/Block');
const Transaction = require('../../src/blockchain/Transaction');

describe("Blockchain suite", () => {
    test('should be valid when not-tempered', () => {
        let rumenCoin = new Blockchain(1);
        expect(rumenCoin.isChainValid()).toBeTruthy();
    });

    test('should be invalid when tempering the root', () => {
        let rumenCoin = new Blockchain(1);

        rumenCoin.chain[0].transactions.push(new Transaction("from", "me", 1000));

        expect(rumenCoin.isChainValid()).toBeFalsy();
    });

    test('should be invalid when tempering a block', () => {
        let rumenCoin = new Blockchain(1);

        rumenCoin.createTransaction(new Transaction("from", "to", 100));
        rumenCoin.createTransaction(new Transaction("from", "to", 200));
        rumenCoin.minePendingTransactions();

        // try temper it - will not be valid any more
        rumenCoin.chain[1].transactions[0].amount = 10000;

        expect(rumenCoin.isChainValid()).toBeFalsy();
    });

    test('should be invalid when tempering a block and re-calculating its hash', () => {
        let rumenCoin = new Blockchain(1);

        rumenCoin.createTransaction(new Transaction("from", "to", 100));
        rumenCoin.createTransaction(new Transaction("from", "to", 200));
        rumenCoin.minePendingTransactions();

        // try temper it with recalculating the hash - the next block will brake
        // e.g. in order to temper one block you have to temper all succeeding ones
        rumenCoin.chain[1].transactions[0].amount = 1000;
        rumenCoin.chain[1].hash = rumenCoin.chain[1].calculateHash();

        expect(rumenCoin.isChainValid()).toBeFalsy();
    });

    test('should be invalid when tempering a block and re-mined', () => {
        let rumenCoin = new Blockchain(1);

        rumenCoin.createTransaction(new Transaction("from", "to", 100));
        rumenCoin.createTransaction(new Transaction("from", "to", 200));
        rumenCoin.minePendingTransactions();

        // try temper it with recalculating the hash - the next block will brake
        // e.g. in order to temper one block you have to temper all succeeding ones
        rumenCoin.chain[1].transactions[0].amount = 1000;
        rumenCoin.chain[1].hash = rumenCoin.chain[1].mineBlock(rumenCoin.getProofOfWorkPredicate());

        expect(rumenCoin.isChainValid()).toBeFalsy();
    });
});