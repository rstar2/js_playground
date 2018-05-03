// See https://www.savjee.be/2017/07/Writing-tiny-blockchain-in-JavaScript/

const Transaction = require('./Transaction.js');
const Block = require('./Block.js');
const Blockchain = require('./Blockchain.js');

let rumenCoin = new Blockchain();

rumenCoin.addBlock(new Block(Date.now(), [new Transaction("X", "Me", 50)]));
rumenCoin.addBlock(new Block(Date.now(), [new Transaction("Y", "X", 40),
new Transaction("Y", "Z", 20)]));

// test when not tempered
console.log('Is Blockchain valid ?', rumenCoin.isChainValid());
// Is Blockchain valid ? true

// try temper it - will not be valid any more
rumenCoin.chain[1].transactions[0].amount = 100
console.log('Is Blockchain valid ?', rumenCoin.isChainValid());
// // Is Blockchain valid ? false

// try temper it with recalculating the hash - the next block will brake
// e.g. in order to temper one block you have to temper all succeeding ones
// rumenCoin.chain[1].transactions[0].amount = 100
// rumenCoin.chain[1].hash = rumenCoin.chain[1].calculateHash();
// console.log('Is Blockchain valid ?', rumenCoin.isChainValid());
// Is Blockchain valid ? false
