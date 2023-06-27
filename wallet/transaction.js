import { v1 as uuid } from 'uuid';

class Transaction {
    constructor({ senderWallet, recipient, amount }) {
        this.id = uuid();
        this.outputMap = this.createOutputMap({
            senderWallet,
            recipient,
            amount,
        });
    }

    createOutputMap = ({ senderWallet, recipient, amount }) => {
        const outputMap = {};

        outputMap[recipient] = amount;
        outputMap[senderWallet.publicKey] = senderWallet.balance - amount;

        return outputMap;
    };
}

export default Transaction;
