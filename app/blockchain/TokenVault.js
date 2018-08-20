import BaseConnector from './BaseConnector'
import artifact from './abi/TokenVaultDelegate.json'
import {remote} from 'electron';

export default class TokenVault extends BaseConnector {
  constructor() {
    super();
    this.contract = new this.web3.eth.Contract(artifact.abi, remote.getGlobal('config').token_vault_contract);
    console.log("token vault: ", this.contract);
  }

  getRewardBalance() {
    return this.contract.methods.balance().call({from: this.account});
  }

  curatorRewardRate() {
    return this.contract.methods.curatorRewardRate().call({from: this.account});
  }

  collectCuratorRewardEstGas() {
    return this.contract.methods.collectCuratorReward().estimateGas({from: this.account})
  }

  collectCuratorReward() {
    return new Promise((resolve, reject) => {
      return this.contract.methods.collectCuratorReward().estimateGas({from: this.account}).then((gas) => {
        return this.contract.methods.collectCuratorReward()
          .send({from: this.account, gas: gas, gasPrice: this.gasPrice},
            (err, tx_id) => {
              if (!err) {
                console.log("transfer tx_id:", tx_id);
                resolve(tx_id);
              }
            })
          .catch(reject);
      });
    });
  }
}
