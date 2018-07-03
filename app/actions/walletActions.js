// import BotCoin from '../blockchain/BotCoin';
// import { start as startTxObserver } from './txObserverActions';
// import TxStatus from '../helpers/TxStatus'
// // import {reset} from 'redux-form';
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
    dispatch( push('/wallet') );
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
    dispatch( push('/wallet') );
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
    dispatch( push('/wallet') );
  }catch(ex) {
    console.log(ex);
    dispatch( setError("Wrong password, unable to decrypt backup") );
  }
}


export const unlockWallet = (password) => (dispatch) => {
  try {
    keyTools.decryptAndLoad(password);
    dispatch( setError(null) );
    dispatch( push('/wallet') );
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
  dispatch( push('/wallet') );
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

// export const getBalances = () => (dispatch) => {
//   dispatch(setInProgress(true))
//   let botCoin = new BotCoin()
//   // ethers
//   botCoin.getBalance().then((balance)=>{
//     dispatch(setBallance(botCoin.web3.utils.fromWei(balance, 'ether')))
//   }, (error) => {
//     console.log(error)
//     dispatch(setBallance(0))
//     dispatch({ type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'error', value: "Failed to retrieve ballance" })
//   });

//   // tokens
//   botCoin.getTokenBalance().then((balance) => {
//     dispatch(setTokenBallance(botCoin.web3.utils.fromWei(balance, 'ether')))
//     dispatch(setInProgress(false))
//   }, (error) => {
//     dispatch(setTokenBallance(0))
//     dispatch({ type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'error', value: "Failed to retrieve token ballance" })
//     dispatch(setInProgress(false))
//   });
// }



// export const transferTokens = (to, amount) => async (dispatch) => {
//   dispatch(setInProgress(true))
//   let botCoin = new BotCoin()
//   let amount_wei = botCoin.web3.utils.toWei(amount.toString(), 'ether');
//   try {
//     let txId = await botCoin.transferTokens(to, amount_wei);
//     dispatch( { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'transferTxId', value: txId });
//     dispatch(startTxObserver(txId, transferTxMined));
//   }catch(e) {
//     console.log(e);
//     dispatch( setError( "Failed to initiate transfer." ));
//     dispatch(setInProgress(false))
//   }
// }

// const transferTxMined = (status) => (dispatch) => {
//   dispatch(setInProgress(false))
//   dispatch(reset('transfer'));
//   dispatch({ type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'transferTxMined', value: true });
//   if(status == TxStatus.SUCCEED){
//     dispatch({ type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'transferSuccess', value: true });
//     dispatch(getBalances())
//   } else {
//     dispatch( setError("Transfer transaction failed." ));
//   }
// }
