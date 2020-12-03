const Blockchain = require('../Blockchain');
const Wallet = require('../Wallet');
const Transaction = require('../Transaction');

describe('Transaction suite', () => {
    test('should be valid when signing ', () => {
        const rumenCoin = new Blockchain(1);
        const from = new Wallet();
        const to = new Wallet();

        const transaction = new Transaction(from.getAddress(), to.getAddress(), 100);
        transaction.sign(from);

        rumenCoin.addTransaction(transaction);
        rumenCoin.minePendingTransactions('miner');

        expect(rumenCoin.isChainValid()).toBeTruthy();
    });

    test('should not allow when no signing ', () => {
        const rumenCoin = new Blockchain(1);
        const hacked_address = new Wallet();
        const me = new Wallet();

        const transaction = new Transaction(hacked_address.getAddress(), me.getAddress(), 100);
        try {
            rumenCoin.addTransaction(transaction);
        } catch (err) {
            expect(err).toBeDefined();
        }
    });

});