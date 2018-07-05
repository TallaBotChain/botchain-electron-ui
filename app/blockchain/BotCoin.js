import KeyTools from './KeyTools'
import artifact from './abi/BotCoin.json'

class BotCoin {
  constructor() {
    this.web3 = KeyTools.web3;
    //this.contract = new this.web3.eth.Contract(artifact.abi, window.app_config.botcoin_contract);
    this.decimals = 18;
    this.gasPrice = 100000000;
    //console.log("New instance of BotCoin connector with address ", window.app_config.botcoin_contract);
  }

  get account() {
    return this.web3.eth.accounts.wallet[0].address;
  }

  convertToHuman(bigNumber) {
    return bigNumber / (10**this.decimals);
  }

  approve(amount,to) {
    // TODO: estimate gas
    return new Promise((resolve,reject) => {
      this.contract.methods.approve(to,amount*10**this.decimals)
        .send({from: this.account,gas: 100000,gasPrice: this.gasPrice},
          function(err,tx_id) {
            if( ! err ) {
              console.log("approve tx_id:",tx_id);
              resolve(tx_id);
            }
          }).catch( (err) => {
            reject(err);
          });
    });
  }

  pay(amount,to) {
    let self = this;
    return this.web3.eth.getAccounts().then( (accounts) => {
      return new Promise(function(resolve,reject) {
        self.contract.methods.transfer(to,amount*10**self.decimals)
          .send({from: accounts[0]},
            function(err,tx_id) {
              if( ! err ) {
                console.log("transfer tx_id:",tx_id);
                resolve(tx_id);
              }
            }).catch( (err) => {
              reject(err);
            });

      });
    });
  }

  isTxMined(tx_id){
    return this.web3.eth.getTransaction(tx_id).then( (transaction) => {
      console.log("transaction: ",transaction)
      let result = (transaction && transaction.blockNumber) != null
      console.log("mined: ",result);
      return Promise.resolve(result);
    }).catch(error => {
      return Promise.reject();
    });
  }

  isTxSucceed(tx_id){
    return this.web3.eth.getTransactionReceipt(tx_id).then( (receipt) => {
      console.log("receipt: ",receipt)
      return Promise.resolve(receipt.status == 1);
    }).catch(error => {
      return Promise.reject();
    });
  }

  // @return Promise
  getTokenBalance() {
    let contract = this.contract;
    let address = this.web3.eth.accounts.wallet[0].address
    return contract.methods.balanceOf(address).call();
  }

  // @return Promise
  getBalance() {
    let address = this.web3.eth.accounts.wallet[0].address
    return this.web3.eth.getBalance(address)
  }

  transferTokens(to, amount) {
    let self = this;
    let fromAddress = this.web3.eth.accounts.wallet[0].address
    return self.contract.methods.transfer(to, amount).estimateGas({from: fromAddress}).then(function(gas) {
      return new Promise(function(resolve, reject) {
        self.contract.methods.transfer(to, amount)
        .send({gasPrice: self.gasPrice, from: fromAddress, gas: gas},
          function(err, tx_id) {
            if (!err) {
              console.log("transfer tx_id:", tx_id);
              resolve(tx_id);
            }
          }
        ).catch((err) => {
          reject(err);
        });
      });
    })
  }

  transferEther(to, amount) {
    let self = this;
    let fromAddress = this.account
    return self.web3.eth.estimateGas({from: fromAddress, to: to, value: self.web3.utils.toWei(amount.toString(), "ether")}).then(function(gas) {
      console.log("Gas = ", gas)
      return new Promise(function(resolve, reject) {
        self.web3.eth.sendTransaction({from: fromAddress, to: to, value: self.web3.utils.toWei(amount.toString(), "ether"), gas: gas},
          function(err, tx_id) {
            if (!err) {
              console.log("transfer tx_id:", tx_id);
              resolve(tx_id);
            }
          }
        ).catch((err) => {
          reject(err);
        });
      });
    })
  }

  transactionList() {
    //TODO fetch real data
    return [
      {tx_id: "0x3b986cd68e199aee022ab216526ba8a4c1c28b5a4221f15ce9ecdaeeac7beb5f", value: "0.05", direction: "IN"},
      {tx_id: "0x3b986cd68e199aee022ab216526ba8a4c1c28b5a4221f15ce9ecdaeeac7beb5f", value: "0.03", direction: "IN"},
      {tx_id: "0x3b986cd68e199aee022ab216526ba8a4c1c28b5a4221f15ce9ecdaeeac7beb5f", value: "0.05", direction: "OUT"},
      {tx_id: "0x3b986cd68e199aee022ab216526ba8a4c1c28b5a4221f15ce9ecdaeeac7beb5f", value: "0.01", direction: "OUT"},
    ]
  }
  
}


export default BotCoin;
