import express from 'express';
import bodyParser from 'body-parser';
import request from 'request';
import Blockchain from './blockchain.js';
import PubSub from './pubsub.js';
import TransactionPool from './wallet/transaction-pool.js';
import Wallet from './wallet/index.js';

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubSub = new PubSub({ blockchain });

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

app.use(bodyParser.json());

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
    const transaction = wallet.createTransaction({ recipient, amount });
    transactionPool.setTransaction(transaction);
    console.log('transactionPool', transactionPool);
    res.json({ transaction });
});

const syncChain = () => {
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
};

let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}
const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(`Server listening at PORT: ${PORT}`);

    if (PORT !== DEFAULT_PORT) {
        syncChain();
    }
});
