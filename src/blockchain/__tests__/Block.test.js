const Blockchain = require('../Blockchain');
const Block = require('../Block');
const Transaction = require('../Transaction');

describe("Block suite", () => {
    test('Proof-of-work - should be mined for at least 1 sec (1000ms)', () => {
        let blockchain = new Blockchain(5);

        const block = new  Block(Date.now(), [
            new Transaction("from", "to", 100),
            new Transaction("from", "to", 200)
        ], "123123123123");

        const start = Date.now();
        block.mineBlock(blockchain.getProofOfWorkPredicate());
        const period = Date.now() - start;

        expect(period).toBeGreaterThan(400);
    });
});