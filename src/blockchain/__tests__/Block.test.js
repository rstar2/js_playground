const Blockchain = require('../Blockchain');
const Wallet = require('../Wallet');
const Transaction = require('../Transaction');
const Block = require('../Block');

/**
 * 
 * @param {Wallet} from 
 * @param {Wallet} to 
 * @param {Number} amout 
 */
const createAndSign = (from, to, amount) => {
    const transaction = new Transaction(from.getAddress(), to.getAddress(), amount);
    transaction.sign(from);
};

describe('Block suite', () => {
    test('Proof-of-work - should be mined for at least 1 sec (1000ms)', () => {
        let blockchain = new Blockchain(5);
        const from = new Wallet();
        const to = new Wallet();

        const block = new Block(Date.now(), [createAndSign(from, to, 10), createAndSign(from, to, 20)], '123123123123');

        const start = Date.now();
        block.mineBlock(blockchain.getProofOfWorkPredicate());
        const period = Date.now() - start;

        expect(period).toBeGreaterThan(400);
    });
});