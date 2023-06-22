import Blockchain from './blockchain';
import Block from './block';

describe('Blockchain', () => {
    let blockchain, newChain, originalChain;

    beforeEach(() => {
        blockchain = new Blockchain();
        newChain = new Blockchain();
        originalChain = new Blockchain();
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
        expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData);
    });

    describe('isValidChain()', () => {
        describe('when chain does not start with the genesis block', () => {
            it('returns false', () => {
                blockchain.chain[0] = {data: 'Invalid/Fake Genesis Block'};
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });

            describe('when chain starts with the genesis block and has multiple blocks', () => {
                beforeEach(() => {
                    blockchain.addBlock({data: 'First Actual Block'});
                    blockchain.addBlock({data: 'Second Actual Block'});
                    blockchain.addBlock({data: 'Third Actual Block'});
                });

                describe('and a lastHash reference has changed', () => {
                    it('returns false', () => {
                        blockchain.chain[2].lastHash = 'broken-lastHash';

                        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                    });
                });

                describe('and a chain contains a block with invalid fields', () =>{
                    it('returns false', () => {
                        blockchain.chain[2].data = 'bad data';

                        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                    });
                });

                describe('and the chain does not contains any invalid block', () => {
                    it('returns true', () => {
                        expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                    });
                });
            });
        });
    });

    describe('replaceChain()', () => {
        let errorMock, logMock;

        beforeEach(() => {
            errorMock = jest.fn();
            logMock = jest.fn();
            
            global.console.error = errorMock;
            global.console.log = logMock;
        });

        describe('when the new chain is not longer', () => {
            beforeEach(() => {
                newChain.chain[0] = {new: 'chain'}
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
                    newChain.chain[2].hash = 'fakeHash'
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
    });
});
