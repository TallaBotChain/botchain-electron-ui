import KeyTools from './KeyTools'

export default class BaseConnector {
  constructor() {
    this.web3 = KeyTools.web3;
    this.decimals = 18;
    this.gasPrice = 10*10**9; // TODO: move this to settings
  }

  /** Returns user address */
  get account() {
    return this.web3.eth.accounts.wallet[0].address;
  }

  /** Returns ABI method signature (4 bytes)
   * @param name - method name
   **/
  getMethodSignature(name) {
    return this.contract._jsonInterface.find((f) => (f.name  == name ) ).signature;
  }
}
