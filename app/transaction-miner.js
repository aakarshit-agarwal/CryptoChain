import Transaction from '../wallet/transaction.js';

class TransactionMiner {
    constructor({ blockchain, transactionPool, wallet, pubSub }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.pubSub = pubSub;
    }

    mineTransactions = () => {
        const validTransactions = this.transactionPool.validTransactions();
        validTransactions.push(
            Transaction.rewardTransaction({ minerWallet: this.wallet })
        );
        this.blockchain.addBlock({ data: validTransactions });
        this.pubSub.broadcastChain();
        this.transactionPool.clear();
    };
}

export default TransactionMiner;
