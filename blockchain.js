import Block from './block';

class Blockchain{
    constructor(){
        this.chain = [Block.genesis()];
    }

    addBlock = ({data}) => {
        const newBlock = Block.mineBlock({
            data: data,
            lastBlock: this.chain[this.chain.length-1]
        });
        this.chain.push(newBlock);
    }
}

export default Blockchain;
