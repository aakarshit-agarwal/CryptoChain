import Block from './block';
import cryptoHash from './crypto-hash';

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock = ({ data }) => {
        const newBlock = Block.mineBlock({
            data: data,
            lastBlock: this.chain[this.chain.length - 1]
        });
        this.chain.push(newBlock);
    }

    static isValidChain = (chain) => {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }

        for (let i = 1; i < chain.length; i++) {
            let actualLastHash = chain[i-1].hash;
            let { timestamp, lastHash, hash, data } = chain[i];
            if (lastHash !== actualLastHash) {
                return false;
            }
            if(hash !== cryptoHash(timestamp, lastHash, data)){
                return false;
            }
        }
        return true;
    }
}

export default Blockchain;
