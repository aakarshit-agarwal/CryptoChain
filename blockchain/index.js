import Block from './block.js';
import { cryptoHash } from '../util/index.js';

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock = ({ data }) => {
        const newBlock = Block.mineBlock({
            data: data,
            lastBlock: this.chain[this.chain.length - 1],
        });
        this.chain.push(newBlock);
    };

    static isValidChain = (chain) => {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }

        for (let i = 1; i < chain.length; i++) {
            let lastBlockHash = chain[i - 1].hash;
            let lastBlockDifficulty = chain[i - 1].difficulty;
            let { timestamp, lastHash, hash, data, difficulty, nonce } =
                chain[i];
            if (lastHash !== lastBlockHash) {
                return false;
            }
            let calculatedCurrentBlockHash = cryptoHash(
                timestamp,
                lastHash,
                data,
                difficulty,
                nonce
            );
            if (hash !== calculatedCurrentBlockHash) {
                return false;
            }
            if (Math.abs(difficulty - lastBlockDifficulty) > 1) return false;
        }
        return true;
    };

    replaceChain = (chain) => {
        if (chain.length <= this.chain.length) {
            console.error('New chain should be longer.');
            return;
        }

        if (!Blockchain.isValidChain(chain)) {
            console.error('New chain should be valid.');
            return;
        }

        console.log('Replacing chain with ', chain);
        this.chain = chain;
    };
}

export default Blockchain;
