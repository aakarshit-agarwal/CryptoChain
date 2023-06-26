import Wallet from './wallet.js';

describe('Wallet', () => {
    let wallet;

    beforeWallet(() => {
        wallet = new Wallet();
    });

    it('has a balance', () => {
        expect(wallet).toHaveProperty('balance');
    });

    it('has a publicKey', () => {
        expect(wallet).toHaveProperty('publicKey');
    });
});
