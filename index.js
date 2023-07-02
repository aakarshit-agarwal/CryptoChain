import express from 'express';
import bodyParser from 'body-parser';
import request from 'request';
import path from 'path';
import { fileURLToPath } from 'url';
import Blockchain from './blockchain/index.js';
import PubSub from './app/pubsub.js';
import TransactionPool from './wallet/transaction-pool.js';
import Wallet from './wallet/index.js';
import TransactionMiner from './app/transaction-miner.js';

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubSub = new PubSub({ blockchain, transactionPool, wallet });
const transactionMiner = new TransactionMiner({
    blockchain,
    transactionPool,
    wallet,
    pubSub,
});

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

app.use(bodyParser.json());
app.use(express.static(path.join(CURRENT_DIR, 'client/dist')));

app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
    const { data } = req.body;
    blockchain.addBlock({ data });
    pubSub.broadcastChain();
    res.redirect('/api/blocks');
});

app.post('/api/transact', (req, res) => {
    const { amount, recipient } = req.body;
    let transaction = transactionPool.existingTransaction({
        inputAddress: wallet.publicKey,
    });
    try {
        if (transaction) {
            transaction.update({ senderWallet: wallet, recipient, amount });
        } else {
            transaction = wallet.createTransaction({
                recipient,
                amount,
                chain: blockchain.chain,
            });
        }
    } catch (error) {
        return res.status(400).json({ type: 'error', message: error.message });
    }
    transactionPool.setTransaction(transaction);
    pubSub.broadcastTransaction(transaction);
    res.json({ type: 'success', transaction });
});

app.get('/api/transaction-pool-map', (req, res) => {
    res.json(transactionPool.transactionMap);
});

app.get('/api/mine-transaction', (req, res) => {
    transactionMiner.mineTransaction();
    res.redirect('/api/blocks');
});

app.get('api/wallet-info', (req, res) => {
    const address = wallet.publicKey;

    res.json({
        address,
        balance: Wallet.calculateBalance({ chain: blockchain.chain, address }),
    });
});

app.get('*', (req, res) => {
    const fileLocation = path.join(CURRENT_DIR, 'client/dist/index.html');
    res.sendFile(fileLocation);
});

const syncWithRootState = () => {
    request(
        { url: `${ROOT_NODE_ADDRESS}/api/blocks` },
        (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const rootChain = JSON.parse(body);

                console.log('replace chain on a sync with', rootChain);
                blockchain.replaceChain(rootChain);
            }
        }
    );

    request(
        { url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map` },
        (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const transactionPoolMap = JSON.parse(body);

                console.log(
                    'replace transaction pool map on a sync with',
                    transactionPoolMap
                );
                transactionPool.setMap(transactionPoolMap);
            }
        }
    );
};

let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}
const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(`Server listening at PORT: ${PORT}`);

    if (PORT !== DEFAULT_PORT) {
        syncWithRootState();
    }
});
