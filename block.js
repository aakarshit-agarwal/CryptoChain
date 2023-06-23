import hexToBinary from 'hex-to-binary';
import { GENESIS_DATA, MINE_RATE } from './config.js';
import cryptoHash from './crypto-hash.js';

class Block {
    constructor({ timestamp, lastHash, hash, data, difficulty, nonce }) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.difficulty = difficulty;
        this.nonce = nonce;
    }

    static genesis = () => {
        return new Block(GENESIS_DATA);
    };

    static mineBlock = ({ data, lastBlock }) => {
        let timestamp, hash;
        let { difficulty } = lastBlock;
        let nonce = lastBlock.nonce;

        do {
            ++nonce;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({
                originalBlock: lastBlock,
                timestamp: timestamp,
            });
            hash = cryptoHash(
                timestamp,
                lastBlock.hash,
                difficulty,
                nonce,
                data
            );
        } while (
            hexToBinary(hash).substring(0, difficulty) !==
            '0'.repeat(difficulty)
        );

        return new Block({
            timestamp: timestamp,
            hash: hash,
            lastHash: lastBlock.hash,
            data: data,
            difficulty: difficulty,
            nonce: nonce,
        });
    };

    static adjustDifficulty = ({ originalBlock, timestamp }) => {
        const { difficulty } = originalBlock;
        if (difficulty < 1) return 1;
        const difference = timestamp - originalBlock.timestamp;
        if (difference > MINE_RATE) return difficulty - 1;
        return difficulty + 1;
    };
}

export default Block;
