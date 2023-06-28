import { cryptoHash } from '.';

describe('cryptoHash()', () => {
    it('generates a SHA-256 hashed output', () => {
        expect(cryptoHash('Test Data')).toEqual(
            '22af2cfb05e1805bc3b2ee1d4a1dc0e609a0aa042cd1c164205857d607b4952f'
        );
    });

    it('generates the same hash with same input arguments in any order', () => {
        expect(cryptoHash('one', 'two', 'three')).toEqual(
            cryptoHash('three', 'two', 'one')
        );
    });

    it('produces a unique hash when the properties have changed on an input', () => {
        const foo = {};
        const originalHash = cryptoHash(foo);
        foo['a'] = 'a';

        expect(cryptoHash(foo)).not.toEqual(originalHash);
    });
});
