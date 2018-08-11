import BotCoin from '../blockchain/BotCoin';
import { start as startTxObserver } from './txObserverActions';
import TxStatus from '../utils/TxStatus'
import {reset} from 'redux-form';
import keyTools from '../blockchain/KeyTools';
import axios from 'axios'
import {remote} from 'electron';

export const BotcoinActions = {
  SET_BOTCOIN_ATTRIBUTE: 'SET_BOTCOIN_ATTRIBUTE',
  RESET_STATE: 'BOTCOIN_RESET_STATE'
}

export const setError = (error) => {
  return { type: BotcoinActions.SET_BOTCOIN_ATTRIBUTE, key: 'error', value: error };
}

const setInProgress = (inProgress) => {
  return { type: BotcoinActions.SET_BOTCOIN_ATTRIBUTE, key: 'inProgress', value: inProgress }
}

const setBallance = (ballance) => {
  return { type: BotcoinActions.SET_BOTCOIN_ATTRIBUTE, key: 'balance', value: ballance }
}

const setTransactions = (transactions) => {
  return { type: BotcoinActions.SET_BOTCOIN_ATTRIBUTE, key: 'transactions', value: transactions }
}

export const resetState = () => {
  return { type: BotcoinActions.RESET_STATE }
}

export const resetTransferState = () => (dispatch) => {
  dispatch({ type: BotcoinActions.SET_BOTCOIN_ATTRIBUTE, key: 'transferTxMined', value: false });
  dispatch({ type: BotcoinActions.SET_BOTCOIN_ATTRIBUTE, key: 'transferTxId', value: null });
  dispatch({ type: BotcoinActions.SET_BOTCOIN_ATTRIBUTE, key: 'transferSuccess', value: false });
  dispatch(setError(null))
}


export const getBalance = () => (dispatch) => {
  dispatch(setInProgress(true))
  let botCoin = new BotCoin()
  // ethers
  botCoin.getTokenBalance().then((balance) => {
    dispatch(setBallance(botCoin.web3.utils.fromWei(balance, 'ether')))
    dispatch(setInProgress(false))
  }, (error) => {
    console.log(error)
    dispatch(setBallance(0))
    dispatch({ type: BotcoinActions.SET_BOTCOIN_ATTRIBUTE, key: 'error', value: "Failed to retrieve balance" })
    dispatch(setInProgress(false))
  });
}


export const transferEstGas = (to, amount) => async (dispatch) => {
  dispatch(setInProgress(true))
  try {
    let botCoin = new BotCoin()
    let transferGas = await botCoin.transferTokensEstGas(to, amount);
    let gasFee = botCoin.web3.utils.fromWei((transferGas*botCoin.gasPrice).toString())
    dispatch( { type: BotcoinActions.SET_BOTCOIN_ATTRIBUTE, key: 'transferTxEstGas', value: gasFee });
  }catch(e) {
    console.log(e);
    dispatch( setError( "Failed to estimate gas." ));
    dispatch(setInProgress(false))
  }
}


export const transfer = (to, amount) => async (dispatch) => {
  dispatch(resetTransferState())
  dispatch(setInProgress(true))
  let botCoin = new BotCoin()
  try {
    let txId = await botCoin.transferTokens(to, amount);
    dispatch( { type: BotcoinActions.SET_BOTCOIN_ATTRIBUTE, key: 'transferTxId', value: txId });
    dispatch(startTxObserver(txId, transferTxMined));
  }catch(e) {
    console.log(e);
    dispatch( setError( "Failed to initiate transfer." ));
    dispatch(setInProgress(false))
  }
}

const transferTxMined = (status) => (dispatch) => {
  dispatch(setInProgress(false))
  dispatch(reset('eth_transfer'));
  dispatch({ type: BotcoinActions.SET_BOTCOIN_ATTRIBUTE, key: 'transferTxMined', value: true });
  if(status == TxStatus.SUCCEED){
    dispatch({ type: BotcoinActions.SET_BOTCOIN_ATTRIBUTE, key: 'transferSuccess', value: true });
    dispatch(getBalance())
    dispatch(getTransactionList())
  } else {
    dispatch( setError("Transfer transaction failed." ));
  }
}

export const getTransactionList = () => (dispatch) => {
  axios.get(remote.getGlobal('config').etherscan_api_url, {
    params: {
      module: "account",
      action: "tokentx",
      address: keyTools.address,
      contractaddress: remote.getGlobal('config').botcoin_contract,
      sort: "desc",
      apikey: remote.getGlobal('config').etherscan_api_key
    }
  })
  .then(function (response) {
    dispatch(setTransactions(response.data.result))
  })
  .catch(function (error) {
    dispatch( setError("Failed to retreive transaction history." ));
  })
}
