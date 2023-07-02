import Block from './block.js';
import { cryptoHash } from '../util/index.js';
import Transaction from '../wallet/transaction.js';
import { REWARD_INPUT, MINING_REWARD } from '../config.js';

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

    validTransactionData = ({ chain }) => {
        for (let i = 1; i < chain.length; ++i) {
            const block = chain[i];
            let rewardTransactionCount = 0;
            for (let transaction of block.data) {
                if (transaction.input.address === REWARD_INPUT.address) {
                    rewardTransactionCount += 1;

                    if (rewardTransactionCount > 1) {
                        console.error('Miner rewards exceeds limit');
                        return false;
                    }

                    if (
                        Object.values(transaction.outputMap)[0] !==
                        MINING_REWARD
                    ) {
                        console.error('Miner reward amount is invalid');
                        return false;
                    }
                } else {
                    if (!Transaction.validTransaction(transaction)) {
                        console.error('Invalid transaction');
                        return false;
                    }
                }
            }
        }
        return true;
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

    replaceChain = (chain, onSuccess) => {
        if (chain.length <= this.chain.length) {
            console.error('New chain should be longer.');
            return;
        }

        if (!Blockchain.isValidChain(chain)) {
            console.error('New chain should be valid.');
            return;
        }

        if (onSuccess) onSuccess();
        console.log('Replacing chain with ', chain);
        this.chain = chain;
    };
}

export default Blockchain;
