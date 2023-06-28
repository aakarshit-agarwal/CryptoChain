import TransactionPool from './transaction-pool';
import Transaction from './transaction';
import Wallet from '.';

describe('TransactionPool', () => {
    let transactionPool, transaction;

    beforeEach(() => {
        transactionPool = new TransactionPool();
        transaction = new Transaction({
            senderWallet: new Wallet(),
            recipient: 'fake-recipient',
            amount: 50,
        });
    });

    describe('setTransaction()', () => {
        it('adds a transaction', () => {
            transactionPool.setTransaction(transaction);

            expect(transactionPool.transactionMap[transaction.id]).toBe(
                transaction
            );
        });
    });
});
