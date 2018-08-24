import BaseConnector from './BaseConnector'
import artifact from './abi/BotCoin.json'
import {remote} from 'electron';

class BotCoin extends BaseConnector{
  constructor() {
    super();
    this.contract = new this.web3.eth.Contract(artifact.abi, remote.getGlobal('config').botcoin_contract);
    this.decimals = 18;
    this.gasPrice = 100000000;
    //console.log("New instance of BotCoin connector with address ", window.app_config.botcoin_contract);
  }

  toWei(amount) {
    return this.web3.utils.toWei(amount);
  }

  convertToHuman(bigNumber) {
    return this.web3.utils.fromWei(bigNumber);
  }

  approveEstGas(amount, to) {
    return this.contract.methods.approve(to, this.toWei(amount) ).estimateGas({from: this.account})
  }

  approve(amount,to) {
    return this.contract.methods.approve(to, this.toWei(amount) ).estimateGas({from: this.account}).then((gas) => {
      return new Promise((resolve,reject) => {
        this.contract.methods.approve(to, this.toWei(amount) )
        .send({from: this.account, gas: gas, gasPrice: this.gasPrice},
          function(err,tx_id) {
            if( ! err ) {
              console.log("approve tx_id:",tx_id);
              resolve(tx_id);
            }
          }).catch( (err) => {
            reject(err);
          });
        });
    });
  }

  pay(amount,to) {
    let self = this;
    return this.web3.eth.getAccounts().then( (accounts) => {
      return new Promise(function(resolve,reject) {
        self.contract.methods.transfer(to, this.toWei(amount) )
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
      return Promise.resolve(receipt.status == 1, receipt);
    }).catch(error => {
      return Promise.reject();
    });
  }

  getTxReceipt(tx_id){
    return this.web3.eth.getTransactionReceipt(tx_id)
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

  transferTokensEstGas(to, amount) {
    return this.contract.methods.transfer(to, this.web3.utils.toWei(amount.toString(), "ether")).estimateGas({from: this.account})
  }

  transferTokens(to, amount) {
    return this.contract.methods.transfer(to, this.web3.utils.toWei(amount.toString(), "ether")).estimateGas({from: this.account}).then((gas) => {
      return new Promise((resolve, reject) => {
        this.contract.methods.transfer(to, this.web3.utils.toWei(amount.toString(), "ether"))
        .send({gasPrice: self.gasPrice, from: this.account, gas: gas},
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

  transferEtherEstGas(to, amount) {
    return this.web3.eth.estimateGas({from: this.account, to: to, value: this.web3.utils.toWei(amount.toString(), "ether")})
  }

  transferEther(to, amount) {
    return this.web3.eth.estimateGas({from: this.account, to: to, value: this.web3.utils.toWei(amount.toString(), "ether")}).then((gas) => {
      return new Promise((resolve, reject) => {
        this.web3.eth.sendTransaction({from: this.account, to: to, value: this.web3.utils.toWei(amount.toString(), "ether"), gas: gas},
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

}


export default BotCoin;
