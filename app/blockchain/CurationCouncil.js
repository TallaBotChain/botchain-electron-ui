import KeyTools from './KeyTools'
import artifact from './abi/CurationCouncilRegistryDelegate.json'
import {remote} from 'electron';

export default class CurationCouncil {
  constructor() {
    this.web3 = KeyTools.web3;
    this.contract = new this.web3.eth.Contract(artifact.abi, remote.getGlobal('config').couration_council_contract);
    console.log("curation council: ", this.contract);
  }

  get account() {
    return this.web3.eth.accounts.wallet[0].address;
  }

  joinCouncil(stake) {
    // this.contract.methods.joinCouncil(stake)
  }

  leaveCouncil() {
    // this.contract.methids.leaveCouncil()
  }

  getRewardBalance() {
    return Promise.resolve(16.422222222);
  }

  getAvailableReward() {
    return Promise.resolve(1.2);
  }
}
