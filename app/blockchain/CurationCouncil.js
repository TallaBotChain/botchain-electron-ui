import KeyTools from './KeyTools'
import artifact from './abi/CurationCouncilRegistryDelegate.json'
import {remote} from 'electron';

export default class CurationCouncil {
  constructor() {
    this.web3 = KeyTools.web3;
    this.contract = new this.web3.eth.Contract(artifact.abi, window.app_config.couration_council_contract);
  }

  getRewardBalance() {
    return Promise.resolve(16.422222222);
  }

  getAvailableReward() {
    return Promise.resolve(1.2);
  }
}
