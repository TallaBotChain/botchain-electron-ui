import configMainnet from './config.mainnet.js';
import configKovan from './config.kovan.js';

class Config {

  static _instance = null;

  /** Returns singleton instance */
  static get instance() {
    if(! Config._instance) Config._instance = new Config();
    return Config._instance;
  }

  constructor() {
    this._configs = {
      'mainnet': configMainnet,
      'kovan': configKovan
    };
    this.switchTo('kovan');
  }

  switchTo(network) {
    let theConfig = this._configs[network];
    this.network = network;
    if( ! theConfig ) throw(`Configuration for ${network} is not found.`);
    Object.assign(this, theConfig);
  }

}

export default Config.instance;
