import Blockchain from '.';
import Block from './block';
import { cryptoHash } from '../util';
import Wallet from '../wallet';
import Transaction from '../wallet/transaction';

describe('Blockchain', () => {
    let blockchain, newChain, originalChain, errorMock;

    beforeEach(() => {
        blockchain = new Blockchain();
        newChain = new Blockchain();
        originalChain = new Blockchain();
        errorMock = jest.fn();
        global.console.error = errorMock;
    });

    it('contains a `chain` Array instance', () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it('starts with genesis block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block to the chain', () => {
        const newData = 'New Test Data';
        blockchain.addBlock({ data: newData });
        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(
            newData
        );
    });

    describe('isValidChain()', () => {
        describe('when chain does not start with the genesis block', () => {
            it('returns false', () => {
                blockchain.chain[0] = { data: 'Invalid/Fake Genesis Block' };
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });

            describe('when chain starts with the genesis block and has multiple blocks', () => {
                beforeEach(() => {
                    blockchain.addBlock({ data: 'First Actual Block' });
                    blockchain.addBlock({ data: 'Second Actual Block' });
                    blockchain.addBlock({ data: 'Third Actual Block' });
                });

                describe('and a lastHash reference has changed', () => {
                    it('returns false', () => {
                        blockchain.chain[2].lastHash = 'broken-lastHash';

                        expect(Blockchain.isValidChain(blockchain.chain)).toBe(
                            false
                        );
                    });
                });

                describe('and a chain contains a block with invalid fields', () => {
                    it('returns false', () => {
                        blockchain.chain[2].data = 'bad data';

                        expect(Blockchain.isValidChain(blockchain.chain)).toBe(
                            false
                        );
                    });
                });

                describe('and the chain does not contains any invalid block', () => {
                    it('returns true', () => {
                        expect(Blockchain.isValidChain(blockchain.chain)).toBe(
                            true
                        );
                    });
                });
            });
        });

        describe('and the chain contains a block with a jumped difficulty', () => {
            it('returns false', () => {
                const lastBlock = blockchain.chain[blockchain.chain.length - 1];
                const lastHash = lastBlock.hash;
                const timestamp = Date.now();
                const nonce = 0;
                const data = [];
                const difficulty = lastBlock.difficulty - 3;

                const hash = cryptoHash(
                    timestamp,
                    lastHash,
                    difficulty,
                    nonce,
                    data
                );

                const badBlock = new Block({
                    timestamp,
                    lastHash,
                    hash,
                    nonce,
                    difficulty,
                    data,
                });

                blockchain.chain.push(badBlock);

                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });
    });

    describe('replaceChain()', () => {
        let logMock;

        beforeEach(() => {
            logMock = jest.fn();

            global.console.log = logMock;
        });

        describe('when the new chain is not longer', () => {
            beforeEach(() => {
                newChain.chain[0] = { new: 'chain' };
                blockchain.replaceChain(newChain.chain);
            });

            it('does not replace the chain', () => {
                expect(blockchain.chain).toEqual(originalChain.chain);
            });

            it('logs an error', () => {
                expect(errorMock).toHaveBeenCalled();
            });
        });
        describe('when the new chain is longer', () => {
            beforeEach(() => {
                newChain.addBlock({ data: 'New First Block' });
                newChain.addBlock({ data: 'New Second Block' });
                newChain.addBlock({ data: 'New Third Block' });
            });

            describe('and the chain is invalid', () => {
                beforeEach(() => {
                    newChain.chain[2].hash = 'fakeHash';
                    blockchain.replaceChain(newChain.chain);
                });

                it('does not replace the chain', () => {
                    expect(blockchain.chain).toEqual(originalChain.chain);
                });

                it('logs an error', () => {
                    expect(errorMock).toHaveBeenCalled();
                });
            });

            describe('and the chain is valid', () => {
                beforeEach(() => {
                    blockchain.replaceChain(newChain.chain);
                });

                it('replaces the chain', () => {
                    expect(blockchain.chain).toEqual(newChain.chain);
                });

                it('logs new chain', () => {
                    expect(logMock).toHaveBeenCalled();
                });
            });
        });

        describe('and the `validateTransactions` flag is true', () => {
            it('calls validateTransactionData()', () => {
                const validateTransactionDataMock = jest.fn();

                blockchain.validTransactionData = validateTransactionDataMock;

                newChain.addBlock({ data: 'foo' });
                blockchain.replaceChain(newChain.chain, true);

                expect(validateTransactionDataMock).toHaveBeenCalled();
            });
        });
    });

    describe('validTransactionData()', () => {
        let transaction, rewardTransaction, wallet;

        beforeEach(() => {
            wallet = new Wallet();
            transaction = wallet.createTransaction({
                recipient: 'foo-address',
                amount: 65,
            });
            rewardTransaction = Transaction.rewardTransaction({
                minerWallet: wallet,
            });
        });

        describe('and the transaction data is valid', () => {
            it('returns true', () => {
                newChain.addBlock({ data: [transaction, rewardTransaction] });

                expect(
                    blockchain.validTransactionData({ chain: newChain.chain })
                ).toBe(true);
                expect(errorMock).not.toHaveBeenCalled();
            });
        });

        describe('and the transaction data has multiple rewards', () => {
            it('returns false and logs an error', () => {
                newChain.addBlock({
                    data: [transaction, rewardTransaction, rewardTransaction],
                });

                expect(
                    blockchain.validTransactionData({ chain: newChain.chain })
                ).toBe(false);
                expect(errorMock).toHaveBeenCalled();
            });
        });

        describe('and the transaction data has at least one malformed outputMap', () => {
            describe('and the transaction is not a reward transaction', () => {
                it('returns false and logs an error', () => {
                    transaction.outputMap[wallet.publicKey] = 999999;

                    newChain.addBlock({
                        data: [transaction, rewardTransaction],
                    });

                    expect(
                        blockchain.validTransactionData({
                            chain: newChain.chain,
                        })
                    ).toBe(false);
                    expect(errorMock).toHaveBeenCalled();
                });
            });

            describe('and the transaction is a reward transaciton', () => {
                it('returns false and logs an error', () => {
                    rewardTransaction.outputMap[wallet.publicKey] = 999999;

                    newChain.addBlock({
                        data: [transaction, rewardTransaction],
                    });

                    expect(
                        blockchain.validTransactionData({
                            chain: newChain.chain,
                        })
                    ).toBe(false);
                    expect(errorMock).toHaveBeenCalled();
                });
            });
        });

        describe('and the transaction data has at least one malformed input', () => {
            it('returns false and logs an error', () => {
                wallet.balance = 9000;

                const evilOutputMap = {
                    [wallet.publicKey]: 8900,
                    fooRecipient: 100,
                };

                const evilTransaction = {
                    input: {
                        timestamp: Date.now(),
                        amount: wallet.balance,
                        address: wallet.publicKey,
                        signature: wallet.sign(evilOutputMap),
                    },
                    outputMap: evilOutputMap,
                };

                newChain.addBlock({
                    data: [evilTransaction, rewardTransaction],
                });
                expect(
                    blockchain.validTransactionData({ chain: newChain.chain })
                ).toBe(false);
                expect(errorMock).toHaveBeenCalled();
            });
        });

        describe('and a block contains multiple identical transactions', () => {
            it('returns false and logs an error', () => {
                newChain.addBlock({
                    data: [
                        transaction,
                        transaction,
                        transaction,
                        rewardTransaction,
                    ],
                });

                expect(
                    blockchain.validTransactionData({ chain: newChain.chain })
                ).toBe(false);
                expect(errorMock).toHaveBeenCalled();
            });
        });
    });
});
