import BaseConnector from './BaseConnector'
import artifact from './abi/TokenVaultDelegate.json'
import {remote} from 'electron';

export default class TokenVault extends BaseConnector {
  constructor() {
    super();
    this.contract = new this.web3.eth.Contract(artifact.abi, remote.getGlobal('config').couration_council_contract);
    console.log("token vault: ", this.contract);
  }

  getRewardBalance() {
    return this.contract.methods.balance().call({from: this.account});
  }
}
