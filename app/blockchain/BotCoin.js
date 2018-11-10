import BaseConnector from './BaseConnector'
import artifact from './abi/BotCoin.json'
import {remote} from 'electron';

class BotCoin extends BaseConnector{
  constructor() {
    super();
    this.contract = new this.web3.eth.Contract(artifact.abi, remote.getGlobal('config').botcoin_contract);
    this.decimals = 18;
    this.gasPrice = 100000000;
  }

  /** Converts amount of ETH or ERC20 to Wei
   * @param amount - amount of ether/tokens as floating point number
   **/
  toWei(amount) {
    return this.web3.utils.toWei(amount);
  }

  /** Converts from wei to float point amount of ETH or ERC20 tokens
   * @param bigNumber - value in Wei
   **/
  convertToHuman(bigNumber) {
    return this.web3.utils.fromWei(bigNumber);
  }

  /** Estimates gas to ERC20 approve call
   * @param amount - amount of tokens to transfer (float)
   * @param to - address to send tokens to
   **/
  approveEstGas(amount, to) {
    return this.contract.methods.approve(to, this.toWei(amount) ).estimateGas({from: this.account})
  }

  /** Sends approve method call to blockchain
   * @param amount - amount of tokens to transfer (float)
   * @param to - address to send tokens to
   **/
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

  /** Sends transfer method call to blockchain
   * @param amount - amount of tokens to transfer (float)
   * @param to - address to send tokens to
   **/
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

  /** Checks if transaction is mined
   * @param tx_id - transaction hash
   * @returns {Promise}
   **/
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

  /** Checks if transaction is was successful
   * @param tx_id - transaction hash
   * @returns {Promise}
   **/
  isTxSucceed(tx_id){
    return this.web3.eth.getTransactionReceipt(tx_id).then( (receipt) => {
      console.log("receipt: ",receipt)
      return Promise.resolve(receipt.status == 1, receipt);
    }).catch(error => {
      return Promise.reject();
    });
  }

  /** Gets transaction receipt from blockchain
   * @param tx_id - transaction hash
   **/
  getTxReceipt(tx_id){
    return this.web3.eth.getTransactionReceipt(tx_id)
  }

  /** Gets token balance for current account
   * @return Promise
   **/
  getTokenBalance() {
    let contract = this.contract;
    let address = this.web3.eth.accounts.wallet[0].address
    return contract.methods.balanceOf(address).call();
  }

  /** Gets Ether balance for current account
   * @return Promise
   **/
  getBalance() {
    let address = this.web3.eth.accounts.wallet[0].address
    return this.web3.eth.getBalance(address)
  }

  /** Estimates token transfer gas
   * @param amount - amount of tokens to transfer (float)
   * @param to - address to send tokens to
   **/
  transferTokensEstGas(to, amount) {
    return this.contract.methods.transfer(to, this.web3.utils.toWei(amount.toString(), "ether")).estimateGas({from: this.account})
  }

  /** Transfers ERC20 tokens
   * @param amount - amount of tokens to transfer (float)
   * @param to - address to send tokens to
   **/
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

  /** Estimates Ether transfer gas
   * @param amount - amount of Ether to transfer (float)
   * @param to - address to send ETH to
   **/
  transferEtherEstGas(to, amount) {
    return this.web3.eth.estimateGas({from: this.account, to: to, value: this.web3.utils.toWei(amount.toString(), "ether")})
  }

  /** Performs Ether transfer
   * @param amount - amount of Ether to transfer (float)
   * @param to - address to send ETH to
   **/
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
