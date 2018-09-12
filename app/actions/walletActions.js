import BotCoin from '../blockchain/BotCoin';
import {reset} from 'redux-form';
import keyTools from '../blockchain/KeyTools';
import { push } from "react-router-redux";

export const WalletActions = {
  SET_WALLET_ATTRIBUTE: 'SET_WALLET_ATTRIBUTE',
  RESET_STATE: 'WALLET_RESET_STATE'
}

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


export const unlockWallet = (password) => (dispatch) => {
  try {
    keyTools.decryptAndLoad(password);
    dispatch( setError(null) );
    dispatch( push('/') );
  }catch(ex) {
    dispatch( setError("Wrong password") );
  }
}

export const generateMnemonic = () => {
  let mnemonic = keyTools.generateMnemonic();
  return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'mnemonic', value: mnemonic };
}

export const saveMnemonic = (password) => (dispatch, getState) => {
  let state = getState();
  keyTools.applyMnemonic(state.wallet.mnemonic,password);
}

export const setError = (error) => {
    return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'error', value: error };
}

const setInProgress = (inProgress) => {
  return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'inProgress', value: inProgress }
}

const setBallance = (ballance) => {
  return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'balance', value: ballance }
}

const setTokenBallance = (tokenBalance) => {
  return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'tokenBalance', value: tokenBalance }
}

export const resetState = () => {
  return { type: WalletActions.RESET_STATE}
}

export const resetTransferState = () => (dispatch) => {
  dispatch({ type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'transferTxMined', value: false });
  dispatch({ type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'transferTxId', value: null });
  dispatch({ type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'transferSuccess', value: false });
  dispatch(setError(null))
}


export const updatePassword = (current_password, password, password_confirmation) => (dispatch, getState) => {
  try {
    keyTools.encryptWithNewPassword(current_password, password);
    dispatch(reset('password'));
    alert("Password was successfully changed!");
  }catch(ex) {
    dispatch( setError("Wrong password") );
  }
}

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

const download = (file_blob, file_name) => {
  var a = window.document.createElement('a');
  a.href = window.URL.createObjectURL(file_blob);
  a.download = file_name
  document.body.appendChild(a);
  a.click();
  a.remove();
}
