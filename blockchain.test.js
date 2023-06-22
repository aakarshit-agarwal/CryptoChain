import Blockchain from './blockchain';
import Block from './block';

describe('Blockchain', () => {
    let blockchain;

    beforeEach(() => {
        blockchain = new Blockchain();
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
});
