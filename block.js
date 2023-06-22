import GENESIS_DATA from './config';
import cryptoHash from './crypto-hash';

class Block {
    constructor({ timestamp, lastHash, hash, data }) {
        this.timestamp = timestamp
        this.lastHash = lastHash
        this.hash = hash
        this.data = data
    }

    static genesis = () => {
        return new Block(GENESIS_DATA);
    }

    static mineBlock = ({data, lastBlock}) => {
        const timestamp = Date.now();
        return new Block({
            timestamp: timestamp,
            hash: cryptoHash(timestamp, lastBlock.hash, data),
            lastHash: lastBlock.hash,
            data: data,
        });
    }
}

export default Block;
