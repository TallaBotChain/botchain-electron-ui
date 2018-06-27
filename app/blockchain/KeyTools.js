import Web3 from 'web3'
import EthereumHDKey from 'ethereumjs-wallet/hdkey'
import bip39 from 'bip39'
import createHash from 'create-hash'

class KeyTools {

  static _instance = null;

  static get instance() {
    if(! KeyTools._instance) KeyTools._instance = new KeyTools("https://kovan.infura.io/quylRadtDHfbMF9rF15R"); // TODO: config
    return KeyTools._instance;
  }

  constructor(rpcUrl) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  }

  get walletReady() {
    return this.privateKeyPresent && this.privateKeyUnlocked;
  }

  get privateKeyPresent() {
    return ! (localStorage.getItem(this.walletStorageKey) === null);
  }

  get privateKeyUnlocked() {
    return this.web3.eth.accounts.wallet.length > 0;
  }

  get address() {
    return this.web3.eth.accounts.wallet[0].address;
  }

  generateMnemonic() {
    return bip39.generateMnemonic();
  }

  applyMnemonic(mnemonic, password) {
    console.log("mnemonic: ", mnemonic);
    let pk = this.privateKeyFromMnemonic(mnemonic);
    this.encryptAndSave(pk, password);
  }

  privateKeyFromMnemonic(mnemonic) {
    let hdkey = EthereumHDKey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
    let walletPath = "m/44'/60'/0'/0/";
    let wallet = hdkey.derivePath(walletPath + "0").getWallet();
    let address = "0x" + wallet.getAddress().toString("hex");
    console.log("address: ", address);
    return "0x"+wallet.getPrivateKey().toString("hex");
  }

  get walletStorageKey() {
    return "botcoin";
  }

  set privateKey(pk) {
    this.web3.eth.accounts.wallet.clear();
    this.web3.eth.accounts.wallet.add(pk);
  }

  encryptAndSave(pk, password) {
    this.privateKey = pk;
    this.web3.eth.accounts.wallet.save(password, this.walletStorageKey);
  }

  encryptWithNewPassword(current_password, password) {
    this.decryptAndLoad(current_password)
    let privateKey = this.web3.eth.accounts.wallet[0].privateKey
    this.encryptAndSave(privateKey, password)
  }

  decryptAndLoad(password) {
    return this.web3.eth.accounts.wallet.load(password, this.walletStorageKey);
  }
}
export default KeyTools.instance;
