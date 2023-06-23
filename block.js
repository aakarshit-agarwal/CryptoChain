import { GENESIS_DATA, MINE_RATE } from './config';
import cryptoHash from './crypto-hash';

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
        const difficulty = lastBlock.difficulty;
        let nonce = lastBlock.nonce;

        do {
            ++nonce;
            timestamp = Date.now();
            hash = cryptoHash(
                timestamp,
                lastBlock.hash,
                difficulty,
                nonce,
                data
            );
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

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
        const difference = timestamp - originalBlock.timestamp;
        if (difference > MINE_RATE) return difficulty - 1;
        return difficulty + 1;
    };
}

export default Block;
