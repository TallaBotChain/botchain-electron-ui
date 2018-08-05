import BaseConnector from './BaseConnector'
import artifact from './abi/CurationCouncilRegistryDelegate.json'
import {remote} from 'electron';

export default class CurationCouncil extends BaseConnector {
  constructor() {
    super();
    this.contract = new this.web3.eth.Contract(artifact.abi, remote.getGlobal('config').couration_council_contract);
  }

  joinCouncil(stake) {
    let self = this;
    let fromAddress = this.account
    return self.contract.methods.joinCouncil(self.web3.utils.toWei(stake.toString(), "ether")).estimateGas({from: fromAddress}).then(function(gas) {
      return new Promise(function(resolve, reject) {
        self.contract.methods.joinCouncil(self.web3.utils.toWei(stake.toString(), "ether"))
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

  leaveCouncil() {
    let self = this;
    let fromAddress = this.account
    return self.contract.methods.leaveCouncil().estimateGas({from: fromAddress}).then(function(gas) {
      return new Promise(function(resolve, reject) {
        self.contract.methods.leaveCouncil()
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

  getStakedBalance() {
    return this.contract.methods.getStakeAmount(this.account).call({from: this.account});
  }

  getTotalSupply() {
    return this.contract.methods.totalSupply().call({from: this.account});
  }

  ownerOf(idx) {
    return this.contract.methods.ownerOf(idx).call({from: this.account});
  }

  getLastBlock() {
    return this.web3.eth.getBlock('latest');
  }

  getVoteFinalBlock(idx) {
    return this.contract.methods.getVoteFinalBlock(idx).call({from: this.account});
  }

  getVoteInitialBlock(idx) {
    return this.contract.methods.getVoteInitialBlock(idx).call({from: this.account});
  }

  getVotedOnStatus(idx) {
    return this.contract.methods.getVotedOnStatus(idx, this.account).call({from: this.account});
  }

  castRegistrationVote(idx, vote) {
    //return Promise.resolve("0x0d983b3cf4d19dd2c7e1d038f2c4d0cc993435630b27c167a0517ecf0f5fc7be"); // for testing
    return this.contract.methods.castRegistrationVote(idx, vote).estimateGas({from: this.account}).then( (gas) => {
      return new Promise( (resolve, reject) => {
        console.log("castRegistrationVote ",idx,vote);
        this.contract.methods.castRegistrationVote(idx, vote)
          .send({gasPrice: this.gasPrice, from: this.account, gas: gas},
            (err, tx_id) => {
              if (!err) {
                console.log("cast vote tx_id:", tx_id);
                resolve(tx_id);
              }
            }
          ).catch((err) => {
            reject(err);
          });
      });
    });
  }
}
