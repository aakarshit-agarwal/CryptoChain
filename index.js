import express from 'express';
import Blockchain from './blockchain.js';

const app = express();
const blockchain = new Blockchain();

app.get('/api/block', (req, res) => {
    res.json(blockchain.chain);
});

const APP_PORT = 3000;
app.listen(APP_PORT, () => {
    console.log(`Server listening at PORT: ${APP_PORT}`);
});
