/* Actions related to BotCoin ERC20 smart contract */

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

/** Sets error
 * @param error - error string
 **/
export const setError = (error) => {
  return { type: BotcoinActions.SET_BOTCOIN_ATTRIBUTE, key: 'error', value: error };
}

/** Sets in progress flag used to display in progress message or animation
 * @param inProgress - boolean value, true if request is in progress
 **/
const setInProgress = (inProgress) => {
  return { type: BotcoinActions.SET_BOTCOIN_ATTRIBUTE, key: 'inProgress', value: inProgress }
}

/** Sets current botcoin balance
 * @param balance - balance in BOT tokens (not in wei)
 **/
const setBalance = (balance) => {
  return { type: BotcoinActions.SET_BOTCOIN_ATTRIBUTE, key: 'balance', value: balance }
}

/** Sets array of transactions
 * @param transactions - array of transaction objects
 **/
const setTransactions = (transactions) => {
  return { type: BotcoinActions.SET_BOTCOIN_ATTRIBUTE, key: 'transactions', value: transactions }
}

/** Resets redux state for Botcoin storage */
export const resetState = () => {
  return { type: BotcoinActions.RESET_STATE }
}

/** Sets boolean flag if there is a pending transation
 * @param hasPendingTx - true if pending transaction is present
 **/
const setPendingTx = (hasPendingTx) => {
  return { type: BotcoinActions.SET_BOTCOIN_ATTRIBUTE, key: 'hasPendingTx', value: hasPendingTx }
}

/** Retrieves token balance from blockchain and converts from wei (uint256) to tokens (float) */
export const getBalance = () => (dispatch) => {
  dispatch(setInProgress(true))
  let botCoin = new BotCoin()
  botCoin.getTokenBalance().then((balance) => {
    dispatch(setBalance(botCoin.web3.utils.fromWei(balance, 'ether')))
    dispatch(setInProgress(false))
  }, (error) => {
    console.log(error)
    dispatch(setBalance(0))
    dispatch({ type: BotcoinActions.SET_BOTCOIN_ATTRIBUTE, key: 'error', value: "Failed to retrieve balance" })
    dispatch(setInProgress(false))
  });
}

/** Estimates gas fee for token transfer
 * @param to - recepient address
 * @param amount - amount of tokens to transfer
 **/
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

/** Transfers BOT tokens
 * @param to - recepient address
 * @param amount - amount of tokens to transfer
 **/
export const transfer = (to, amount) => async (dispatch) => {
  dispatch(setInProgress(true))
  dispatch(setPendingTx(true))
  try {
    let botCoin = new BotCoin()
    let txId = await botCoin.transferTokens(to, amount);
    dispatch(startTxObserver(txId, (status, receipt) => transferTxMined(txId, status, receipt, amount)));
    dispatch(reset('eth_transfer'));
    dispatch(setInProgress(false))
    // create new history row
    let data = { value: amount, txId, input: "0x", from: keyTools.address}
    dispatch(HistoryActions.addNewTransaction('botcoin', data))
  }catch(e) {
    console.log(e);
    dispatch( setError( "Failed to initiate transfer." ));
    dispatch(setInProgress(false))
    dispatch(setPendingTx(false))
  }
}

/** Process mined transfer transaction
 * @param txId - transaction id (hash)
 * @param status - transaction status
 * @param receipt - transaction receipt
 * @param amount - transfer amount
 **/
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
