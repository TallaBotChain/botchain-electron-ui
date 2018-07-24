import KeyTools from './KeyTools'

export default class BaseConnector {
  constructor() {
    this.web3 = KeyTools.web3;
    this.decimals = 18;
    this.gasPrice = 10*10**9; // TODO: move this to settings
  }

  get account() {
    return this.web3.eth.accounts.wallet[0].address;
  }
}
