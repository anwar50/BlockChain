const SHA257 = require('crypto-js/sha256');
class Block {
        //when we create a block we pass these parameters
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index
        this.timestamp = timestamp
        this.data = data;
        this.previousHash = previousHash;
            //the hash is calculated from out block
        this.hash = this.calculateHash();
    }
    calculateHash(){
        return SHA257(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
    
}
class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }
    createGenesisBlock(){
        return new Block(0, "01/01/2019", "Genesis block", "0")
    }
    getLastestBlock(){
        return this.chain[this.chain.length -1];
    }
    addBlock(newBlock)
    {
        newBlock.previousHash = this.getLastestBlock().hash;
            //hash is updated
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
    //verify integrity
    isChainValid(){
        for(let i = 1; i < this.chain.length; i++)
        {
            const currentBlock = this.chain[i];
            const previousChain = this.chain[i-1];
            if(currentBlock.hash !== currentBlock.calculateHash())
            {
                return false;
            }
            if(currentBlock.previousHash !== previousChain.hash)
            {
                return false;
            }
            else{
                return true;
            }
        }
    }
}
//instance of block chain
let coin = new Blockchain();
coin.addBlock(new Block(1, "10/07/2019", {amount: 4}));
coin.addBlock(new Block(2, "12/07/2019", {amount: 10}));

//console.log(JSON.stringify(coin,null, 4));
console.log("Is the blockchain valid?: " + coin.isChainValid());
   //TAMPER WITH THE BLOCK #1 //changing the amount to experiment fraud detection.
coin.chain[1].data = { amount: 1000 };
   //TAMPER WITH THE BLOCK #2 //recomputate the hash i.e. recalculate the hash
coin.chain[1].hash = coin.chain[1].calculateHash(); 
console.log("Is the blockchain valid?: " + coin.isChainValid());