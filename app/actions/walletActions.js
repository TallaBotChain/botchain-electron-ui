import BotCoin from '../blockchain/BotCoin';
import {reset} from 'redux-form';
import keyTools from '../blockchain/KeyTools';
import { push } from "react-router-redux";
import {remote} from 'electron';
import {resetApp} from './sharedActions';

export const WalletActions = {
  SET_WALLET_ATTRIBUTE: 'SET_WALLET_ATTRIBUTE',
  RESET_STATE: 'WALLET_RESET_STATE'
}

/** Loads network string from config into redux to use with reduxForm. */
export const loadNetwork = () => (dispatch) => {
  dispatch( setNetwork(remote.getGlobal('config').network) );
}

export const changeNetwork = (anotherNetwork) => (dispatch) => {
  remote.getGlobal('config').switchTo(anotherNetwork);
  localStorage.setItem('network', anotherNetwork);
  keyTools.connect();
  dispatch(resetApp());
  dispatch(loadNetwork());
  dispatch(push('/'));
}

/** Performs import of wallet using mnemonic phrase. Encrypts private key with password
 * @param mnemonic - 12 word passphrase
 * @param password - password to encrypt private key in local storage
 **/
export const importMnemonic = (mnemonic,password) => (dispatch) => {
  console.log("importing mnemonic: ", mnemonic);
  dispatch( setError(null) );
  if(keyTools.isValidMnemonic(mnemonic)) {
    keyTools.applyMnemonic(mnemonic, password);
    alert("Successfully imported wallet");
    dispatch( push('/') );
  } else {
    dispatch( setError("Invalid mnemonic") );
  }
}

/** Performs import of private key. encrypts private key with password
 * @param private_key - hex string of private key
 * @param password - string password used to encrypt PK for future storage
 **/
export const importPrivateKey = (private_key,password) => (dispatch) => {
  console.log("importing PK: ", private_key);
  try {
    dispatch( setError(null) );
    keyTools.applyPrivateKey(private_key, password);
    alert("Successfully imported private key");
    console.log("Imported address: ", keyTools.address);
    dispatch( push('/') );
  }catch(ex) {
    console.log(ex);
    dispatch( setError("Invalid private key") );
  }
}

/** Performs import from JSON keystore v3
 * @param json - keystore v3 json
 * @param password - to encrypt private key at rest
 **/
export const importKeystore = (json, password) => (dispatch) => {
  try {
    dispatch( setError(null) );
    keyTools.applyKeystore(json, password);
    alert("Successfully imported JSON backup");
    console.log("Imported address: ", keyTools.address);
    dispatch( push('/') );
  }catch(ex) {
    console.log(ex);
    dispatch( setError("Wrong password, unable to decrypt backup") );
  }
}

/** Unlocks wallet by decrypting private key
 * @param password - used to decrypt private key
 **/
export const unlockWallet = (password) => (dispatch) => {
  try {
    keyTools.decryptAndLoad(password);
    dispatch( setError(null) );
    dispatch( loadNetwork() );
    dispatch( push('/') );
  }catch(ex) {
    dispatch( setError("Wrong password") );
  }
}

/** Generates new mnemonic passphrase */
export const generateMnemonic = () => {
  let mnemonic = keyTools.generateMnemonic();
  return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'mnemonic', value: mnemonic };
}

/** Saves mnemonic for future use */
export const saveMnemonic = (password) => (dispatch, getState) => {
  let state = getState();
  keyTools.applyMnemonic(state.wallet.mnemonic,password);
}

/** Sets network
 * @param network - network string
 **/
export const setNetwork = (network) => {
    return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'network', value: network };
}

/** Sets error
 * @param error - error string
 **/
export const setError = (error) => {
    return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'error', value: error };
}

/** Sets in progress flag used to display in progress message or animation
 * @param inProgress - boolean value, true if request is in progress
 **/
const setInProgress = (inProgress) => {
  return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'inProgress', value: inProgress }
}

/** Sets Ether balance */
const setBalance = (balance) => {
  return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'balance', value: balance }
}

/** Sets token balance */
const setTokenBalance = (tokenBalance) => {
  return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'tokenBalance', value: tokenBalance }
}

/** Resets redux state for wallet storage */
export const resetState = () => {
  return { type: WalletActions.RESET_STATE}
}

/** Resets redux state for transfer */
export const resetTransferState = () => (dispatch) => {
  dispatch({ type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'transferTxMined', value: false });
  dispatch({ type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'transferTxId', value: null });
  dispatch({ type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'transferSuccess', value: false });
  dispatch(setError(null))
}

/** updates password used to encrypt private key */
export const updatePassword = (current_password, password, password_confirmation) => (dispatch, getState) => {
  try {
    keyTools.encryptWithNewPassword(current_password, password);
    dispatch(reset('password'));
    alert("Password was successfully changed!");
  }catch(ex) {
    dispatch( setError("Wrong password") );
  }
}

/** Exports wallet
 * @param format - json, or default - private key
 * @param password - password to decrypt key
 **/
export const exportWallet = (format, password) => (dispatch ) => {
  dispatch( setError(null) );
  try {
    keyTools.decryptAndLoad(password);
    let blob = null
    switch (format) {
      case 'json':
        blob = new Blob([JSON.stringify(keyTools.encryptedKeystore(password))], {type: 'application/json'})
        download(blob, "backup.json")
        break;
      default:
        console.log(keyTools.privateKey)
        blob = new Blob([keyTools.privateKey], {type: 'text/plain'})
        download(blob, "backup.txt")
        break;
    }
    dispatch(reset('export'));
  }catch(ex) {
    dispatch( setError("Wrong password") );
  }
}

/** Utility function to perform file download **/
const download = (file_blob, file_name) => {
  var a = window.document.createElement('a');
  a.href = window.URL.createObjectURL(file_blob);
  a.download = file_name
  document.body.appendChild(a);
  a.click();
  a.remove();
}
