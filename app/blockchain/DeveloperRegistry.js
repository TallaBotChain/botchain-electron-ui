import BaseConnector from './BaseConnector'
import artifact from './abi/DeveloperRegistryDelegate.json'
import {remote} from 'electron';
import multihashes from 'multihashes';

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
      self.contract.methods.developerIpfs(developerId).call({from: self.account})
        .then((ipfs) => {
          let digest = Buffer.from(ipfs.digest.substring(2), 'hex');
          let metadataMultihash = multihashes.encode( digest, parseInt(ipfs.fnCode), parseInt(ipfs.size) );
          let metadataUrl = multihashes.toB58String(metadataMultihash);
          let url = remote.getGlobal('config').ipfs_gateway_url + metadataUrl;
          return resolve(url);
        })
      .catch(((err) => reject(err)))
    });
  }

  getDeveloperApproval(developerId) {
    let contract = this.contract;
    return contract.methods.approvalStatus(developerId).call({from: this.account});
  }
}
