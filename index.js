import express from 'express';
import bodyParser from 'body-parser';
import Blockchain from './blockchain.js';
import PubSub from './pubsub.js';

const app = express();
const blockchain = new Blockchain();
const pubSub = new PubSub({ blockchain });

setTimeout(() => pubSub.broadcastChain(), 1000);
app.use(bodyParser.json());

app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
    const { data } = req.body;
    blockchain.addBlock({ data });
    this.pubSub.broadcastChain();
    res.redirect('/api/blocks');
});

const APP_PORT = 3000;
app.listen(APP_PORT, () => {
    console.log(`Server listening at PORT: ${APP_PORT}`);
});
