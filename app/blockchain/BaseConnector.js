import KeyTools from './KeyTools'

export default class BaseConnector {
  constructor() {
    this.web3 = KeyTools.web3;
  }

  get account() {
    return this.web3.eth.accounts.wallet[0].address;
  }
}
