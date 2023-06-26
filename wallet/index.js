import { ec } from '../util';
import { STARTING_BALANCE } from '../config';

class Wallet {
    constructor() {
        this.balance = STARTING_BALANCE;

        const keyPair = ec.genKeyPair();

        this.publicKey = keyPair.getPublic().encode('hex');
    }
}

export default Wallet;
