import BotCoin from '../blockchain/BotCoin';
import { start as startTxObserver } from './txObserverActions';
import TxStatus from '../utils/TxStatus'
import {reset} from 'redux-form';
import keyTools from '../blockchain/KeyTools';
import axios from 'axios'
import {remote} from 'electron';
import * as HistoryActions from '../actions/historyActions';

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

const setPendingTx = (hasPendingTx) => {
  return { type: BotcoinActions.SET_BOTCOIN_ATTRIBUTE, key: 'hasPendingTx', value: hasPendingTx }
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
  dispatch(setInProgress(true))
  dispatch(setPendingTx(true))
  try {
    let botCoin = new BotCoin()
    let txId = await botCoin.transferTokens(to, amount);
    dispatch(startTxObserver(txId, (status, receipt) => transferTxMined(txId, status, receipt, amount)));
    dispatch(reset('eth_transfer'));
    dispatch(setInProgress(false))
    //create new history row
    let data = { value: amount, txId, input: "0x", from: keyTools.address}
    dispatch(HistoryActions.addNewTransaction('botcoin', data))
  }catch(e) {
    console.log(e);
    dispatch( setError( "Failed to initiate transfer." ));
    dispatch(setInProgress(false))
    dispatch(setPendingTx(false))
  }
}

const transferTxMined = (txId, status, receipt, amount) => (dispatch) => {
  dispatch(setPendingTx(false))

  if(status == TxStatus.SUCCEED){
    dispatch(getBalance())
  } else {
    dispatch( setError("Transfer transaction failed." ));
  }

  //update history row
  let data = { value: amount, txId, input: "0x", from: keyTools.address, ...receipt}
  dispatch(HistoryActions.addNewTransaction('botcoin', data))
}
