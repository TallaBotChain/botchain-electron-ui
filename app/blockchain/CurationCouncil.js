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

  getAvailableReward() {
    // TODO: deprictate it
    return Promise.resolve(1.2);
  }
}
