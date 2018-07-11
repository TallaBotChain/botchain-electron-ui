import BaseConnector from './BaseConnector'
import artifact from './abi/CurationCouncilRegistryDelegate.json'
import {remote} from 'electron';

export default class CurationCouncil extends BaseConnector {
  constructor() {
    super();
    this.contract = new this.web3.eth.Contract(artifact.abi, remote.getGlobal('config').couration_council_contract);
    console.log("curation council: ", this.contract);
  }

  joinCouncil(stake) {
    // this.contract.methods.joinCouncil(stake)
  }

  leaveCouncil() {
    // this.contract.methids.leaveCouncil()
  }

  getAvailableReward() {
    // TODO: deprictate it
    return Promise.resolve(1.2);
  }
}
