import { ec } from '../util';
import { STARTING_BALANCE } from '../config';
import { cryptoHash } from '../util';

class Wallet {
    constructor() {
        this.balance = STARTING_BALANCE;

        this.keyPair = ec.genKeyPair();

        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    sign(data) {
        return this.keyPair.sign(cryptoHash(data));
    }
}

export default Wallet;
