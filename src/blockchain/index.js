// example runner
const Blockchain = require('./Blockchain');
const Transaction = require('./Transaction');
const Wallet = require('./Wallet');

const bitCoin = new Blockchain(1);

const rumen = new Wallet();
const kasia = new Wallet();

const rumenAddress = rumen.getAddress();
const kasiaAddress = kasia.getAddress();

const transaction = new Transaction(rumenAddress, kasiaAddress, 1000);
transaction.sign(rumen);
bitCoin.addTransaction(transaction);

bitCoin.minePendingTransactions(rumen);