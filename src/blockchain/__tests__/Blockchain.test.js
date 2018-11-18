const Blockchain = require('../Blockchain');
const Wallet = require('../Wallet');
const Transaction = require('../Transaction');

const addAndSign = (wallet, transaction, chain) => {

};

describe('Blockchain suite', () => {
    test('should be valid when not-tempered', () => {
        const rumenCoin = new Blockchain(1);
        expect(rumenCoin.isChainValid()).toBeTruthy();
    });

    test('should be invalid when tempering the root', () => {
        const rumenCoin = new Blockchain(1);

        rumenCoin.chain[0].transactions.push(new Transaction('from', 'me', 1000));

        expect(rumenCoin.isChainValid()).toBeFalsy();
    });

    test('should be invalid when tempering a block', () => {
        const rumenCoin = new Blockchain(1);

        const from = new Wallet();
        const to = new Wallet();

        rumenCoin.addTransaction(new Transaction('from', 'to', 100));
        rumenCoin.addTransaction(new Transaction('from', 'to', 200));
        rumenCoin.minePendingTransactions('miner');

        // try temper it - will not be valid any more
        rumenCoin.chain[1].transactions[0].amount = 10000;

        expect(rumenCoin.isChainValid()).toBeFalsy();
    });

    test('should be invalid when tempering a block and re-calculating its hash', () => {
        const rumenCoin = new Blockchain(1);

        rumenCoin.addTransaction(new Transaction('from', 'to', 100));
        rumenCoin.addTransaction(new Transaction('from', 'to', 200));
        rumenCoin.minePendingTransactions('miner');

        rumenCoin.addTransaction(new Transaction('from', 'to', 1000));
        rumenCoin.addTransaction(new Transaction('from', 'to', 2000));
        rumenCoin.minePendingTransactions();

        // try temper it with recalculating the hash - the next block will brake
        // e.g. in order to temper one block you have to temper all succeeding ones
        rumenCoin.chain[1].transactions[0].amount = 1000;
        rumenCoin.chain[1].hash = rumenCoin.chain[1].calculateHash();

        expect(rumenCoin.isChainValid()).toBeFalsy();
    });

    test('should be invalid when tempering a block and re-mined', () => {
        const rumenCoin = new Blockchain(1);

        rumenCoin.addTransaction(new Transaction('from', 'to', 100));
        rumenCoin.addTransaction(new Transaction('from', 'to', 200));
        rumenCoin.minePendingTransactions();

        rumenCoin.addTransaction(new Transaction('from', 'to', 1000));
        rumenCoin.addTransaction(new Transaction('from', 'to', 2000));
        rumenCoin.minePendingTransactions();

        // try temper it with recalculating the hash - the next block will brake
        // e.g. in order to temper one block you have to temper all succeeding ones
        rumenCoin.chain[1].transactions[0].amount = 1000;
        rumenCoin.chain[1].hash = rumenCoin.chain[1].mineBlock(rumenCoin.getProofOfWorkPredicate());

        expect(rumenCoin.isChainValid()).toBeFalsy();
    });

    test('should be invalid when tempering a block and re-calculating its hash and re-mined', () => {
        const rumenCoin = new Blockchain(1);

        rumenCoin.addTransaction(new Transaction('from', 'to', 100));
        rumenCoin.addTransaction(new Transaction('from', 'to', 200));
        rumenCoin.minePendingTransactions();

        rumenCoin.addTransaction(new Transaction('from', 'to', 1000));
        rumenCoin.addTransaction(new Transaction('from', 'to', 2000));
        rumenCoin.minePendingTransactions();

        // try temper it with recalculating the hash - the next block will brake
        // e.g. in order to temper one block you have to temper all succeeding ones
        rumenCoin.chain[1].transactions[0].amount = 1000;
        rumenCoin.chain[1].hash = rumenCoin.chain[1].calculateHash();
        rumenCoin.chain[1].hash = rumenCoin.chain[1].mineBlock(rumenCoin.getProofOfWorkPredicate());

        expect(rumenCoin.isChainValid()).toBeFalsy();
    });

});