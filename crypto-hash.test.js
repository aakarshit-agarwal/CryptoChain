import cryptoHash from './crypto-hash';

describe('cryptoHash()', () => {
    it('generates a SHA-256 hashed output', () => {
        expect(cryptoHash('Test Data')).toEqual('bcfe67172a6f4079d69fe2f27a9960f9d62edae2fcd4bb5a606c2ebb74b3ba65');
    });

    it('generates the same hash with same input arguments in any order', () => {
        expect(cryptoHash('one', 'two', 'three')).toEqual(cryptoHash('three', 'two', 'one'));
    });
});