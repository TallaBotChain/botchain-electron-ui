import BaseConnector from './BaseConnector'
import artifact from './abi/DeveloperRegistryDelegate.json'
import {remote} from 'electron';

export default class DeveloperRegistry extends BaseConnector {
  constructor() {
    super();
    this.contract = new this.web3.eth.Contract(artifact.abi, remote.getGlobal('config').developer_registry_contract);
  }

  getDeveloperId(address) {
    let contract = this.contract;
    return contract.methods.owns(address).call({from: this.account});
  }

  getDeveloperUrl(developerId) {
    let self = this;
    return new Promise((resolve,reject) => {
      self.contract.methods.developerUrl(developerId).call({from: self.account})
      .then((url) => resolve(self.web3.utils.hexToUtf8(url)))
      .catch(((err) => reject(err)))
    });
  }

  getDeveloperApproval(developerId) {
    let contract = this.contract;
    return contract.methods.approvalStatus(developerId).call({from: this.account});
  }
  
}
