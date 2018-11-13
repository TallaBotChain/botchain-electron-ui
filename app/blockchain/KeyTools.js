import Web3 from 'web3'
import EthereumHDKey from 'ethereumjs-wallet/hdkey'
import bip39 from 'bip39'
import createHash from 'create-hash'
import {remote} from 'electron';

class KeyTools {

  static _instance = null;

  /** Returns singleton instance */
  static get instance() {
    if(! KeyTools._instance) KeyTools._instance = new KeyTools(remote.getGlobal('config').geth_rpc_url);
    return KeyTools._instance;
  }

  /** @constructor
   * @param rpcUrl - geth/parity RPC URL, most likely Infura
   **/
  constructor(rpcUrl) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  }

  /** Returns true if wallet is present and unlocked */
  get walletReady() {
    return this.privateKeyPresent && this.privateKeyUnlocked;
  }

  /** Returns true if wallet is locked */
  get walletLocked() {
    return this.privateKeyPresent && !this.privateKeyUnlocked;
  }

  /** Returns true if private key is present */
  get privateKeyPresent() {
    return ! (localStorage.getItem(this.walletStorageKey) === null);
  }

  /** Returns true if private key is decrypted and available */
  get privateKeyUnlocked() {
    return this.web3.eth.accounts.wallet.length > 0;
  }

  /** Returns wallet address */
  get address() {
    return this.web3.eth.accounts.wallet[0].address;
  }

  /** Returns private key if present */
  get privateKey() {
    return this.web3.eth.accounts.wallet[0].privateKey;
  }

  /** Encrypts private key with password and returns JSON Keystore V3 */
  encryptedKeystore (password) {
    return this.web3.eth.accounts.wallet.encrypt(password);
  }

  /** Generates new mnemonic passphrase */
  generateMnemonic() {
    return bip39.generateMnemonic();
  }

  /** Imports private key and stores it encrypted with password */
  applyPrivateKey(pk, password) {
    this.encryptAndSave(this.web3.utils.isHexStrict(pk) ? pk : "0x"+pk, password);
  }

  /** Imports mnemonic and stores private key encrypted with password */
  applyMnemonic(mnemonic, password) {
    console.log("mnemonic: ", mnemonic);
    let pk = this.privateKeyFromMnemonic(mnemonic);
    this.encryptAndSave(pk, password);
  }

  /** Imports keystore and stores private key encrypted with password */
  applyKeystore(json, password) {
    let keystore = JSON.parse(json);
    console.log("keystore: ", keystore);
    this.web3.eth.accounts.wallet.clear();
    this.web3.eth.accounts.wallet.decrypt(keystore, password);
    this.web3.eth.accounts.wallet.save(password, this.walletStorageKey);
  }

  /** Creates private key from mnemonic passphrase */
  privateKeyFromMnemonic(mnemonic) {
    let hdkey = EthereumHDKey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
    let walletPath = "m/44'/60'/0'/0/";
    let wallet = hdkey.derivePath(walletPath + "0").getWallet();
    let address = "0x" + wallet.getAddress().toString("hex");
    console.log("address: ", address);
    return "0x"+wallet.getPrivateKey().toString("hex");
  }

  /** Returns localstorage key */
  get walletStorageKey() {
    return "botcoin";
  }

  /** Sets private key */
  set privateKey(pk) {
    this.web3.eth.accounts.wallet.clear();
    this.web3.eth.accounts.wallet.add(pk);
  }

  /** Imports private key and stores it encrypted with password */
  encryptAndSave(pk, password) {
    this.privateKey = pk;
    this.web3.eth.accounts.wallet.save(password, this.walletStorageKey);
  }

  /** Changes private key encryption password */
  encryptWithNewPassword(current_password, password) {
    this.decryptAndLoad(current_password)
    let privateKey = this.web3.eth.accounts.wallet[0].privateKey
    this.encryptAndSave(privateKey, password)
  }

  /** Decrypts private key and loads from localstorage */
  decryptAndLoad(password) {
    return this.web3.eth.accounts.wallet.load(password, this.walletStorageKey);
  }

  /** Checks if mnemonic is valid */
  isValidMnemonic(mnemonic) {
    return bip39.validateMnemonic(mnemonic)
  }
}
export default KeyTools.instance;
